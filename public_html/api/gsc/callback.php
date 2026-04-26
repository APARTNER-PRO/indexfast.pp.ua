<?php
// ══════════════════════════════════════════════
//  GET /api/gsc/callback.php
//  Отримує access_token і список GSC сайтів
//  Зберігає gsc_access_token в users
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';

session_start();

$state = $_GET['state'] ?? '';
if (!$state || $state !== ($_SESSION['gsc_state'] ?? '')) {
    header('Location: ' . APP_URL . '/app/dashboard?gsc=error&msg=invalid_state');
    exit;
}

$uid  = (int)($_SESSION['gsc_uid'] ?? 0);
$code = $_GET['code'] ?? '';

if (!$code || !$uid) {
    header('Location: ' . APP_URL . '/app/dashboard?gsc=error&msg=no_code');
    exit;
}

unset($_SESSION['gsc_state'], $_SESSION['gsc_uid']);

// ── Обмінюємо code на tokens
$ch = curl_init('https://oauth2.googleapis.com/token');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query([
        'code'          => $code,
        'client_id'     => GOOGLE_CLIENT_ID,
        'client_secret' => GOOGLE_CLIENT_SECRET,
        'redirect_uri'  => APP_URL . '/api/gsc/callback.php',
        'grant_type'    => 'authorization_code',
    ]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_HTTPHEADER     => ['Accept: application/json'],
]);
$tokenResp = json_decode(curl_exec($ch), true) ?? [];
curl_close($ch);

if (empty($tokenResp['access_token'])) {
    header('Location: ' . APP_URL . '/app/dashboard?gsc=error&msg=token_failed');
    exit;
}

// ── Зберігаємо GSC access_token (короткоживучий, але для імпорту достатньо)
$gscToken = $tokenResp['access_token'];

// Зберігаємо в БД для подальшого використання через API
DB::exec(
    "UPDATE users SET gsc_access_token=?, gsc_token_expires=DATE_ADD(NOW(), INTERVAL 3600 SECOND)
     WHERE id=?",
    [$gscToken, $uid]
);

header('Location: ' . APP_URL . '/app/dashboard?gsc=ready');
exit;
