<?php
// public_html/api/payment/providers/PaddleProvider.php
require_once dirname(__DIR__, 2) . '/config.php';
require_once dirname(__DIR__) . '/PaymentProviderInterface.php';

class PaddleProvider implements PaymentProviderInterface
{
    public function getId(): string    { return 'paddle'; }
    public function getLabel(): string { return 'Paddle'; }
    public function getIcon(): string  { return 'paddle'; }

    public function isEnabled(): bool
    {
        return env('PADDLE_ENABLED', 'false') === 'true';
    }

    public function createPaymentSession(array $params): array
    {
        $priceId = $this->getPriceId($params['plan_id'], $params['period']);
        $url = 'https://checkout.paddle.com/checkout/custom-checkout?' . http_build_query([
            'items[0][priceId]'   => $priceId,
            'items[0][quantity]'  => 1,
            'customer[email]'     => $params['email'],
            'customData[user_id]' => $params['user_id'],
            'customData[plan_id]' => $params['plan_id'],
            'customData[sub_id]'  => $params['sub_id'],
            'successUrl'          => $params['success_url'],
        ]);
        return ['redirect_url' => $url, 'payment_id' => 'pending_' . $params['sub_id'], 'extra' => []];
    }

    public function verifyWebhookSignature(string $rawBody, array $headers): bool
    {
        $secret = env('PADDLE_WEBHOOK_SECRET', '');
        if (!$secret) return true;

        $signature = isset($headers['paddle-signature']) ? $headers['paddle-signature'] : '';
        if (!$signature) return false;

        $parts = [];
        foreach (explode(';', $signature) as $part) {
            $kv = explode('=', $part, 2);
            if (count($kv) === 2) $parts[$kv[0]] = $kv[1];
        }

        $expected = hash_hmac('sha256', $parts['ts'] . ':' . $rawBody, $secret);
        return hash_equals($expected, isset($parts['h1']) ? $parts['h1'] : '');
    }

    public function parseWebhookEvent(string $rawBody, array $headers): array
    {
        $data      = json_decode($rawBody, true);
        $eventType = isset($data['event_type']) ? $data['event_type'] : '';
        $obj       = isset($data['data'])       ? $data['data']       : [];
        $custom    = isset($obj['custom_data']) ? $obj['custom_data'] : [];

        switch ($eventType) {
            case 'subscription.created':
            case 'subscription.activated': $event = 'payment.success';       break;
            case 'transaction.completed':  $event = 'subscription.renewed';  break;
            case 'transaction.payment_failed': $event = 'payment.failed';    break;
            case 'subscription.canceled':  $event = 'subscription.cancelled'; break;
            case 'transaction.refunded':   $event = 'payment.refunded';      break;
            default:                       $event = 'unknown';
        }

        $expiresAt = null;
        if (!empty($obj['current_billing_period']['ends_at'])) {
            $expiresAt = date('Y-m-d H:i:s', strtotime($obj['current_billing_period']['ends_at']));
        }

        $amount = null;
        if (!empty($obj['details']['totals']['total'])) {
            $amount = (float)$obj['details']['totals']['total'] / 100;
        }

        return [
            'event'       => $event,
            'external_id' => isset($obj['id']) ? $obj['id'] : '',
            'sub_id'      => isset($obj['subscription_id']) ? $obj['subscription_id'] : (isset($obj['id']) ? $obj['id'] : ''),
            'user_id'     => isset($custom['user_id']) ? (int)$custom['user_id'] : null,
            'email'       => isset($obj['customer']['email']) ? $obj['customer']['email'] : null,
            'plan_id'     => isset($custom['plan_id']) ? $custom['plan_id'] : null,
            'amount'      => $amount,
            'currency'    => strtoupper(isset($obj['currency_code']) ? $obj['currency_code'] : ''),
            'expires_at'  => $expiresAt,
            'raw'         => $data,
        ];
    }

    public function cancelSubscription(string $externalSubId): bool
    {
        $apiKey = env('PADDLE_API_KEY', '');
        if (!$apiKey) return false;

        $ch = curl_init("https://api.paddle.com/subscriptions/{$externalSubId}/cancel");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode(['effective_from' => 'next_billing_period']),
            CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json'],
        ]);
        curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return in_array($code, [200, 201], true);
    }

    private function getPriceId(string $planId, string $period): string
    {
        $key = 'PADDLE_PRICE_' . strtoupper($planId) . '_' . strtoupper($period);
        $id  = env($key, '');
        if (!$id) throw new RuntimeException("Set {$key} in .env");
        return $id;
    }
}
