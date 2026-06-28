<?php
// ══════════════════════════════════════════════
//  public_html/api/config.php  — ПАТЧ
//  Заміни ПОВНІСТЮ існуючий config.php цим файлом.
//
//  Зміни відносно оригіналу:
//  1. PHP 7.4+ сумісність: str_starts_with() → strncmp(),
//     str_contains() → strpos()
//  2. FRONTEND_URL підтримує кілька доменів через кому —
//     CORS_ORIGINS масив, FRONTEND_URL = перший домен
//  3. Додано FRONTEND_URLS константу для крос-доменної роботи
//  4. MySQL 5.7 нотатка (в коді змін немає — SQL файл вже сумісний)
// ══════════════════════════════════════════════

// ── Завантажуємо .env (PHP 7.4 compatible — без str_starts_with, str_contains)
$envFile = dirname(__DIR__, 2) . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        // PHP 7.4: замість str_starts_with($line, '#')
        if ($line === '' || $line[0] === '#') continue;
        // PHP 7.4: замість str_contains($line, '=')
        if (strpos($line, '=') === false) continue;

        $parts = explode('=', $line, 2);
        $key   = trim($parts[0]);
        $val   = isset($parts[1]) ? trim($parts[1]) : '';

        // Inline-коментарі (тільки якщо не в лапках)
        // PHP 7.4: замість str_starts_with($val, '"')
        if ($val !== '' && $val[0] !== '"' && $val[0] !== "'") {
            $val = preg_replace('/\s+#.*$/', '', $val);
        }
        $_ENV[$key] = trim($val, " \t\n\r\0\x0B\"'");
    }
}

function env(string $key, $default = null) {
    return isset($_ENV[$key]) ? $_ENV[$key] : $default;
}

// ─────────────────────────────────────────────
//  DATABASE
// ─────────────────────────────────────────────
define('DB_HOST',    env('DB_HOST',    'localhost'));
define('DB_PORT',    env('DB_PORT',    '3306'));
define('DB_NAME',    env('DB_NAME',    'indexfast'));
define('DB_USER',    env('DB_USER',    'root'));
define('DB_PASS',    env('DB_PASS',    ''));
define('DB_CHARSET', 'utf8mb4');

// ─────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────
define('APP_NAME', 'IndexFast');
define('APP_URL',  env('APP_URL',  'https://indexfast.pp.ua'));
define('APP_ENV',  env('APP_ENV',  'production'));
define('APP_EMAIL', env('APP_EMAIL', 'indexfastapp@gmail.com'));
define('DEFAULT_CURRENCY', env('DEFAULT_CURRENCY', 'USD'));
define('DEBUG',    APP_ENV === 'development');

if (DEBUG) {
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
}

// ─────────────────────────────────────────────
//  JWT
// ─────────────────────────────────────────────
define('JWT_SECRET',       env('JWT_SECRET', 'CHANGE_ME_USE_STRONG_RANDOM_STRING_32+'));
if (JWT_SECRET === 'CHANGE_ME_USE_STRONG_RANDOM_STRING_32+' && APP_ENV === 'production') {
    http_response_code(500);
    die(json_encode(['success' => false, 'message' => 'JWT_SECRET не змінено']));
}
define('JWT_ACCESS_TTL',  60 * 60);
define('JWT_REFRESH_TTL', 60 * 60 * 24 * 30);

// ─────────────────────────────────────────────
//  CORS / FRONTEND_URL
//
//  FRONTEND_URL може містити ОДИН або КІЛЬКА доменів через кому:
//    FRONTEND_URL=https://indexfast.pp.ua
//    FRONTEND_URL=https://indexfast.pp.ua,https://app.indexfast.com
//
//  CORS_ORIGINS — масив дозволених origins для middleware.php
//  FRONTEND_URL — перший домен (для посилань в email тощо)
// ─────────────────────────────────────────────
$_frontendRaw = env('FRONTEND_URL', 'https://indexfast.pp.ua');

// Розбиваємо на масив, фільтруємо порожні
$_corsArray = array_values(array_filter(
    array_map('trim', explode(',', $_frontendRaw))
));

define('CORS_ORIGINS',  $_corsArray);
define('FRONTEND_URLS', $_frontendRaw);

// FRONTEND_URL — перший з масиву (для email-лінків, redirect_uri тощо)
define('FRONTEND_URL', !empty($_corsArray) ? $_corsArray[0] : 'https://indexfast.pp.ua');

// ─────────────────────────────────────────────
//  GOOGLE OAUTH
// ─────────────────────────────────────────────
define('GOOGLE_CLIENT_ID',     env('GOOGLE_CLIENT_ID',     ''));
define('GOOGLE_CLIENT_SECRET', env('GOOGLE_CLIENT_SECRET', ''));
define('GOOGLE_REDIRECT_URI',  FRONTEND_URL . '/api/auth/google/callback.php');
define('GOOGLE_SCOPES',        'openid email profile');

// ─────────────────────────────────────────────
//  EMAIL (SMTP)
// ─────────────────────────────────────────────
define('MAIL_FROM',      env('MAIL_FROM',      'noreply@indexfast.pp.ua'));
define('MAIL_FROM_NAME', env('MAIL_FROM_NAME', APP_NAME));
define('SMTP_HOST',      env('SMTP_HOST',      'smtp.gmail.com'));
define('SMTP_PORT',      env('SMTP_PORT',      587));
define('SMTP_USER',      env('SMTP_USER',      ''));
define('SMTP_PASS',      env('SMTP_PASS',      ''));
define('SMTP_SECURE',    env('SMTP_SECURE',    'tls'));
define('APP_EMAIL',      env('APP_EMAIL',      env('SMTP_USER', '')));

// ─────────────────────────────────────────────
//  RATE LIMITING
// ─────────────────────────────────────────────
define('RATE_LOGIN_MAX',     5);
define('RATE_LOGIN_WINDOW',  15);
define('RATE_REG_MAX',       3);
define('RATE_REG_WINDOW',    60);
define('RATE_FORGOT_MAX',    3);
define('RATE_FORGOT_WINDOW', 60);

// ─────────────────────────────────────────────
//  TOKENS TTL
// ─────────────────────────────────────────────
define('TOKEN_EMAIL_VERIFY_TTL',   60 * 24);
define('TOKEN_PASSWORD_RESET_TTL', 60);

// ─────────────────────────────────────────────
//  БЕЗПЕКА
// ─────────────────────────────────────────────
define('PASSWORD_MIN_LENGTH', 8);
define('BCRYPT_COST',         12);
define('SESSION_LIFETIME',    60 * 60 * 24 * 30);
define('WORKER_KEY',          env('WORKER_KEY', 'indexfast_secret_key_2024'));

// ─────────────────────────────────────────────
//  INDEXNOW
// ─────────────────────────────────────────────
define('INDEXNOW_ENABLED', env('INDEXNOW_ENABLED', 'true') === 'true');
