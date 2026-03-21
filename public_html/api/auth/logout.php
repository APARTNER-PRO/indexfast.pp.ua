<?php
// ══════════════════════════════════════════════
//  POST /api/auth/logout.php
//  Тіло: { refresh_token }
//  Інвалідує refresh_token на сервері
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('POST');

// Auth необов'язковий — юзер може вже мати прострочений access_token
$body         = getBody();
$refreshToken = trim($body['refresh_token'] ?? '');

if ($refreshToken) {
    // Декодуємо щоб дістати user_id (без перевірки exp — токен може бути протерміновим)
    $parts = explode('.', $refreshToken);
    if (count($parts) === 3) {
        $payload = json_decode(base64_decode(
            strtr($parts[1], '-_', '+/') . str_repeat('=', 3 - (3 + strlen($parts[1])) % 4)
        ), true);

        $userId = (int)($payload['sub'] ?? 0);

        if ($userId) {
            // Інвалідуємо всі refresh токени юзера в таблиці tokens
            DB::exec(
                "UPDATE tokens SET used_at = NOW()
                 WHERE user_id = ? AND type = 'refresh' AND used_at IS NULL",
                [$userId]
            );
        }
    }
}

respondOk('Вихід виконано');
