<?php
// public_html/api/payment/WebhookHandler.php
// Сумісність: PHP 7.4+, MySQL 5.7+

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/PaymentManager.php';
require_once __DIR__ . '/SubscriptionService.php';

class WebhookHandler
{
    private SubscriptionService $svc;

    public function __construct()
    {
        $this->svc = new SubscriptionService();
    }

    public function handle(string $providerId): void
    {
        $rawBody = (string)file_get_contents('php://input');
        $headers = $this->normalizeHeaders();
        $ip      = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
        $logId   = $this->logRequest($providerId, $rawBody, $headers, $ip);

        try {
            $provider = PaymentManager::getInstance()->getProvider($providerId);

            if (!$provider) {
                $this->logUpdate($logId, 'ignored', 'Unknown provider');
                http_response_code(400);
                echo '{"error":"Unknown provider"}';
                return;
            }

            if (!$provider->verifyWebhookSignature($rawBody, $headers)) {
                $this->logUpdate($logId, 'failed', 'Invalid signature');
                http_response_code(401);
                echo '{"error":"Invalid signature"}';
                return;
            }

            $event = $provider->parseWebhookEvent($rawBody, $headers);

            DB::exec(
                "UPDATE webhook_logs SET event_type = ?, external_id = ? WHERE id = ?",
                [
                    isset($event['event'])       ? $event['event']       : '',
                    isset($event['external_id']) ? $event['external_id'] : '',
                    $logId
                ]
            );

            if ($event['event'] === 'unknown') {
                $this->logUpdate($logId, 'ignored', 'Unknown event type');
                http_response_code(200);
                echo '{"status":"ignored"}';
                return;
            }

            $this->processEvent($event, $providerId);
            $this->logUpdate($logId, 'processed');
            http_response_code(200);
            echo '{"status":"ok"}';

        } catch (Exception $e) {
            error_log("[WebhookHandler:{$providerId}] " . $e->getMessage());
            $this->logUpdate($logId, 'failed', $e->getMessage());
            http_response_code(500);
            echo '{"error":"Internal error"}';
        }
    }

    private function processEvent(array $event, string $providerId): void
    {
        $type = isset($event['event']) ? $event['event'] : '';

        if ($type === 'payment.success' || $type === 'subscription.renewed') {
            $this->onSuccess($event, $providerId);
        } elseif ($type === 'payment.failed') {
            $this->onFailed($event, $providerId);
        } elseif ($type === 'payment.refunded') {
            $this->onRefunded($event, $providerId);
        } elseif ($type === 'subscription.cancelled') {
            $this->onCancelled($event, $providerId);
        }
    }

    private function onSuccess(array $event, string $pid): void
    {
        $sub = $this->findSub($event, $pid);
        if (!$sub) {
            error_log("[WebhookHandler] success: no subscription found. event=" . json_encode($event));
            return;
        }

        $expiresAt = isset($event['expires_at']) ? $event['expires_at'] : null;
        if (!$expiresAt && !empty($sub['period'])) {
            $expiresAt = ($sub['period'] === 'year')
                ? date('Y-m-d H:i:s', strtotime('+1 year'))
                : date('Y-m-d H:i:s', strtotime('+1 month'));
        }

        $extId  = isset($event['external_id']) ? $event['external_id'] : '';
        $subId  = isset($event['sub_id'])      ? $event['sub_id']      : null;

        $this->svc->activate((int)$sub['user_id'], (int)$sub['id'], $extId, $subId, $expiresAt);
    }

    private function onFailed(array $event, string $pid): void
    {
        $sub = $this->findSub($event, $pid);
        if (!$sub) return;

        DB::exec(
            "UPDATE subscriptions SET status = 'failed' WHERE id = ? AND status = 'pending'",
            [$sub['id']]
        );
        DB::exec(
            "UPDATE payments SET status = 'failed'
             WHERE subscription_id = ? AND status = 'pending'",
            [$sub['id']]
        );
    }

    private function onRefunded(array $event, string $pid): void
    {
        $sub = $this->findSub($event, $pid);
        if (!$sub) return;

        DB::exec("UPDATE subscriptions SET status = 'refunded' WHERE id = ?", [$sub['id']]);
        DB::exec(
            "UPDATE payments SET status = 'refunded'
             WHERE subscription_id = ? ORDER BY created_at DESC LIMIT 1",
            [$sub['id']]
        );
        DB::exec(
            "UPDATE users
             SET plan = 'free', plan_expires_at = NULL, plan_started_at = NULL,
                 active_subscription_id = NULL
             WHERE id = ? AND active_subscription_id = ?",
            [$sub['user_id'], $sub['id']]
        );
    }

    private function onCancelled(array $event, string $pid): void
    {
        $sub = $this->findSub($event, $pid);
        if (!$sub) return;

        DB::exec(
            "UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW() WHERE id = ?",
            [$sub['id']]
        );

        $expiresAt = isset($event['expires_at']) ? $event['expires_at'] : null;
        $future    = $expiresAt && strtotime($expiresAt) > time();

        if (!$future) {
            DB::exec(
                "UPDATE users
                 SET plan = 'free', plan_expires_at = NULL, active_subscription_id = NULL
                 WHERE id = ? AND active_subscription_id = ?",
                [$sub['user_id'], $sub['id']]
            );
        }
    }

    private function findSub(array $event, string $pid): ?array
    {
        // 1) За external_payment_id
        if (!empty($event['external_id'])) {
            $s = DB::row(
                "SELECT * FROM subscriptions WHERE external_payment_id = ?",
                [$event['external_id']]
            );
            if ($s) return $s;
        }

        // 2) За external_sub_id
        if (!empty($event['sub_id'])) {
            $s = DB::row(
                "SELECT * FROM subscriptions WHERE external_sub_id = ?",
                [$event['sub_id']]
            );
            if ($s) return $s;
        }

        // 3) За user_id або email + провайдер
        $uid = isset($event['user_id']) ? (int)$event['user_id'] : 0;
        if (!$uid && !empty($event['email'])) {
            $u = DB::row("SELECT id FROM users WHERE email = ?", [$event['email']]);
            $uid = $u ? (int)$u['id'] : 0;
        }

        if ($uid) {
            return DB::row(
                "SELECT * FROM subscriptions
                 WHERE user_id = ? AND payment_method = ?
                 ORDER BY created_at DESC LIMIT 1",
                [$uid, $pid]
            );
        }

        return null;
    }

    private function logRequest(string $provider, string $body, array $headers, string $ip): int
    {
        DB::exec(
            "INSERT INTO webhook_logs (provider, raw_headers, raw_body, ip, status)
             VALUES (?, ?, ?, ?, 'received')",
            [$provider, json_encode($headers), $body, $ip]
        );
        return (int)DB::pdo()->lastInsertId();
    }

    private function logUpdate(int $id, string $status, ?string $error = null): void
    {
        DB::exec(
            "UPDATE webhook_logs SET status = ?, error = ?, processed_at = NOW() WHERE id = ?",
            [$status, $error, $id]
        );
    }

    private function normalizeHeaders(): array
    {
        $headers = [];
        foreach ($_SERVER as $k => $v) {
            // PHP 7.4 compatible — без str_starts_with
            if (substr($k, 0, 5) === 'HTTP_') {
                $key = strtolower(str_replace('_', '-', substr($k, 5)));
                $headers[$key] = $v;
            }
        }
        if (function_exists('getallheaders')) {
            foreach (getallheaders() as $k => $v) {
                $headers[strtolower($k)] = $v;
            }
        }
        return $headers;
    }
}
