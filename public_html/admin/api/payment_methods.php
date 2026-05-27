<?php
// public_html/admin/api/payment_methods.php
require_once dirname(__DIR__) . '/auth.php';
require_once dirname(dirname(__DIR__)) . '/api/payment/PaymentManager.php';

header('Content-Type: application/json; charset=UTF-8');

// Створення таблиці, якщо її немає
try {
    DB::exec("
        CREATE TABLE IF NOT EXISTS `payment_methods_settings` (
          `provider_id` VARCHAR(50) NOT NULL,
          `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
          PRIMARY KEY (`provider_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
} catch (Exception $e) {}

// Обробити POST запит (зміна статусу)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body       = json_decode(file_get_contents('php://input'), true) ?? [];
    $providerId = trim($body['provider_id'] ?? '');
    $enabled    = isset($body['enabled']) ? (int)$body['enabled'] : null;

    if ($providerId !== '' && $enabled !== null) {
        try {
            DB::exec("
                INSERT INTO payment_methods_settings (provider_id, is_enabled)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE is_enabled = VALUES(is_enabled)
            ", [$providerId, $enabled]);

            echo json_encode(['status' => 'ok', 'message' => 'Статус оновлено']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        exit;
    }
    
    http_response_code(400);
    echo json_encode(['error' => 'Невірні параметри']);
    exit;
}

// Обробити GET запит (отримання списку)
$pm = PaymentManager::getInstance();

$dbSettings = [];
try {
    $rows = DB::all("SELECT provider_id, is_enabled FROM payment_methods_settings");
    foreach ($rows as $r) {
        $dbSettings[$r['provider_id']] = (int)$r['is_enabled'];
    }
} catch (Exception $e) {}

$registry = [
    'stripe'   => 'Stripe',
    'paddle'   => 'Paddle',
    'paypal'   => 'PayPal',
    'liqpay'   => 'LiqPay',
    'monobank' => 'Monobank',
    'manual'   => 'Ручний переказ (IBAN)',
];

$methods = [];
foreach ($registry as $id => $label) {
    $p = $pm->getProvider($id);
    $isConfigured = $p ? $p->isEnabled() : false;
    $dbStatus = isset($dbSettings[$id]) ? $dbSettings[$id] : 1; // увімкнено за замовчуванням

    $methods[] = [
        'id'         => $id,
        'label'      => $label,
        'configured' => $isConfigured, // наявність .env конфігурації
        'enabled'    => $dbStatus === 1, // стан в базі даних
    ];
}

echo json_encode(['methods' => $methods]);
