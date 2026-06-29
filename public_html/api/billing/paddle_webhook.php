<?php
// ══════════════════════════════════════════════
//  POST /api/billing/paddle_webhook.php
//  Приймає Paddle Billing webhooks
//  Налаштуйте в Paddle Dashboard → Notifications
//  URL: https://indexfast.pro/api/billing/paddle_webhook.php
//
//  Оброблювані події:
//  subscription.created    → активуємо план
//  subscription.updated    → оновлюємо план/дату
//  subscription.canceled   → скидаємо на start при завершенні
//  transaction.completed   → разова оплата (якщо не підписка)
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/config.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';
require_once dirname(dirname(__DIR__)) . '/api/helpers.php';

// Тільки POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// ── Читаємо тіло запиту
$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody, true);

if (!$payload) {
    http_response_code(400);
    exit('Invalid JSON');
}

// ── Верифікація підпису Paddle (обов'язково в production)
$webhookSecret = env('PADDLE_WEBHOOK_SECRET', '');
if ($webhookSecret) {
    $signature = $_SERVER['HTTP_PADDLE_SIGNATURE'] ?? '';
    if (!verifyPaddleSignature($rawBody, $signature, $webhookSecret)) {
        http_response_code(401);
        exit('Invalid signature');
    }
}

$eventType = $payload['event_type']     ?? '';
$data      = $payload['data']           ?? [];
$customData = $data['custom_data']      ?? [];

// ── Логуємо webhook
error_log("[paddle_webhook] event={$eventType} id=" . ($data['id'] ?? ''));

// ── Визначаємо план по Paddle Price ID
function planByPriceId(string $priceId): string {
    return match($priceId) {
        'pri_01kpy78kbrnk3pzxc9grpe2ye3' => 'pro',    // PRO ₴499/міс
        'pri_01kpy7am19g27zn99w8k74qdxq' => 'agency', // Agency ₴2999/міс
        default                           => '',
    };
}

// ── Отримуємо priceId з підписки
function getPriceIdFromSub(array $data): string {
    $items = $data['items'] ?? [];
    return $items[0]['price']['id'] ?? ($items[0]['price_id'] ?? '');
}

// ── Знаходимо юзера по Paddle Customer ID або custom_data.user_id
function findUser(array $data, array $customData): ?array {
    // Спочатку по user_id в custom_data (найнадійніше)
    if (!empty($customData['user_id'])) {
        $u = DB::row("SELECT id, email, name, plan FROM users WHERE id=?",
            [(int)$customData['user_id']]);
        if ($u) return $u;
    }

    // По Paddle customer_id
    $customerId = $data['customer_id'] ?? '';
    if ($customerId) {
        $u = DB::row("SELECT id, email, name, plan FROM users WHERE paddle_customer_id=?",
            [$customerId]);
        if ($u) return $u;
    }

    // По email з Paddle
    $email = $data['customer']['email'] ?? '';
    if ($email) {
        return DB::row("SELECT id, email, name, plan FROM users WHERE email=?", [$email]);
    }

    return null;
}

// ── Встановлюємо план юзеру
function activatePlan(array $user, string $plan, ?string $expiresAt,
                      string $subId, string $customerId): void {
    DB::exec(
        "UPDATE users
         SET plan = ?, plan_expires_at = ?, plan_started_at = NOW(),
             paddle_sub_id = NULLIF(?, ''),
             paddle_customer_id = NULLIF(?, ''),
             updated_at = NOW()
         WHERE id = ?",
        [$plan, $expiresAt, $subId, $customerId, $user['id']]
    );
    error_log("[paddle_webhook] User #{$user['id']} plan set to {$plan}, expires {$expiresAt}");
}

// ── Підраховуємо expires_at по billing cycle
function calcExpiresAt(array $data): ?string {
    // Для підписки — беремо дату наступного білінгу
    $nextBilled = $data['next_billed_at'] ?? $data['current_billing_period']['ends_at'] ?? null;
    if ($nextBilled) {
        return date('Y-m-d H:i:s', strtotime($nextBilled));
    }
    // Fallback: +1 місяць
    return date('Y-m-d H:i:s', strtotime('+1 month'));
}

