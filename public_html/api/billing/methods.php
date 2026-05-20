<?php
// public_html/api/billing/methods.php
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../payment/PaymentManager.php';

requireMethod('GET');
$user = requireAuth();

$manager = PaymentManager::getInstance();
respond(200, 'ok', [
    'count'   => $manager->countEnabled(),
    'single'  => $manager->countEnabled() === 1,
    'methods' => $manager->getEnabledProvidersInfo(),
]);
