<?php
// api/track/open.php
// Tracking pixel — фіксує відкриття email (opened_at)
// Викликається автоматично коли email-клієнт завантажує зображення

$apiDir = dirname(__DIR__);
require_once $apiDir . '/config.php';
require_once $apiDir . '/db.php';

// Відповідаємо 1x1 прозорим GIF одразу — не блокуємо рендер
header('Content-Type: image/gif');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

// 1x1 прозорий GIF
echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

// Обробляємо токен після відправки відповіді
if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
}

$token = isset($_GET['t']) ? trim($_GET['t']) : '';
if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
    exit;
}

try {
    // Записуємо opened_at тільки для першого відкриття
    DB::exec(
        "UPDATE email_logs SET opened_at = NOW() WHERE token = ? AND opened_at IS NULL",
        [$token]
    );
} catch (Exception $e) {
    error_log('[track/open] ' . $e->getMessage());
}
