<?php
// public_html/admin/promos.php
require_once __DIR__ . '/auth.php';

$msg = $msgType = '';

// ── 1. Ініціалізація або оновлення бази даних
// Ми перестворимо таблицю з розширеною структурою для підтримки нових вимог
try {
    DB::exec("
        CREATE TABLE IF NOT EXISTS `promo_codes` (
          `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `code`             VARCHAR(50) NOT NULL,
          `discount_type`    VARCHAR(20) NOT NULL DEFAULT 'percentage',
          `discount_value`   DECIMAL(10,2) NOT NULL,
          `currency_code`    VARCHAR(3) NOT NULL DEFAULT 'USD',
          `description`      VARCHAR(255) DEFAULT NULL,
          `recur_type`       VARCHAR(20) NOT NULL DEFAULT 'forever',
          `recur_count`      INT UNSIGNED DEFAULT NULL,
          `target_plan`      VARCHAR(50) DEFAULT NULL,
          `expires_at`       DATETIME DEFAULT NULL,
          `max_uses`         INT UNSIGNED DEFAULT NULL,
          `uses_count`       INT UNSIGNED NOT NULL DEFAULT 0,
          `restrict_to`      TEXT DEFAULT NULL,
          `paddle_id`        VARCHAR(100) DEFAULT NULL,
          `stripe_id`        VARCHAR(100) DEFAULT NULL,
          `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_code` (`code`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Перевіримо, чи потрібні альтери якщо таблиця вже існувала
    $columns = DB::all("SHOW COLUMNS FROM promo_codes");
    $hasType = false;
    foreach ($columns as $col) {
        if ($col['Field'] === 'discount_type') {
            $hasType = true;
            break;
        }
    }
    
    // Якщо стара таблиця без нових колонок — оновимо структуру
    if (!$hasType) {
        DB::exec("DROP TABLE IF EXISTS `promo_codes`");
        DB::exec("
            CREATE TABLE `promo_codes` (
              `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
              `code`             VARCHAR(50) NOT NULL,
              `discount_type`    VARCHAR(20) NOT NULL DEFAULT 'percentage',
              `discount_value`   DECIMAL(10,2) NOT NULL,
              `currency_code`    VARCHAR(3) NOT NULL DEFAULT 'USD',
              `description`      VARCHAR(255) DEFAULT NULL,
              `recur_type`       VARCHAR(20) NOT NULL DEFAULT 'forever',
              `recur_count`      INT UNSIGNED DEFAULT NULL,
              `target_plan`      VARCHAR(50) DEFAULT NULL,
              `expires_at`       DATETIME DEFAULT NULL,
              `max_uses`         INT UNSIGNED DEFAULT NULL,
              `uses_count`       INT UNSIGNED NOT NULL DEFAULT 0,
              `restrict_to`      TEXT DEFAULT NULL,
              `paddle_id`        VARCHAR(100) DEFAULT NULL,
              `stripe_id`        VARCHAR(100) DEFAULT NULL,
              `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (`id`),
              UNIQUE KEY `uq_code` (`code`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    }
} catch (Exception $e) {
    error_log("[Promos Migration] " . $e->getMessage());
}

try {
    DB::exec("ALTER TABLE `subscriptions` ADD COLUMN `promo_code` VARCHAR(50) DEFAULT NULL");
} catch (Exception $e) {}

// ── 2. Отримання ключів платіжних систем
$paddleKey = env('PADDLE_API_KEY', '');
$stripeKey = env('STRIPE_SECRET_KEY', '');

$isPaddleAvailable = !empty($paddleKey);
$isStripeAvailable = !empty($stripeKey);

// ── 3. Створення промокоду
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['create'])) {
    $code        = strtoupper(trim($_POST['code'] ?? ''));
    $type        = trim($_POST['discount_type'] ?? 'percentage');
    $value       = (float)($_POST['discount_value'] ?? 0);
    $currency    = trim($_POST['currency_code'] ?? 'USD');
    $desc        = trim($_POST['description'] ?? '');
    $recurType   = trim($_POST['recur_type'] ?? 'forever');
    $recurCount  = trim($_POST['recur_count'] ?? '');
    $expiry      = trim($_POST['expires_at'] ?? '');
    $maxUses     = trim($_POST['max_uses'] ?? '');
    $restrictTo  = trim($_POST['restrict_to'] ?? '');

    $syncPaddle  = isset($_POST['sync_paddle']) && $isPaddleAvailable;
    $syncStripe  = isset($_POST['sync_stripe']) && $isStripeAvailable;

    // Валідація
    if ($code === '') { $msg = 'Вкажіть код купона'; $msgType = 'err'; goto render; }
    if (!preg_match('/^[A-Z0-9]{1,32}$/', $code)) { $msg = 'Код має містити лише латинські літери та цифри (до 32 символів)'; $msgType = 'err'; goto render; }
    if ($value <= 0) { $msg = 'Значення знижки має бути більшим за 0'; $msgType = 'err'; goto render; }
    if ($type === 'percentage' && $value > 100) { $msg = 'Відсоток знижки не може перевищувати 100%'; $msgType = 'err'; goto render; }

    // Перевірка на унікальність
    $exists = DB::row("SELECT id FROM promo_codes WHERE code = ?", [$code]);
    if ($exists) {
        $msg = "Промокод «{$code}» вже існує в базі";
        $msgType = 'err';
        goto render;
    }

    $limitUses  = ($maxUses === '') ? null : (int)$maxUses;
    $rCount     = ($recurType === 'repeating' && $recurCount !== '') ? (int)$recurCount : null;
    $expiresAt  = ($expiry === '') ? null : date('Y-m-d H:i:s', strtotime($expiry)); // UTC
    $restricList = ($restrictTo === '') ? null : $restrictTo;

    // Визначаємо target_plan зі списку обраних тарифів
    $selectedPlans = $_POST['restrict_plans'] ?? [];
    $internalPlans = ['pro', 'agency', 'enterprise'];
    $selectedPlans = array_intersect($selectedPlans, $internalPlans);

    // Якщо обрано рівно один внутрішній тариф — ставимо target_plan
    $targetPlan = (count($selectedPlans) === 1) ? array_values($selectedPlans)[0] : null;

    $paddleId = null;
    $stripeId = null;

    // ── Синхронізація Paddle
    if ($syncPaddle) {
        $paddleId = createPaddleDiscount($paddleKey, $code, $type, $value, $currency, $desc, $recurType, $rCount, $expiresAt, $limitUses, $restricList);
        if (!$paddleId) {
            $msg = 'Помилка створення знижки в Paddle API. Перевірте серверні логи.';
            $msgType = 'err';
            goto render;
        }
    }

    // ── Синхронізація Stripe
    if ($syncStripe) {
        $stripeId = createStripePromo($stripeKey, $code, $type, $value, $currency, $desc, $recurType, $rCount, $expiresAt, $limitUses, $restricList);
        if (!$stripeId) {
            $msg = 'Помилка створення знижки в Stripe API. Перевірте серверні логи.';
            $msgType = 'err';
            goto render;
        }
    }

    // ── Збереження в локальну БД
    try {
        DB::exec(
            "INSERT INTO promo_codes 
               (code, discount_type, discount_value, currency_code, description, recur_type, recur_count, expires_at, max_uses, target_plan, restrict_to, paddle_id, stripe_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$code, $type, $value, $currency, $desc, $recurType, $rCount, $expiresAt, $limitUses, $targetPlan, $restricList, $paddleId, $stripeId]
        );
        $msg = "✅ Промокод «{$code}» успішно створено!";
        $msgType = 'ok';
    } catch (Exception $e) {
        $msg = 'Помилка збереження в базу даних: ' . $e->getMessage();
        $msgType = 'err';
    }
}

// ── 4. Видалення промокоду
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete'])) {
    $promoId = (int)$_POST['id'];
    DB::exec("DELETE FROM promo_codes WHERE id = ?", [$promoId]);
    $msg = "Промокод видалено локально";
    $msgType = 'ok';
}

render:

// Отримання списку промокодів
$promos = DB::all("SELECT * FROM promo_codes ORDER BY created_at DESC");

// ── API Paddle
function createPaddleDiscount(string $apiKey, string $code, string $type, float $value, string $currency, ?string $description, string $recurType, ?int $recurCount, ?string $expiresAt, ?int $usageLimit, ?string $restrictTo): ?string {
    $payload = [
        'description'          => $description ?: "IndexFast Promo {$code}",
        'type'                 => $type, // percentage, flat, flat_per_seat
        'amount'               => (string)$value,
        'enabled_for_checkout' => true,
    ];
    if ($code !== '') {
        $payload['code'] = strtoupper($code);
    }
    if ($type !== 'percentage') {
        $payload['currency_code'] = strtoupper($currency);
    }
    if ($recurType === 'forever' || $recurType === 'repeating') {
        $payload['recur'] = true;
        if ($recurType === 'repeating' && $recurCount > 0) {
            $payload['maximum_recurring_intervals'] = (int)$recurCount;
        }
    } else {
        $payload['recur'] = false;
    }
    if ($expiresAt) {
        $payload['expires_at'] = date('Y-m-d\TH:i:s\Z', strtotime($expiresAt)); // UTC
    }
    if ($usageLimit) {
        $payload['usage_limit'] = (int)$usageLimit;
    }
    if ($restrictTo) {
        $restrictedArray = array_map('trim', explode(',', $restrictTo));
        $restrictedPaddle = [];
        foreach ($restrictedArray as $id) {
            // Paddle IDs start with 'pro_' (products) or 'pri_' (prices)
            if (str_starts_with($id, 'pro_') || str_starts_with($id, 'pri_')) {
                $restrictedPaddle[] = $id;
            }
        }
        if (!empty($restrictedPaddle)) {
            $payload['restrict_to'] = $restrictedPaddle;
        }
    }

    $ch = curl_init("https://api.paddle.com/discounts");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            'User-Agent: IndexFast-Admin'
        ],
    ]);
    
    $res = curl_exec($ch);
    $codeHttp = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if (in_array($codeHttp, [200, 201], true)) {
        $data = json_decode($res, true);
        return $data['data']['id'] ?? null;
    }
    
    error_log("[Paddle Discount Sync] Failed with code {$codeHttp}. Response: " . $res);
    return null;
}

// ── API Stripe
function createStripePromo(string $apiKey, string $code, string $type, float $value, string $currency, ?string $description, string $recurType, ?int $recurCount, ?string $expiresAt, ?int $usageLimit, ?string $restrictTo): ?string {
    $couponPayload = [
        'duration' => $recurType === 'repeating' ? 'repeating' : ($recurType === 'forever' ? 'forever' : 'once'),
        'name'     => $description ?: "IndexFast Promo {$code}"
    ];

    if ($recurType === 'repeating' && $recurCount > 0) {
        $couponPayload['duration_in_months'] = (int)$recurCount;
    }
    if ($type === 'percentage') {
        $couponPayload['percent_off'] = $value;
    } else {
        $couponPayload['amount_off'] = (int)($value * 100);
        $couponPayload['currency']   = strtolower($currency);
    }
    if ($restrictTo) {
        $restrictedArray = array_map('trim', explode(',', $restrictTo));
        $restrictedStripe = [];
        foreach ($restrictedArray as $id) {
            // Stripe product IDs usually start with 'prod_'
            if (str_starts_with($id, 'prod_')) {
                $restrictedStripe[] = $id;
            }
        }
        if (!empty($restrictedStripe)) {
            foreach ($restrictedStripe as $idx => $prodId) {
                $couponPayload["applies_to[products][{$idx}]"] = $prodId;
            }
        }
    }

    $ch = curl_init("https://api.stripe.com/v1/coupons");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($couponPayload),
        CURLOPT_USERPWD        => $apiKey . ':',
    ]);
    $res = curl_exec($ch);
    $codeHttp = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if (!in_array($codeHttp, [200, 201], true)) {
        error_log("[Stripe Coupon Sync] Coupon creation failed. Response: " . $res);
        return null;
    }

    $couponData = json_decode($res, true);
    $couponId   = $couponData['id'] ?? null;
    if (!$couponId) return null;

    $promoPayload = [
        'coupon' => $couponId,
        'code'   => strtoupper($code)
    ];
    if ($expiresAt) {
        $promoPayload['expires_at'] = strtotime($expiresAt);
    }
    if ($usageLimit) {
        $promoPayload['max_redemptions'] = (int)$usageLimit;
    }

    $ch = curl_init("https://api.stripe.com/v1/promotion_codes");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($promoPayload),
        CURLOPT_USERPWD        => $apiKey . ':',
    ]);
    $res = curl_exec($ch);
    $codeHttp = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if (!in_array($codeHttp, [200, 201], true)) {
        error_log("[Stripe Promo Sync] Promo creation failed. Response: " . $res);
        return null;
    }

    $promoData = json_decode($res, true);
    return $promoData['id'] ?? null;
}
?>
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Управління промокодами</title>
  <style>
    <?php readfile(__DIR__ . '/shared.css'); ?>

    .two-columns {
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 20px;
    }
    @media(max-width: 1024px) {
      .two-columns {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      margin-bottom: 14px;
    }
    .form-group label {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
      margin-bottom: 6px;
    }
    .form-group p {
      font-size: 0.72rem;
      color: var(--muted);
      margin: 4px 0 0;
      line-height: 1.3;
    }
    .form-control {
      width: 100%;
      background: var(--dark);
      border: 1px solid var(--border2);
      border-radius: 8px;
      padding: 10px 12px;
      color: var(--white);
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.15s;
    }
    .form-control:focus {
      border-color: var(--green);
    }
    .btn-create {
      width: 100%;
      background: var(--green);
      color: var(--black);
      font-weight: 700;
      padding: 12px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      transition: opacity 0.15s;
    }
    .btn-create:hover {
      opacity: 0.9;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 0;
      font-size: 0.85rem;
    }
    .checkbox-group input {
      width: 16px;
      height: 16px;
      accent-color: var(--green);
      cursor: pointer;
    }
    .checkbox-group label {
      cursor: pointer;
      user-select: none;
    }

    .badge-sync {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 100px;
      font-size: 0.7rem;
      font-weight: 700;
      gap: 4px;
    }
    .badge-synced {
      background: rgba(0, 255, 136, 0.12);
      color: var(--green);
    }
    .badge-nosync {
      background: rgba(255, 255, 255, 0.06);
      color: var(--muted);
    }

    .del-btn {
      background: none;
      border: none;
      color: var(--red);
      cursor: pointer;
      font-size: 0.8rem;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .del-btn:hover {
      background: rgba(255, 68, 85, 0.1);
    }
  </style>
</head>
<body class="sub">

<?php if ($msg): ?>
<div style="position:fixed;top:16px;right:16px;z-index:999;padding:12px 20px;border-radius:12px;font-size:0.875rem;
  background:<?= $msgType==='ok'?'rgba(0,255,136,.12)':'rgba(255,77,109,.12)' ?>;
  border:1px solid <?= $msgType==='ok'?'rgba(0,255,136,.3)':'rgba(255,77,109,.3)' ?>;
  color:<?= $msgType==='ok'?'var(--green)':'var(--red)' ?>">
  <?= htmlspecialchars($msg) ?>
</div>
<?php endif; ?>

<div class="two-columns">
  
  <!-- ══ ЛІВА КОЛОНКА — Список промокодів ══ -->
  <div>
    <div class="card">
      <div style="display:flex;justify-content:between;align-items:center;margin-bottom:16px">
        <h2 style="margin:0;font-size:1.1rem">🎟 Активні промокоди</h2>
        <span class="badge" style="background:rgba(255,255,255,0.06);color:var(--muted)"><?= count($promos) ?></span>
      </div>

      <?php if (empty($promos)): ?>
        <div style="text-align:center;padding:40px;color:var(--muted)">
          Нічого не знайдено. Створіть перший промокод справа!
        </div>
      <?php else: ?>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="border-bottom:1px solid var(--border)">
                <th style="text-align:left;padding:10px;font-size:0.75rem;color:var(--muted)">КОД / ОПИС</th>
                <th style="text-align:left;padding:10px;font-size:0.75rem;color:var(--muted)">ЗНИЖКА</th>
                <th style="text-align:left;padding:10px;font-size:0.75rem;color:var(--muted)">ТИП / РЕКУРЕНТНІСТЬ</th>
                <th style="text-align:left;padding:10px;font-size:0.75rem;color:var(--muted)">ТЕРМІН (UTC)</th>
                <th style="text-align:left;padding:10px;font-size:0.75rem;color:var(--muted)">ВИКОРИСТАННЯ</th>
                <th style="text-align:left;padding:10px;font-size:0.75rem;color:var(--muted)">СИНХРОНІЗАЦІЯ</th>
                <th style="text-align:right;padding:10px;font-size:0.75rem;color:var(--muted)">ДІЯ</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($promos as $p): 
                $isExpired = $p['expires_at'] && strtotime($p['expires_at']) < time();
                $isLimitReached = $p['max_uses'] && $p['uses_count'] >= $p['max_uses'];
              ?>
                <tr style="border-bottom:1px solid var(--border);opacity: <?= ($isExpired || $isLimitReached)?'0.5':'1' ?>">
                  <td style="padding:12px 10px">
                    <strong style="color:var(--green);font-family:monospace;font-size:0.95rem"><?= htmlspecialchars($p['code']) ?></strong>
                    <?php if ($p['description']): ?>
                      <div style="font-size:0.75rem;color:var(--muted);margin-top:2px"><?= htmlspecialchars($p['description']) ?></div>
                    <?php endif; ?>
                    <?php if ($p['target_plan']): ?>
                      <div style="font-size:0.7rem;margin-top:4px"><span class="badge" style="background:rgba(0,255,136,0.1);color:var(--green)">Тариф: <?= strtoupper($p['target_plan']) ?></span></div>
                    <?php endif; ?>
                    <?php if ($p['restrict_to']): ?>
                      <div style="font-size:0.7rem;margin-top:4px"><span class="badge" style="background:rgba(0,136,255,0.1);color:#00aaff">Products: <?= htmlspecialchars($p['restrict_to']) ?></span></div>
                    <?php endif; ?>
                  </td>
                  <td style="padding:12px 10px">
                    <span style="font-weight:700">
                      <?php if ($p['discount_type'] === 'percentage'): ?>
                        -<?= (int)$p['discount_value'] ?>%
                      <?php else: ?>
                        -<?= number_format($p['discount_value'], 2) ?> <?= htmlspecialchars($p['currency_code']) ?>
                      <?php endif; ?>
                    </span>
                  </td>
                  <td style="padding:12px 10px;font-size:0.8rem">
                    <div style="font-weight:600"><?= $p['discount_type'] === 'percentage' ? 'Відсоток' : ($p['discount_type'] === 'flat' ? 'Фіксована сума' : 'Кількість за одиницю') ?></div>
                    <div style="font-size:0.72rem;color:var(--muted)">
                      <?= $p['recur_type'] === 'once' ? '1-й платіж' : ($p['recur_type'] === 'forever' ? 'Постійно' : 'Повторювана ('.$p['recur_count'].' пер.)') ?>
                    </div>
                  </td>
                  <td style="padding:12px 10px;font-size:0.8rem;color:<?= $isExpired ? 'var(--red)' : 'var(--muted)' ?>">
                    <?= $p['expires_at'] ? date('d.m.Y H:i', strtotime($p['expires_at'])) : '∞ Необмежено' ?>
                    <?= $isExpired ? ' (Закінчився)' : '' ?>
                  </td>
                  <td style="padding:12px 10px;font-size:0.8rem">
                    <?= $p['uses_count'] ?> / <?= $p['max_uses'] ?: '∞' ?>
                    <?= $isLimitReached ? ' <span style="color:var(--red)">(Вичерпано)</span>' : '' ?>
                  </td>
                  <td style="padding:12px 10px">
                    <div style="display:flex;flex-direction:column;gap:3px">
                      <?php if ($p['paddle_id']): ?>
                        <span class="badge-sync badge-synced" title="ID: <?= htmlspecialchars($p['paddle_id']) ?>">Paddle ✓</span>
                      <?php else: ?>
                        <span class="badge-sync badge-nosync">Paddle —</span>
                      <?php endif; ?>

                      <?php if ($p['stripe_id']): ?>
                        <span class="badge-sync badge-synced" title="ID: <?= htmlspecialchars($p['stripe_id']) ?>">Stripe ✓</span>
                      <?php else: ?>
                        <span class="badge-sync badge-nosync">Stripe —</span>
                      <?php endif; ?>
                    </div>
                  </td>
                  <td style="padding:12px 10px;text-align:right">
                    <form method="POST" onsubmit="return confirm('Видалити промокод <?= htmlspecialchars($p['code']) ?>?')">
                      <input type="hidden" name="id" value="<?= $p['id'] ?>">
                      <button class="del-btn" type="submit" name="delete" value="1">Видалити</button>
                    </form>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>
    </div>
  </div>

  <!-- ══ ПРАВА КОЛОНКА — Форма створення ══ -->
  <div>
    <div class="card">
      <h2 style="margin:0 0 16px;font-size:1.1rem">➕ Створити промокод</h2>
      <form method="POST" id="promoForm">
        
        <div class="form-group">
          <label>Код знижки на оформлення замовлення</label>
          <input class="form-control" type="text" name="code" placeholder="Наприклад: SUMMER30" required maxlength="32" style="font-family:monospace;text-transform:uppercase" oninput="this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '')">
          <p>До 32 символів, використовуйте лише цифри та літери.</p>
        </div>

        <div class="form-group">
          <label>Тип знижки</label>
          <select class="form-control" name="discount_type" id="discountType" onchange="toggleTypeFields()">
            <option value="percentage">Відсоток</option>
            <option value="flat">Сума (Фіксована)</option>
            <option value="flat_per_seat">Кількість за одиницю</option>
          </select>
        </div>

        <div class="form-group">
          <label id="valueLabel">Відсоток знижки (%)</label>
          <input class="form-control" type="number" name="discount_value" min="0.01" step="0.01" placeholder="Значення" required>
          <p id="valueDesc">Відсоток від загальної ціни, до 100%.</p>
        </div>

        <div class="form-group" id="currencyGroup" style="display:none">
          <label>Валюта</label>
          <select class="form-control" name="currency_code">
            <option value="USD">USD (Долар США)</option>
            <option value="EUR">EUR (Євро)</option>
            <option value="UAH">UAH (Гривня)</option>
          </select>
        </div>

        <div class="form-group">
          <label>Опис знижки</label>
          <input class="form-control" type="text" name="description" placeholder="Внутрішній коментар">
          <p>Додайте опис для довідки – клієнти його не бачитимуть.</p>
        </div>

        <div class="form-group">
          <label>Рекурентність знижки</label>
          <select class="form-control" name="recur_type" id="recurType" onchange="toggleRecurCount()">
            <option value="once">Тільки для першого платежу</option>
            <option value="forever">Постійна знижка (завжди)</option>
            <option value="repeating">Повторювана протягом кількох періодів</option>
          </select>
        </div>

        <div class="form-group" id="recurCountGroup" style="display:none">
          <label>Кількість періодів повторення</label>
          <input class="form-control" type="number" name="recur_count" min="1" placeholder="Наприклад: 3">
          <p>Встановіть кількість розрахункових періодів, протягом яких знижка повторюватиметься.</p>
        </div>

        <div class="form-group">
          <label>Встановити термін дії (UTC)</label>
          <input class="form-control" type="datetime-local" name="expires_at">
          <p>Час, до якого потрібно скористатися знижкою (в UTC).</p>
        </div>

        <div class="form-group">
          <label>Обмеження загальної кількості погашень</label>
          <input class="form-control" type="number" name="max_uses" placeholder="Наприклад: 100">
          <p>Скільки разів загалом можна скористатися знижкою.</p>
        </div>

        <div class="form-group">
          <label>Обмеження до певних продуктів</label>
          <p style="margin-bottom:10px">Застосовуйте цю знижку лише до певних товарів та цін. Якщо нічого не обрано — знижка діє для всіх.</p>

          <div style="background:var(--dark);border:1px solid var(--border2);border-radius:8px;padding:12px;margin-bottom:8px">
            <div style="font-size:0.72rem;text-transform:uppercase;color:var(--muted);font-weight:700;letter-spacing:0.05em;margin-bottom:8px">
              Тарифи IndexFast
            </div>

            <?php
            $plans = [
                'pro'        => [
                    'label'    => 'PRO (ПРОФЕСІЙНИЙ)',
                    'desc'     => '499,00 грн. / Щомісяця',
                    'price_id' => 'pri_01kpy78kbrnk3pzxc9grpe2ye3'
                ],
                'agency'     => [
                    'label'    => 'Агенція (Агентство)',
                    'desc'     => '2 999,00 грн. / Щомісяця',
                    'price_id' => 'pri_01kpy7am19g27zn99w8k74qdxq'
                ],
                'enterprise' => [
                    'label'    => 'Enterprise',
                    'desc'     => 'Необмежено',
                    'price_id' => ''
                ],
            ];
            foreach ($plans as $planKey => $planInfo): ?>
              <div class="checkbox-group" style="margin:6px 0;padding:6px 8px;border-radius:6px;background:rgba(255,255,255,0.03)">
                <input type="checkbox" name="restrict_plans[]" id="rp_<?= $planKey ?>" value="<?= $planKey ?>" data-price-id="<?= htmlspecialchars($planInfo['price_id']) ?>">
                <label for="rp_<?= $planKey ?>" style="flex:1">
                  <strong style="color:var(--green)"><?= $planInfo['label'] ?></strong>
                  <span style="font-size:0.72rem;color:var(--muted);margin-left:6px"><?= $planInfo['desc'] ?></span>
                  <?php if (!empty($planInfo['price_id'])): ?>
                    <span style="font-size:0.7rem;color:var(--muted);display:block;font-family:monospace;margin-top:2px"><?= $planInfo['price_id'] ?></span>
                  <?php endif; ?>
                </label>
              </div>
            <?php endforeach; ?>
          </div>

          <div style="background:var(--dark);border:1px solid var(--border2);border-radius:8px;padding:12px;margin-bottom:8px">
            <div style="font-size:0.72rem;text-transform:uppercase;color:var(--muted);font-weight:700;letter-spacing:0.05em;margin-bottom:8px">
              Paddle Product / Price ID
            </div>
            <div class="checkbox-group" style="margin:6px 0;padding:6px 8px;border-radius:6px;background:rgba(255,255,255,0.03)">
              <input type="checkbox" name="restrict_paddle_product" id="rp_paddle_prod" value="pro_01kpy75jdqq7hqeh4jdn7tgx25">
              <label for="rp_paddle_prod" style="flex:1">
                <strong style="color:#4dabf7">IndexFast Product</strong>
                <span style="font-size:0.72rem;color:var(--muted);display:block;font-family:monospace;margin-top:2px">pro_01kpy75jdqq7hqeh4jdn7tgx25</span>
              </label>
            </div>
          </div>

          <div style="background:var(--dark);border:1px solid var(--border2);border-radius:8px;padding:12px">
            <div style="font-size:0.72rem;text-transform:uppercase;color:var(--muted);font-weight:700;letter-spacing:0.05em;margin-bottom:8px">
              Додатковий ID (вручну)
            </div>
            <input class="form-control" type="text" name="restrict_custom" placeholder="Інший ID продукту або ціни через кому" style="font-family:monospace;font-size:0.8rem">
          </div>

          <!-- Зібране приховане поле -->
          <input type="hidden" name="restrict_to" id="restrictToHidden">
        </div>

        <!-- ══ Синхронізація з платіжками ══ -->
        <h3 style="font-size:0.8rem;text-transform:uppercase;color:var(--muted);margin:20px 0 10px;letter-spacing:0.05em">
          Синхронізація з платіжками
        </h3>

        <div class="checkbox-group">
          <input type="checkbox" name="sync_paddle" id="syncPaddle" value="1" <?= $isPaddleAvailable ? 'checked' : 'disabled' ?>>
          <label for="syncPaddle" style="color: <?= $isPaddleAvailable ? 'var(--white)' : 'var(--muted)' ?>">
            Створити також в Paddle
            <?php if (!$isPaddleAvailable): ?>
              <span style="font-size:0.7rem;color:var(--red);display:block">(Не налаштовано PADDLE_API_KEY)</span>
            <?php endif; ?>
          </label>
        </div>

        <div class="checkbox-group" style="margin-bottom:20px">
          <input type="checkbox" name="sync_stripe" id="syncStripe" value="1" <?= $isStripeAvailable ? 'checked' : 'disabled' ?>>
          <label for="syncStripe" style="color: <?= $isStripeAvailable ? 'var(--white)' : 'var(--muted)' ?>">
            Створити також в Stripe
            <?php if (!$isStripeAvailable): ?>
              <span style="font-size:0.7rem;color:var(--red);display:block">(Не налаштовано STRIPE_SECRET_KEY)</span>
            <?php endif; ?>
          </label>
        </div>

        <button class="btn-create" type="submit" name="create" value="1">Створити знижку</button>
      </form>
    </div>
  </div>

</div>

<script>
function toggleTypeFields() {
  const type = document.getElementById('discountType').value;
  const currencyGroup = document.getElementById('currencyGroup');
  const valueLabel = document.getElementById('valueLabel');
  const valueDesc = document.getElementById('valueDesc');

  if (type === 'percentage') {
    currencyGroup.style.display = 'none';
    valueLabel.textContent = 'Відсоток знижки (%)';
    valueDesc.textContent = 'Відсоток від загальної ціни, до 100%.';
  } else if (type === 'flat') {
    currencyGroup.style.display = 'block';
    valueLabel.textContent = 'Фіксована сума знижки';
    valueDesc.textContent = 'Фіксована сума, наприклад, 100 доларів США.';
  } else {
    currencyGroup.style.display = 'block';
    valueLabel.textContent = 'Сума за одиницю';
    valueDesc.textContent = 'Фіксована сума за кожну придбану одиницю.';
  }
}

function toggleRecurCount() {
  const recurType = document.getElementById('recurType').value;
  const recurCountGroup = document.getElementById('recurCountGroup');

  if (recurType === 'repeating') {
    recurCountGroup.style.display = 'block';
  } else {
    recurCountGroup.style.display = 'none';
  }
}

// ── Збирання restrict_to при сабміті форми
document.getElementById('promoForm').addEventListener('submit', function() {
  const parts = [];

  // 1. Тарифи IndexFast
  document.querySelectorAll('input[name="restrict_plans[]"]:checked').forEach(cb => {
    parts.push(cb.value);
    const priceId = cb.getAttribute('data-price-id');
    if (priceId) {
      parts.push(priceId);
    }
  });

  // 2. Paddle Product ID
  const paddleCb = document.querySelector('input[name="restrict_paddle_product"]:checked');
  if (paddleCb) {
    parts.push(paddleCb.value);
  }

  // 3. Ручне поле
  const custom = (document.querySelector('input[name="restrict_custom"]').value || '').trim();
  if (custom) {
    custom.split(',').forEach(v => {
      const trimmed = v.trim();
      if (trimmed && !parts.includes(trimmed)) parts.push(trimmed);
    });
  }

  document.getElementById('restrictToHidden').value = parts.join(',');
});
</script>

</body>
</html>
