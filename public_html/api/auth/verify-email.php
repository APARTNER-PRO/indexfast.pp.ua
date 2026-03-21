<?php
// ══════════════════════════════════════════════
//  GET|POST /api/auth/verify-email.php?token=...
//  Підтверджує email після реєстрації
//  GET  — старий формат (пряме посилання з листа)
//  POST — новий формат (з React сторінки VerifyEmail.jsx)
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

// Токен з GET або POST
$token = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body  = getBody();
    $token = trim($body['token'] ?? '');
} else {
    $token = trim($_GET['token'] ?? '');
}

if (!$token) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Location: ' . APP_URL . '/app/login?error=verification_failed');
        exit;
    }
    respond(400, 'Токен відсутній');
}

$tokenRow = Token::verify($token, 'email_verify');
if (!$tokenRow) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Location: ' . APP_URL . '/app/login?error=verification_failed');
        exit;
    }
    respond(400, 'Посилання недійсне або прострочене. Запросіть нове підтвердження.');
}

// ── Підтверджуємо email
DB::exec("UPDATE users SET email_verified = 1 WHERE id = ?", [$tokenRow['user_id']]);
Token::consume($token);

// ── Відповідь залежить від методу
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Старе посилання з листа → редірект на дашборд
    header('Location: ' . APP_URL . '/app/dashboard?verified=1');
    exit;
}

// POST з React → JSON відповідь
respondOk('Email підтверджено!');
