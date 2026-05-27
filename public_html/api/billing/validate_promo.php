<?php
// api/billing/validate_promo.php
// Валідує промокод для поточного юзера без створення підписки
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../plans.php';

requireMethod('POST');
$user = requireAuth();

$body      = json_decode(file_get_contents('php://input'), true) ?? [];
$planId    = trim($body['plan_id']    ?? '');
$promoCode = strtoupper(trim($body['promo_code'] ?? ''));
$period    = trim($body['period']     ?? 'month');

if (!$planId || !Plans::exists($planId)) respond(400, 'Невірний тариф');
if ($promoCode === '')                   respond(400, 'Промокод не вказано');

// 1. Спочатку перевіряємо промокод у email_logs (персональний)
$promo = DB::row(
    "SELECT id, discount_percent AS discount_value, 'percentage' AS discount_type,
            'USD' AS currency_code, expires_at, target_plan,
            NULL AS max_uses, 0 AS uses_count, NULL AS restrict_to
     FROM email_logs
     WHERE user_id    = ?
       AND promo_code = ?
       AND email_type = 'upsell'
       AND (expires_at IS NULL OR expires_at >= CURDATE())
     ORDER BY created_at DESC
     LIMIT 1",
    [$user['id'], $promoCode]
);

// 2. Якщо не знайдено, перевіряємо у загальних промокодах (promo_codes)
if (!$promo) {
    $promo = DB::row(
        "SELECT id, discount_type, discount_value, currency_code,
                expires_at, target_plan, max_uses, uses_count, restrict_to
         FROM promo_codes
         WHERE code = ?
           AND (expires_at IS NULL OR expires_at >= NOW())
         LIMIT 1",
        [$promoCode]
    );

    if ($promo) {
        if ($promo['max_uses'] !== null && $promo['uses_count'] >= $promo['max_uses']) {
            respond(422, "Промокод «{$promoCode}» більше недійсний (вичерпано ліміт використань).");
        }
    }
}

if (!$promo) {
    respond(422, "Промокод «{$promoCode}» недійсний або закінчився його термін дії.");
}
if ($promo['target_plan'] !== null && $promo['target_plan'] !== $planId) {
    $targetLabel = strtoupper($promo['target_plan']);
    respond(422, "Цей промокод діє лише для тарифу {$targetLabel}.");
}

// Розраховуємо знижку
$key   = 'PRICE_' . strtoupper($planId) . '_' . strtoupper($period);
$price = (float)(env($key, 0));

$discountType  = $promo['discount_type'] ?? 'percentage';
$discountValue = (float)($promo['discount_value'] ?? 0);

if ($discountType === 'percentage') {
    $final = round($price * (1 - $discountValue / 100), 2);
} else {
    // flat або flat_per_seat — віднімаємо фіксовану суму
    $final = max(0.00, round($price - $discountValue, 2));
}

respond(200, 'ok', [
    'valid'           => true,
    'discount_type'   => $discountType,
    'discount_value'  => $discountValue,
    'original_amount' => $price,
    'final_amount'    => $final,
    'expires_at'      => $promo['expires_at'],
]);
