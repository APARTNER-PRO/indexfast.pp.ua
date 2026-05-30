<?php
// ══════════════════════════════════════════════
//  GET /api/auth/google/redirect.php
//  Перенаправляє на Google OAuth consent screen
// ══════════════════════════════════════════════

require_once dirname(dirname(__DIR__)) . '/config.php';

if (!GOOGLE_CLIENT_ID) {
    die('Google OAuth не налаштовано. Вкажіть GOOGLE_CLIENT_ID в .env');
}

// ── CSRF state: stateless HMAC-підписаний токен
// Не використовуємо сесії — вони ненадійні при крос-доменному проксюванні
// (frontend indexfast.pp.ua → backend test.developer.pp.ua).
// Структура: nonce.timestamp.hmac(nonce.timestamp, JWT_SECRET)
$nonce = bin2hex(random_bytes(16));
$ts    = time();
$sig   = hash_hmac('sha256', $nonce . '.' . $ts, JWT_SECRET);
$state = $nonce . '.' . $ts . '.' . $sig;

$params = http_build_query([
    'client_id'     => GOOGLE_CLIENT_ID,
    'redirect_uri'  => GOOGLE_REDIRECT_URI,
    'response_type' => 'code',
    'scope'         => GOOGLE_SCOPES,
    'state'         => $state,
    'access_type'   => 'online',
    'prompt'        => 'select_account',
]);

header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . $params);
exit;
