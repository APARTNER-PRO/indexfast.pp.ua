<?php
// ══════════════════════════════════════════════
//  GET /api/auth/verify-email.php?token=...
//  Підтверджує email після реєстрації
// ══════════════════════════════════════════════

require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('GET');

$token = trim($_GET['token'] ?? '');
if (!$token) {
    respond(400, 'Токен відсутній');
}

$tokenRow = Token::verify($token, 'email_verify');
if (!$tokenRow) {
    // Редіректимо на фронтенд з помилкою
    header('Location: ' . APP_URL . '/auth.html?verified=error');
    exit;
}

// ── Підтверджуємо
DB::exec("UPDATE users SET email_verified = 1 WHERE id = ?", [$tokenRow['user_id']]);
Token::consume($token);

// ── Редіректимо на кабінет
header('Location: ' . APP_URL . '/dashboard/?verified=1');
exit;
