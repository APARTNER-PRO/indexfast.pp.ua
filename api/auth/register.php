<?php
// ══════════════════════════════════════════════
//  POST /api/auth/register.php
//  Тіло: { name, surname, email, password }
// ══════════════════════════════════════════════

require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('POST');
RateLimit::check('register');

$body = getBody();
requireField($body, 'name', 'email', 'password');

$name    = sanitize($body['name']);
$surname = sanitize($body['surname'] ?? '');
$email   = strtolower(trim($body['email']));
$password= $body['password'];

// ── Валідація
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, 'Невалідна email адреса');
}
if (strlen($password) < PASSWORD_MIN_LENGTH) {
    respond(422, 'Пароль має бути мінімум ' . PASSWORD_MIN_LENGTH . ' символів');
}
if (strlen($name) < 2) {
    respond(422, "Ім'я має бути мінімум 2 символи");
}

// ── Перевіряємо чи email вже існує
$existing = DB::row("SELECT id FROM users WHERE email = ?", [$email]);
if ($existing) {
    respond(409, 'Користувач з таким email вже існує');
}

// ── Створюємо користувача
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);
$userId = DB::exec(
    "INSERT INTO users (email, password_hash, name, surname) VALUES (?, ?, ?, ?)",
    [$email, $hash, $name, $surname]
);

// ── Токен підтвердження email
$verifyToken = Token::create((int)$userId, 'email_verify');
Mailer::verifyEmail($email, $name, $verifyToken);

// ── Генеруємо JWT
$user = DB::row("SELECT * FROM users WHERE id = ?", [$userId]);
$accessToken  = JWT::access($user);
$refreshToken = JWT::refresh($user);

// ── Зберігаємо refresh token у БД
Token::create((int)$userId, 'refresh');

RateLimit::reset(RateLimit::getIP(), 'register');

respondOk('Реєстрація успішна! Перевірте email для підтвердження.', [
    'access_token'  => $accessToken,
    'refresh_token' => $refreshToken,
    'user' => [
        'id'             => (int)$user['id'],
        'name'           => $user['name'],
        'surname'        => $user['surname'],
        'email'          => $user['email'],
        'email_verified' => (bool)$user['email_verified'],
        'plan'           => $user['plan'],
        'avatar_url'     => $user['avatar_url'],
    ],
]);
