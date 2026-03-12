<?php
// ══════════════════════════════════════════════
//  POST /api/auth/login.php
//  Тіло: { email, password }
// ══════════════════════════════════════════════

require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('POST');
RateLimit::check('login');

$body = getBody();
requireField($body, 'email', 'password');

$email    = strtolower(trim($body['email']));
$password = $body['password'];

// ── Шукаємо користувача
$user = DB::row("SELECT * FROM users WHERE email = ? AND is_active = 1", [$email]);

// ── Перевіряємо пароль (constant-time)
if (!$user || !$user['password_hash'] || !password_verify($password, $user['password_hash'])) {
    // Навмисна затримка щоб ускладнити timing attack
    usleep(random_int(100000, 300000));
    respond(401, 'Невірний email або пароль');
}

// ── Оновлюємо last_login_at
DB::exec("UPDATE users SET last_login_at = NOW() WHERE id = ?", [$user['id']]);

// ── Генеруємо токени
$accessToken  = JWT::access($user);
$refreshToken = JWT::refresh($user);

// ── Скидаємо rate limit після успішного входу
RateLimit::reset(RateLimit::getIP(), 'login');

respondOk('Вхід успішний', [
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
