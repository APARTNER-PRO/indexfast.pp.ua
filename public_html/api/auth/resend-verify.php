<?php
// ══════════════════════════════════════════════
//  POST /api/auth/resend-verify.php
//  Надсилає лист підтвердження повторно
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('POST');
RateLimit::check('forgot'); // той самий ліміт що і forgot password

$uid  = requireAuth()['sub'];
$user = DB::row("SELECT id, email, name, email_verified FROM users WHERE id=?", [$uid]);

if (!$user)                   respond(404, 'Користувача не знайдено');
if ($user['email_verified'])  respond(409, 'Email вже підтверджено');

$token = Token::create((int)$user['id'], 'email_verify');
Mailer::verifyEmail($user['email'], $user['name'], $token);

respondOk('Лист надіслано. Перевірте пошту.');
