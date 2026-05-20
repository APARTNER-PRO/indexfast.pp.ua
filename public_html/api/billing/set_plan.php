<?php
// ══════════════════════════════════════════════
//  POST /api/billing/set_plan.php
//  Встановлює план після оплати
//  Викликається адміном або Paddle webhook
//  body: { user_id, plan, months, paddle_sub_id? }
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';

requireMethod('POST');

// Тільки адмін або ADMIN_SECRET
$secret = env('ADMIN_SECRET', '');
$auth   = $_SERVER['HTTP_X_ADMIN_SECRET'] ?? '';
if (!$secret || !hash_equals($secret, $auth)) {
    // Перевіряємо JWT адміна
    $uid = requireAuth()['sub'] ?? 0;
    $user = DB::row("SELECT id FROM users WHERE id=? AND role='admin'", [$uid]);
    if (!$user) respond(403, 'Forbidden');
}

$body      = getBody();
$userId    = (int)($body['user_id']    ?? 0);
$plan      = sanitize($body['plan']    ?? '');
$months    = (int)($body['months']     ?? 1);
$paddleId  = sanitize($body['paddle_sub_id'] ?? '');

if (!$userId || !$plan) respond(422, 'user_id і plan обов\'язкові');
if (!in_array($plan, ['start', 'pro', 'agency', 'enterprise'], true))
    respond(422, 'Невідомий план');
if ($months < 1 || $months > 36)
    respond(422, 'months має бути від 1 до 36');

$user = DB::row("SELECT id, email, name, plan FROM users WHERE id=?", [$userId]);
if (!$user) respond(404, 'Юзер не знайдено');

// ── Встановлюємо план
$expiresAt = $plan === 'start'
    ? null
    : date('Y-m-d H:i:s', strtotime("+{$months} months"));

DB::exec(
    "UPDATE users
     SET plan             = ?,
         plan_expires_at  = ?,
         plan_started_at  = NOW(),
         paddle_sub_id    = NULLIF(?, ''),
         updated_at       = NOW()
     WHERE id = ?",
    [$plan, $expiresAt, $paddleId, $userId]
);

respondOk('План встановлено', [
    'user_id'    => $userId,
    'plan'       => $plan,
    'expires_at' => $expiresAt,
]);
