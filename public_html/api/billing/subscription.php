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

// Інформація про тарифи з Plans::CONFIG (єдине джерело істини) + ціни з ENV
$plans = [];
$rateToUah = 1;
if (DEFAULT_CURRENCY !== 'UAH') {
    $rateKey = 'EXCHANGE_' . DEFAULT_CURRENCY . '_TO_UAH';
    $rateToUah = (float)env($rateKey, 1);
}

foreach (Plans::CONFIG as $pid => $cfg) {
    $planData = [
        'label'      => $cfg['label'],
        'popular'    => (bool)($cfg['popular']    ?? false),
        'enterprise' => (bool)($cfg['enterprise'] ?? false),
        'features'   => $cfg['features'] ?? [],
        'urls_per_day' => (int)($cfg['urls_per_day'] ?? 0),
        'max_sites'    => (int)($cfg['max_sites']    ?? 0),
        'limits'       => $cfg['limits'] ?? [],
        'month'      => (float)env('PRICE_' . strtoupper($pid) . '_MONTH', 0),
        'year'       => (float)env('PRICE_' . strtoupper($pid) . '_YEAR',  0),
        '3_years'    => (float)env('PRICE_' . strtoupper($pid) . '_3_YEARS', 0),
        'lifetime'   => (float)env('PRICE_' . strtoupper($pid) . '_LIFETIME', 0),
        'month_uah'  => round((float)env('PRICE_' . strtoupper($pid) . '_MONTH', 0) * $rateToUah, 2),
        'year_uah'   => round((float)env('PRICE_' . strtoupper($pid) . '_YEAR',  0) * $rateToUah, 2),
        '3_years_uah'=> round((float)env('PRICE_' . strtoupper($pid) . '_3_YEARS', 0) * $rateToUah, 2),
        'lifetime_uah'=> round((float)env('PRICE_' . strtoupper($pid) . '_LIFETIME', 0) * $rateToUah, 2),
    ];
    $plans[$pid] = $planData;
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
    'current_plan'      => isset($user['plan']) ? $user['plan'] : 'start',
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
    'currency'          => DEFAULT_CURRENCY,
]);
