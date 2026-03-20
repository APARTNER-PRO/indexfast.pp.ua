<?php
// ══════════════════════════════════════════════
//  POST /api/auth/refresh.php
//  Тіло: { refresh_token }
//  Повертає новий access_token (і ротує refresh_token)
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('POST');

$body         = getBody();
$refreshToken = trim($body['refresh_token'] ?? '');

if (!$refreshToken) respond(401, 'refresh_token відсутній');

// ── Декодуємо і перевіряємо refresh_token
$payload = JWT::decode($refreshToken);

if (!$payload || ($payload['type'] ?? '') !== 'refresh') {
    respond(401, 'Невалідний або прострочений refresh_token');
}

$userId = (int)$payload['sub'];

// ── Перевіряємо що юзер існує і активний
$user = DB::row(
    "SELECT id, email, name, surname, plan, avatar_url, is_active
     FROM users WHERE id = ?",
    [$userId]
);

if (!$user || !$user['is_active']) {
    respond(401, 'Акаунт не знайдено або заблоковано');
}

// ── Генеруємо нові токени (ротація refresh_token)
$newAccess  = JWT::access($user);
$newRefresh = JWT::refresh($user);

// ── Оновлюємо last_login_at
DB::exec("UPDATE users SET last_login_at = NOW() WHERE id = ?", [$userId]);

respondOk('Токен оновлено', [
    'access_token'  => $newAccess,
    'refresh_token' => $newRefresh,
]);