// ════════════════════════════════════════
//  Обробка подій
// ════════════════════════════════════════
try {
    switch ($eventType) {

        // ── Нова підписка або перша оплата
        case 'subscription.created':
        case 'subscription.activated': {
            $priceId    = getPriceIdFromSub($data);
            $plan       = planByPriceId($priceId);
            if (!$plan) { http_response_code(200); exit('Unknown price, skip'); }

            $user = findUser($data, $customData);
            if (!$user) { http_response_code(200); exit('User not found, skip'); }

            $expiresAt  = calcExpiresAt($data);
            $subId      = $data['id']          ?? '';
            $customerId = $data['customer_id'] ?? '';

            activatePlan($user, $plan, $expiresAt, $subId, $customerId);

            // Вітальний email
            try {
                $planLabel = $plan === 'pro' ? 'PRO' : 'Агенція';
                Mailer::send($user['email'],
                    "✅ Підписка {$planLabel} активована — IndexFast",
                    buildActivationEmail($user['name'], $planLabel, $expiresAt)
                );
            } catch (Throwable) {}
            break;
        }

        // ── Поновлення підписки (щомісячне)
        case 'subscription.updated':
        case 'transaction.completed': {
            // transaction.completed спрацьовує при кожному успішному платежі
            $subId = $data['subscription_id'] ?? $data['id'] ?? '';
            if (!$subId) { http_response_code(200); exit('No sub id'); }

            $user = DB::row("SELECT id, email, name, plan FROM users WHERE paddle_sub_id=?", [$subId]);
            if (!$user) {
                $user = findUser($data, $customData);
            }
            if (!$user) { http_response_code(200); exit('User not found'); }

            $priceId   = getPriceIdFromSub($data);
            $plan      = planByPriceId($priceId) ?: $user['plan'];
            $expiresAt = calcExpiresAt($data);
            $customerId = $data['customer_id'] ?? '';

            activatePlan($user, $plan, $expiresAt, $subId, $customerId);
            break;
        }

        // ── Підписка скасована — скидаємо план при завершенні
        case 'subscription.canceled': {
            $subId = $data['id'] ?? '';
            if (!$subId) break;

            // Paddle дає canceled_at — до цієї дати доступ є
            $canceledAt = $data['canceled_at'] ?? $data['scheduled_change']['effective_at'] ?? null;

            // Якщо canceled_at в майбутньому — просто оновлюємо expires
            // Cron сам скине план коли прийде час
            if ($canceledAt && strtotime($canceledAt) > time()) {
                DB::exec(
                    "UPDATE users SET plan_expires_at = ?, updated_at = NOW()
                     WHERE paddle_sub_id = ?",
                    [date('Y-m-d H:i:s', strtotime($canceledAt)), $subId]
                );
                error_log("[paddle_webhook] Sub {$subId} canceled, expires {$canceledAt}");
            } else {
                // Скасована одразу — скидаємо план
                DB::exec(
                    "UPDATE users
                     SET plan = 'start', plan_expires_at = NULL, plan_started_at = NULL,
                         paddle_sub_id = NULL, updated_at = NOW()
                     WHERE paddle_sub_id = ?",
                    [$subId]
                );
                error_log("[paddle_webhook] Sub {$subId} canceled immediately → start");
            }
            break;
        }

        // ── Платіж невдалий
        case 'subscription.payment_failed': {
            $subId = $data['id'] ?? '';
            $user  = $subId
                ? DB::row("SELECT id, email, name FROM users WHERE paddle_sub_id=?", [$subId])
                : null;

            if ($user) {
                Mailer::send($user['email'],
                    '⚠ Не вдалось списати кошти — IndexFast',
                    buildPaymentFailedEmail($user['name'])
                );
            }
            break;
        }

        default:
            // Ігноруємо невідомі події
            break;
    }

} catch (Throwable $e) {
    error_log("[paddle_webhook] Error: " . $e->getMessage());
    http_response_code(500);
    exit('Server error');
}

