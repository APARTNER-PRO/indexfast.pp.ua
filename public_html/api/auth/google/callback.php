<?php
// ══════════════════════════════════════════════
//  GET /api/auth/google/callback.php
//  Обробляє callback від Google після авторизації
// ══════════════════════════════════════════════

require_once dirname(dirname(__DIR__)) . '/middleware.php';
require_once dirname(dirname(__DIR__)) . '/db.php';

session_start();

// ── 1. Перевіряємо state (CSRF захист)
$state = $_GET['state'] ?? '';
if (!$state || $state !== ($_SESSION['oauth_state'] ?? '')) {
    redirectWithError('invalid_state');
}
unset($_SESSION['oauth_state']);

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
            "INSERT INTO users (email, google_id, google_email, name, surname, avatar_url, email_verified)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [$email, $googleId, $email, $name, $surname, $avatar, $verified ? 1 : 0]
        );
        $user = DB::row("SELECT * FROM users WHERE id = ?", [$userId]);
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

// ── 8. Редіректимо на фронтенд з токенами в URL fragment (#)
//      Fragment не надсилається на сервер — більш безпечно ніж query string
$frontendUrl = APP_URL . '/dashboard/#token=' . urlencode($accessToken)
             . '&refresh=' . urlencode($refreshToken);

header('Location: ' . $frontendUrl);
exit;


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
    header('Location: ' . APP_URL . '/auth.html?error=' . urlencode($error));
    exit;
}
