<?php
// ══════════════════════════════════════════════
//  GET /api/gsc/callback.php
//  Отримує access_token і список GSC сайтів
//  Зберігає gsc_access_token в users
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';
require_once __DIR__ . '/helpers.php';

$stateRaw = $_GET['state'] ?? '';
$payload  = JWT::decode($stateRaw);

if (!$payload || ($payload['type'] ?? '') !== 'gsc_state') {
    header('Location: ' . FRONTEND_URL . '/app/dashboard?gsc=error&msg=invalid_state');
    exit;
}

$uid  = (int)($payload['uid'] ?? 0);
$code = $_GET['code'] ?? '';

if (!$code || !$uid) {
    header('Location: ' . FRONTEND_URL . '/app/dashboard?gsc=error&msg=no_code');
    exit;
}

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
    $err = $tokenResp['error_description'] ?? $tokenResp['error'] ?? 'token_failed';
    header('Location: ' . FRONTEND_URL . '/app/dashboard?gsc=error&msg=' . urlencode($err));
    exit;
}

// ── Зберігаємо GSC access_token (короткоживучий, але для імпорту достатньо)
$gscToken = $tokenResp['access_token'];

// Зберігаємо в БД для подальшого використання через API
gscSaveTokens($uid, $gscToken, $tokenResp['refresh_token'] ?? null, (int)($tokenResp['expires_in'] ?? 3600));

header('Location: ' . FRONTEND_URL . '/app/dashboard?gsc=ready');
exit;