http_response_code(200);
echo 'OK';

// ════════════════════════════════════════
//  Верифікація підпису Paddle
// ════════════════════════════════════════
function verifyPaddleSignature(string $body, string $signature, string $secret): bool {
    // Paddle підпис: h1=HMAC-SHA256
    if (!str_starts_with($signature, 'h1=')) return false;
    $expected = 'h1=' . hash_hmac('sha256', $body, $secret);
    return hash_equals($expected, $signature);
}

// ════════════════════════════════════════
//  Email шаблони
// ════════════════════════════════════════
function buildActivationEmail(string $name, string $plan, ?string $expiresAt): string {
    $date = $expiresAt ? date('d.m.Y', strtotime($expiresAt)) : '—';
    return <<<HTML
    <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
    <body style="background:#050508;margin:0;padding:20px;font-family:Arial,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0"
      style="background:#111119;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;max-width:520px">
    <tr><td style="background:#050508;padding:20px 32px;border-bottom:1px solid rgba(255,255,255,0.06)">
      <span style="font-size:20px;font-weight:800;color:#eeeef6">Index<span style="color:#00ff88">Fast</span></span>
    </td></tr>
    <tr><td style="padding:32px;color:#c8c8d8;font-size:15px;line-height:1.7">
      <p>Привіт, <strong style="color:#eeeef6">{$name}</strong>! 🎉</p>
      <p>Підписку <strong style="color:#00ff88">{$plan}</strong> успішно активовано.</p>
      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.15);border-radius:12px;margin:20px 0">
        <tr><td style="padding:16px 20px;font-size:14px">
          ✅ Підписка активна до <strong style="color:#eeeef6">{$date}</strong>
        </td></tr>
      </table>
      <p>Тепер вам доступні всі можливості плану. Перейдіть в кабінет щоб почати:</p>
      <p style="text-align:center;margin:28px 0">
        <a href="https://indexfast.pro/app/dashboard"
           style="background:#00ff88;color:#050508;padding:13px 28px;border-radius:100px;
                  text-decoration:none;font-weight:700;font-size:15px">
          Відкрити кабінет →
        </a>
      </p>
    </td></tr>
    <tr><td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;color:#555570;text-align:center">
      © IndexFast · <a href="https://indexfast.pro" style="color:#555570">indexfast.pro</a>
    </td></tr>
    </table></td></tr></table></body></html>
    HTML;
}

function buildPaymentFailedEmail(string $name): string {
    return <<<HTML
    <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
    <body style="background:#050508;margin:0;padding:20px;font-family:Arial,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0"
      style="background:#111119;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;max-width:520px">
    <tr><td style="background:#050508;padding:20px 32px;border-bottom:1px solid rgba(255,255,255,0.06)">
      <span style="font-size:20px;font-weight:800;color:#eeeef6">Index<span style="color:#00ff88">Fast</span></span>
    </td></tr>
    <tr><td style="padding:32px;color:#c8c8d8;font-size:15px;line-height:1.7">
      <p>Привіт, <strong style="color:#eeeef6">{$name}</strong>!</p>
      <p>⚠ На жаль, не вдалось списати кошти за підписку. Paddle спробує ще кілька разів автоматично.</p>
      <p>Якщо проблема повториться — перевірте платіжні дані або зверніться до підтримки:</p>
      <p style="text-align:center;margin:28px 0">
        <a href="https://t.me/indexfastgoogle"
           style="background:#ffd060;color:#050508;padding:13px 28px;border-radius:100px;
                  text-decoration:none;font-weight:700;font-size:15px">
          Написати в підтримку →
        </a>
      </p>
    </td></tr>
    <tr><td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;color:#555570;text-align:center">
      © IndexFast · <a href="https://indexfast.pro" style="color:#555570">indexfast.pro</a>
    </td></tr>
    </table></td></tr></table></body></html>
    HTML;
}
