<?php
// ══════════════════════════════════════════════
//  IndexFast — config.php
//  Всі налаштування. Підключай першим.
// ══════════════════════════════════════════════

// ── Завантажуємо .env якщо є (через vlucas/phpdotenv або вручну)
$envFile = dirname(__DIR__, 2) . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
        [$key, $val] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($val, " \t\n\r\0\x0B\"'");
    }
}

function env(string $key, mixed $default = null): mixed {
    return $_ENV[$key] ?? $default;
}

// ────────────────────────────────────────────
//  DATABASE
// ────────────────────────────────────────────
define('DB_HOST',    env('DB_HOST',    'localhost'));
define('DB_PORT',    env('DB_PORT',    '3306'));
define('DB_NAME',    env('DB_NAME',    'indexfast'));
define('DB_USER',    env('DB_USER',    'root'));
define('DB_PASS',    env('DB_PASS',    ''));
define('DB_CHARSET', 'utf8mb4');

// ────────────────────────────────────────────
//  APP
// ────────────────────────────────────────────
define('APP_NAME',    'IndexFast');
define('APP_URL',     env('APP_URL',   'https://indexfast.pp.ua'));
define('APP_ENV',     env('APP_ENV',   'production')); // development | production
define('DEBUG',       APP_ENV === 'development');

// ────────────────────────────────────────────
//  JWT
// ────────────────────────────────────────────
define('JWT_SECRET',        env('JWT_SECRET', 'CHANGE_ME_USE_STRONG_RANDOM_STRING_32+'));
define('JWT_ACCESS_TTL',    60 * 60);         // 1 година (секунди)
define('JWT_REFRESH_TTL',   60 * 60 * 24 * 30); // 30 днів

// ────────────────────────────────────────────
//  GOOGLE OAUTH 2.0
//  Налаштуй на: https://console.cloud.google.com/
//  Authorized redirect URI: APP_URL/api/auth/google/callback.php
// ────────────────────────────────────────────
define('GOOGLE_CLIENT_ID',     env('GOOGLE_CLIENT_ID',     ''));
define('GOOGLE_CLIENT_SECRET', env('GOOGLE_CLIENT_SECRET', ''));
define('GOOGLE_REDIRECT_URI',  APP_URL . '/api/auth/google/callback.php');
define('GOOGLE_SCOPES',        'openid email profile');

// ────────────────────────────────────────────
//  EMAIL (SMTP)
//  Використовується для: підтвердження email, скидання пароля
// ────────────────────────────────────────────
define('MAIL_FROM',      env('MAIL_FROM',    'noreply@indexfast.pp.ua'));
define('MAIL_FROM_NAME', env('MAIL_FROM_NAME', APP_NAME));
define('SMTP_HOST',      env('SMTP_HOST',    'smtp.gmail.com'));
define('SMTP_PORT',      env('SMTP_PORT',    587));
define('SMTP_USER',      env('SMTP_USER',    ''));
define('SMTP_PASS',      env('SMTP_PASS',    ''));
define('SMTP_SECURE',    env('SMTP_SECURE',  'tls')); // tls | ssl

// ────────────────────────────────────────────
//  RATE LIMITING
// ────────────────────────────────────────────
define('RATE_LOGIN_MAX',    5);    // спроб
define('RATE_LOGIN_WINDOW', 15);   // хвилин
define('RATE_REG_MAX',      3);
define('RATE_REG_WINDOW',   60);
define('RATE_FORGOT_MAX',   3);
define('RATE_FORGOT_WINDOW',60);

// ────────────────────────────────────────────
//  TOKENS TTL
// ────────────────────────────────────────────
define('TOKEN_EMAIL_VERIFY_TTL',  60 * 24);      // 24 год (хвилини)
define('TOKEN_PASSWORD_RESET_TTL', 60);           // 60 хвилин

// ────────────────────────────────────────────
//  CORS — дозволені origin
// ────────────────────────────────────────────
define('CORS_ORIGINS', [
    'https://indexfast.pp.ua',
    'https://indexedfast.vercel.app',
    // 'http://localhost:3000',  // розкоментуй для dev
]);

// ────────────────────────────────────────────
//  БЕЗПЕКА
// ────────────────────────────────────────────
define('PASSWORD_MIN_LENGTH', 8);
define('BCRYPT_COST',         12);
define('SESSION_LIFETIME',    60 * 60 * 24 * 30); // 30 днів

// Повідомлення про помилки тільки в dev
if (!DEBUG) {
    error_reporting(0);
    ini_set('display_errors', 0);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}
