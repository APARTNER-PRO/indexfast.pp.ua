<?php
// public_html/api/billing/cancel.php
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../payment/SubscriptionService.php';

requireMethod('POST');
$user  = requireAuth();
$body  = json_decode(file_get_contents('php://input'), true) ?? [];
$subId = (int)($body['sub_id'] ?? 0);

if (!$subId) respond(400, 'Не вказано ID підписки');

try {
    (new SubscriptionService())->cancel((int)$user['id'], $subId);
    respond(200, 'Підписку скасовано. Доступ залишається до кінця оплаченого periodу.');
} catch (Throwable $e) {
    respond(500, 'Помилка скасування: ' . $e->getMessage());
}
