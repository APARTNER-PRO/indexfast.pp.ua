<?php
// ══════════════════════════════════════════════
//  GET /api/auth/me.php
//  Повертає поточного авторизованого юзера
//  Header: Authorization: Bearer <access_token>
// ══════════════════════════════════════════════

require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('GET');
$payload = requireAuth();

$user = DB::row("SELECT id, name, surname, email, email_verified, plan, avatar_url, created_at, last_login_at FROM users WHERE id = ? AND is_active = 1", [$payload['sub']]);

if (!$user) {
    respond(404, 'Користувача не знайдено');
}

respondOk('OK', [
    'user' => [
        'id'             => (int)$user['id'],
        'name'           => $user['name'],
        'surname'        => $user['surname'],
        'email'          => $user['email'],
        'email_verified' => (bool)$user['email_verified'],
        'plan'           => $user['plan'],
        'avatar_url'     => $user['avatar_url'],
        'created_at'     => $user['created_at'],
        'last_login_at'  => $user['last_login_at'],
    ],
]);
