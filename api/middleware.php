<?php
// ══════════════════════════════════════════════
//  IndexFast — middleware.php
//  CORS, JSON headers, Bearer auth guard
// ══════════════════════════════════════════════

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

// ── CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, CORS_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
} elseif (DEBUG) {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Вимагати метод
function requireMethod(string ...$methods): void {
    if (!in_array($_SERVER['REQUEST_METHOD'], $methods, true)) {
        respond(405, 'Method Not Allowed');
    }
}

// ── Вимагати авторизацію (Bearer JWT)
function requireAuth(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($header, 'Bearer ')) {
        respond(401, 'Unauthorized: відсутній токен');
    }
    $token = substr($header, 7);
    $payload = JWT::decode($token);

    if (!$payload || ($payload['type'] ?? '') !== 'access') {
        respond(401, 'Unauthorized: невалідний або прострочений токен');
    }
    return $payload;
}
