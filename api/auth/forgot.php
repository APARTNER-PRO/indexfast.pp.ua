<?php
// ══════════════════════════════════════════════
//  POST /api/auth/forgot.php
//  Тіло: { email }
//  Надсилає лист зі скиданням пароля
// ══════════════════════════════════════════════

require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('POST');
RateLimit::check('forgot');

$body = getBody();
requireField($body, 'email');

$email = strtolower(trim($body['email']));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, 'Невалідна email адреса');
}

// ── Шукаємо користувача (відповідаємо однаково незалежно від результату — anti-enumeration)
$user = DB::row("SELECT id, name, email FROM users WHERE email = ? AND is_active = 1", [$email]);

if ($user) {
    $token = Token::create((int)$user['id'], 'password_reset');
    Mailer::resetPassword($user['email'], $user['name'], $token);
}

// ── Завжди повертаємо успіх (не даємо знати чи є такий email)
respondOk('Якщо цей email зареєстровано — ми надіслали інструкції для скидання пароля.');
