<?php
// ══════════════════════════════════════════════
//  public_html/api/middleware.php — ПАТЧ
//  Заміни ПОВНІСТЮ існуючий middleware.php цим файлом.
//
//  Зміни:
//  1. PHP 7.4+: str_starts_with() → substr() порівняння
//  2. CORS: підтримка кількох доменів (CORS_ORIGINS масив з config.php)
//  3. Wildcard '*' якщо DEBUG=true (dev-середовище)
// ══════════════════════════════════════════════

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

// ── CORS
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if ($origin && in_array($origin, CORS_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
} elseif (DEBUG) {
    // В режимі розробки дозволяємо будь-який origin
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Worker-Key');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('X-Permitted-Cross-Domain-Policies: none');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'");
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// Preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Вимагати HTTP метод
function requireMethod(string ...$methods): void
{
    if (!in_array($_SERVER['REQUEST_METHOD'], $methods, true)) {
        respond(405, 'Method Not Allowed');
    }
}

// ── Вимагати Bearer JWT авторизацію
function requireAuth(): array
{
    $header = '';

    // Різні способи отримати Authorization header (Apache, nginx, CGI)
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $header = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        $allHeaders = getallheaders();
        // PHP 7.4: case-insensitive пошук
        foreach ($allHeaders as $k => $v) {
            if (strtolower($k) === 'authorization') {
                $header = $v;
                break;
            }
        }
    }

    $token = '';

    // PHP 7.4: замість str_starts_with($header, 'Bearer ')
    if (substr($header, 0, 7) === 'Bearer ') {
        $token = substr($header, 7);
    } elseif (!empty($_GET['token'])) {
        $token = $_GET['token'];
    }

    if (!$token) {
        respond(401, 'Unauthorized: відсутній токен');
    }

    $payload = JWT::decode($token);

    if (!$payload || !isset($payload['type']) || $payload['type'] !== 'access') {
        respond(401, 'Unauthorized: невалідний або прострочений токен');
    }

    return $payload;
}
