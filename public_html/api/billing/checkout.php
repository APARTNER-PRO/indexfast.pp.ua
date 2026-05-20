<?php
// public_html/api/billing/checkout.php
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../payment/SubscriptionService.php';
require_once __DIR__ . '/../payment/PaymentManager.php';

requireMethod('POST');
$user = requireAuth();

$body          = json_decode(file_get_contents('php://input'), true) ?? [];
$planId        = trim($body['plan_id']        ?? '');
$period        = trim($body['period']         ?? 'month');
$paymentMethod = trim($body['payment_method'] ?? '');

if (!$planId || !array_key_exists($planId, Plans::CONFIG)) respond(400, 'Невірний тариф');
if (!in_array($period, ['month','year','custom'], true))   respond(400, 'Невірний period');
if (!$paymentMethod)                                        respond(400, 'Не вказано метод оплати');

$manager  = PaymentManager::getInstance();
$provider = $manager->getProvider($paymentMethod);
if (!$provider || !$provider->isEnabled()) respond(400, 'Цей метод оплати недоступний');

try {
    $result = (new SubscriptionService())->initiate($user, $planId, $period, $paymentMethod);
    respond(200, 'ok', $result);
} catch (Throwable $e) {
    error_log('[checkout] ' . $e->getMessage());
    respond(500, 'Помилка ініціювання оплати: ' . $e->getMessage());
}
