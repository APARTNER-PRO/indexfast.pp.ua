<?php
// public_html/api/billing/subscription.php
require_once __DIR__ . '/../middleware.php';
require_once __DIR__ . '/../payment/SubscriptionService.php';
require_once __DIR__ . '/../payment/PaymentManager.php';
require_once __DIR__ . '/../plans.php';

requireMethod('GET');
$user    = requireAuth();
$svc     = new SubscriptionService();
$manager = PaymentManager::getInstance();

$history = DB::all(
    "SELECT id, plan_id, payment_method, period, start_at, end_at,
            status, amount, currency, created_at
     FROM subscriptions
     WHERE user_id = ?
     ORDER BY created_at DESC LIMIT 10",
    [$user['id']]
);

// Ціни тарифів з ENV
$plans = [];
foreach (Plans::CONFIG as $pid => $cfg) {
    if ($pid === 'start' || $pid === 'free') continue; // пропускаємо безкоштовні
    $plans[$pid] = [
        'label' => $cfg['label'],
        'month' => (float)env('PRICE_' . strtoupper($pid) . '_MONTH', 0),
        'year'  => (float)env('PRICE_' . strtoupper($pid) . '_YEAR',  0),
    ];
}

$methods = $manager->getEnabledProvidersInfo();

// Реквізити ручного переказу (тільки якщо увімкнено)
$manualRequisites = null;
$manualProvider   = $manager->getProvider('manual');
if ($manualProvider !== null && $manualProvider->isEnabled()) {
    $manualRequisites = [
        'card_number' => env('MANUAL_TRANSFER_CARD_NUMBER', ''),
        'iban'        => env('MANUAL_TRANSFER_IBAN', ''),
        'recipient'   => env('MANUAL_TRANSFER_RECIPIENT', 'IndexFast'),
        'bank'        => env('MANUAL_TRANSFER_BANK', ''),
    ];
}

respond(200, 'ok', [
    'current_plan'      => isset($user['plan']) ? $user['plan'] : 'free',
    'plan_expires_at'   => isset($user['plan_expires_at']) ? $user['plan_expires_at'] : null,
    'subscription'      => $svc->getActive((int)$user['id']),
    'history'           => $history,
    'plans'             => $plans,
    'payment_methods'   => [
        'count'   => $manager->countEnabled(),
        'single'  => $manager->countEnabled() === 1,
        'methods' => $methods,
    ],
    'manual_requisites' => $manualRequisites,
]);
