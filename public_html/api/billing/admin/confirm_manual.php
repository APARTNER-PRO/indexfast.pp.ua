<?php
// public_html/api/billing/admin/confirm_manual.php
// Захист: через той самий auth.php що і вся адмінка
require_once dirname(__DIR__, 3) . '/admin/auth.php';
require_once dirname(__DIR__, 2) . '/payment/SubscriptionService.php';

header('Content-Type: application/json; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"error":"Method not allowed"}'; exit; }

$body       = json_decode(file_get_contents('php://input'), true) ?? [];
$requestId  = (int)($body['request_id']  ?? 0);
$action     = trim($body['action']       ?? '');
$adminNotes = trim($body['admin_notes']  ?? '');

if (!$requestId || !in_array($action, ['confirm','reject'], true)) {
    http_response_code(400); echo json_encode(['error'=>'Невірні параметри']); exit;
}

$req = DB::row(
    "SELECT mpr.*, s.period FROM manual_payment_requests mpr JOIN subscriptions s ON s.id=mpr.subscription_id WHERE mpr.id=? AND mpr.status='pending'",
    [$requestId]
);
if (!$req) { http_response_code(404); echo json_encode(['error'=>'Не знайдено або вже оброблено']); exit; }

$adminName = $_SESSION['admin_name'] ?? $_SESSION['admin_auth'] ? 'admin' : 'unknown';

if ($action === 'confirm') {
    $expiresAt = $req['period']==='year'
        ? date('Y-m-d H:i:s', strtotime('+1 year'))
        : date('Y-m-d H:i:s', strtotime('+1 month'));
    try {
        (new SubscriptionService())->activate((int)$req['user_id'], (int)$req['subscription_id'],
            'manual_confirmed_'.$requestId, null, $expiresAt);
        DB::exec("UPDATE manual_payment_requests SET status='confirmed',confirmed_by=?,confirmed_at=NOW(),admin_notes=? WHERE id=?",
            [$adminName,$adminNotes,$requestId]);
        echo json_encode(['status'=>'ok','message'=>'Підписку активовано','expires_at'=>$expiresAt]);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error'=>'Помилка: '.$e->getMessage()]);
    }
} else {
    DB::exec("UPDATE manual_payment_requests SET status='rejected',confirmed_by=?,confirmed_at=NOW(),admin_notes=? WHERE id=?",
        [$adminName,$adminNotes,$requestId]);
    DB::exec("UPDATE subscriptions SET status='failed' WHERE id=?", [$req['subscription_id']]);
    echo json_encode(['status'=>'ok','message'=>'Платіж відхилено']);
}
