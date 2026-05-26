<?php
// api/track/click.php
// Трекінг кліку на CTA-кнопку в email → записує clicked_at → редіректить на pricing

$apiDir = dirname(__DIR__);
require_once $apiDir . '/config.php';
require_once $apiDir . '/db.php';

$token      = isset($_GET['t']) ? trim($_GET['t']) : '';
$targetUrl  = isset($_GET['u']) ? base64_decode($_GET['u']) : '';
$envUrl     = env('FRONTEND_URL', env('APP_URL', ''));
$urls       = explode(',', $envUrl);
$appUrl     = rtrim(trim($urls[0]), '/');
$fallbackUrl = $appUrl . '/app#pricing';

// Валідація токена
if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
    header('Location: ' . $fallbackUrl);
    exit;
}

// Валідація redirect URL — дозволяємо лише власний домен
$parsedApp    = parse_url($appUrl);
$parsedTarget = parse_url($targetUrl);
$safeUrl      = (
    !empty($parsedTarget['host']) &&
    $parsedTarget['host'] === ($parsedApp['host'] ?? '')
) ? $targetUrl : $fallbackUrl;

// Записуємо clicked_at (тільки перший клік)
try {
    DB::exec(
        "UPDATE email_logs SET clicked_at = NOW() WHERE token = ? AND clicked_at IS NULL",
        [$token]
    );
} catch (Exception $e) {
    error_log('[track/click] ' . $e->getMessage());
}

// Редіректимо на pricing
header('Location: ' . $safeUrl);
exit;
