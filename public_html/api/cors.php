<?php
// public_html/api/cors.php
// Підключати на початку КОЖНОГО API файлу який може викликатись з іншого домену:
//   require_once __DIR__ . '/cors.php';
//
// АБО — додай include на початку існуючого middleware.php:
//   require_once __DIR__ . '/cors.php';
//
// Конфігурація через .env:
//   CORS_ORIGINS=https://app.indexfast.pro,https://indexfast.pro
//   CORS_ENABLED=true
//
// Якщо CORS_ORIGINS=* — дозволяє всі домени (тільки для розробки!)
// Якщо CORS_ORIGINS порожній — CORS вимкнено (запити лише з того ж домену)

// Не підключати двічі
if (defined('INDEXFAST_CORS_LOADED')) return;
define('INDEXFAST_CORS_LOADED', true);

// Якщо CORS вимкнено в конфігурації — нічого не робимо
if (env('CORS_ENABLED', 'false') !== 'true') return;

$allowedOrigins = array_filter(
    array_map('trim', explode(',', env('CORS_ORIGINS', '')))
);

$requestOrigin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Визначаємо чи дозволити цей origin
$originAllowed = false;

if (!empty($allowedOrigins)) {
    if (in_array('*', $allowedOrigins, true)) {
        // Wildcard — дозволяємо все (тільки для dev!)
        $originAllowed = true;
        header('Access-Control-Allow-Origin: *');
    } elseif ($requestOrigin && in_array($requestOrigin, $allowedOrigins, true)) {
        $originAllowed = true;
        header('Access-Control-Allow-Origin: ' . $requestOrigin);
        header('Vary: Origin');
    }
}

if ($originAllowed) {
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Worker-Key');
    header('Access-Control-Max-Age: 86400'); // 24 год кеш preflight
}

// Preflight OPTIONS — одразу повертаємо 204 і виходимо
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
