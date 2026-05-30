<?php
// ══════════════════════════════════════════════
//  GET /api/auth/google/callback.php
//  Обробляє callback від Google після авторизації
// ══════════════════════════════════════════════

require_once dirname(dirname(__DIR__)) . '/middleware.php';
require_once dirname(dirname(__DIR__)) . '/db.php';

// ── Запобігаємо кешуванню відповіді браузером, проксі або Cloudflare
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

// ── Маркер верифікації
header("X-OAuth-Callback-Handler: indexfast-backend");

try {
// ── 1. Перевіряємо state (CSRF захист)
// State це stateless HMAC-підписаний токен: nonce.timestamp.hmac
// Не потребує сесії — працює надійно при будь-якій проксі чи архітектурі.
$state = $_GET['state'] ?? '';
$parts = explode('.', $state, 3);
if (count($parts) !== 3) {
    error_log('[Google OAuth] State format invalid: ' . $state);
    redirectWithError('invalid_state');
}
[$nonce, $ts, $sig] = $parts;
$expectedSig = hash_hmac('sha256', $nonce . '.' . $ts, JWT_SECRET);
if (!hash_equals($expectedSig, $sig)) {
    error_log('[Google OAuth] State HMAC mismatch.');
    redirectWithError('invalid_state');
}
if (time() - (int)$ts > 600) { // state дійсний 10 хвили
    error_log('[Google OAuth] State expired. ts=' . $ts . ', now=' . time());
    redirectWithError('invalid_state');
}

// ── 2. Перевіряємо code
$code = $_GET['code'] ?? '';
if (!$code) {
    redirectWithError($_GET['error'] ?? 'no_code');
}

// ── 3. Обмінюємо code на access_token
$tokenResponse = googlePost('https://oauth2.googleapis.com/token', [
    'code'          => $code,
    'client_id'     => GOOGLE_CLIENT_ID,
    'client_secret' => GOOGLE_CLIENT_SECRET,
    'redirect_uri'  => GOOGLE_REDIRECT_URI,
    'grant_type'    => 'authorization_code',
]);

if (empty($tokenResponse['access_token'])) {
    error_log('[Google OAuth] Token exchange failed: ' . json_encode($tokenResponse));
    redirectWithError('token_exchange_failed');
}

// ── 4. Отримуємо інфо про користувача
$googleUser = googleGet(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    $tokenResponse['access_token']
);

if (empty($googleUser['id']) || empty($googleUser['email'])) {
    redirectWithError('userinfo_failed');
}

$googleId    = $googleUser['id'];
$email       = strtolower(trim($googleUser['email']));
$name        = $googleUser['given_name']  ?? explode(' ', $googleUser['name'] ?? '')[0] ?? '';
$surname     = $googleUser['family_name'] ?? (explode(' ', $googleUser['name'] ?? '')[1] ?? '');
$avatar      = $googleUser['picture']     ?? null;
$verified    = (bool)($googleUser['verified_email'] ?? false);

// ── 5. Знаходимо або створюємо користувача
$user = DB::row("SELECT * FROM users WHERE google_id = ?", [$googleId]);

if (!$user) {
    // Чи є вже акаунт з таким email (зв'язуємо)
    $user = DB::row("SELECT * FROM users WHERE email = ?", [$email]);

    if ($user) {
        // Оновлюємо існуючий акаунт — додаємо Google
        DB::exec(
            "UPDATE users SET google_id = ?, google_email = ?, avatar_url = COALESCE(avatar_url, ?), email_verified = 1 WHERE id = ?",
            [$googleId, $email, $avatar, $user['id']]
        );
        $user = DB::row("SELECT * FROM users WHERE id = ?", [$user['id']]);
    } else {
        // Новий користувач через Google
        $userId = DB::exec(
            "INSERT INTO users (email, google_id, google_email, name, surname, avatar_url, email_verified, marketing_consent)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1)",
            [$email, $googleId, $email, $name, $surname, $avatar, $verified ? 1 : 0]
        );
        $user = DB::row("SELECT * FROM users WHERE id = ?", [$userId]);
        
        // Відправляємо вітальний лист (Швидкий старт)
        Mailer::sendWelcomeEmail($email, $name, (int)$userId);
    }
}

if (!$user || !$user['is_active']) {
    redirectWithError('account_disabled');
}

// ── 6. Оновлюємо last_login
DB::exec("UPDATE users SET last_login_at = NOW() WHERE id = ?", [$user['id']]);

// ── 7. Генеруємо JWT токени
$accessToken  = JWT::access($user);
$refreshToken = JWT::refresh($user);

// ── 7.1. Зберігаємо refresh_token в БД (для server-side logout)
DB::exec(
    "DELETE FROM tokens WHERE user_id = ? AND type = 'refresh'",
    [$user['id']]
);
DB::exec(
    "INSERT INTO tokens (user_id, token, type, expires_at)
     VALUES (?, ?, 'refresh', DATE_ADD(NOW(), INTERVAL 30 DAY))",
    [$user['id'], $refreshToken]
);

// Редіректимо на фронтенд з токенами в Query Parameters
$frontendUrl = FRONTEND_URL . '/app/dashboard?token=' . $accessToken
             . '&refresh=' . $refreshToken;

header('Location: ' . $frontendUrl);
exit;

} catch (Throwable $e) {
    error_log('[Google OAuth] Fatal Error: ' . $e->getMessage());
    redirectWithError('server_error');
}


// ── Helpers ──────────────────────────────────

function googlePost(string $url, array $data): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_HTTPHEADER     => ['Accept: application/json'],
    ]);
    $res = curl_exec($ch);
    curl_close($ch);
    return json_decode($res, true) ?? [];
}

function googleGet(string $url, string $accessToken): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $accessToken],
    ]);
    $res = curl_exec($ch);
    curl_close($ch);
    return json_decode($res, true) ?? [];
}

function redirectWithError(string $error): never {
    header('Location: ' . FRONTEND_URL . '/app/login?error=' . urlencode($error));
    exit;
}
