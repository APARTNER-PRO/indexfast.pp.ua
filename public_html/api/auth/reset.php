<?php
// ══════════════════════════════════════════════
//  POST /api/auth/reset.php
//  Тіло: { token, password }
//  Встановлює новий пароль
// ══════════════════════════════════════════════

require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('POST');

$body = getBody();
requireField($body, 'token', 'password');

$token    = trim($body['token']);
$password = $body['password'];

if (strlen($password) < PASSWORD_MIN_LENGTH) {
    respond(422, 'Пароль має бути мінімум ' . PASSWORD_MIN_LENGTH . ' символів');
}

// ── Перевіряємо токен
$tokenRow = Token::verify($token, 'password_reset');
if (!$tokenRow) {
    respond(400, 'Посилання недійсне або прострочене. Запросіть нове.');
}

// ── Оновлюємо пароль
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);
DB::exec("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?", [$hash, $tokenRow['user_id']]);

// ── Позначаємо токен використаним
Token::consume($token);

// ── Інвалідуємо всі інші refresh токени (безпека)
DB::exec(
    "UPDATE tokens SET used_at = NOW() WHERE user_id = ? AND type = 'refresh' AND used_at IS NULL",
    [$tokenRow['user_id']]
);

respondOk('Пароль успішно змінено. Тепер можете увійти.');
