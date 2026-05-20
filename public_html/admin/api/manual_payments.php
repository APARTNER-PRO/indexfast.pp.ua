<?php
// public_html/admin/api/manual_payments.php
// Шлях: public_html/admin/api/ → auth.php в public_html/admin/
require_once dirname(__DIR__) . '/auth.php';

header('Content-Type: application/json; charset=UTF-8');

$status = $_GET['status'] ?? null;
$where  = $status ? "WHERE mpr.status=?" : "";
$params = $status ? [$status] : [];

$requests = DB::all(
    "SELECT mpr.id, mpr.status, mpr.user_email, mpr.plan_id, mpr.period, mpr.amount,
            mpr.receipt_url, mpr.notes, mpr.admin_notes, mpr.confirmed_by, mpr.confirmed_at,
            mpr.created_at, mpr.subscription_id,
            u.name, u.surname
     FROM manual_payment_requests mpr
     JOIN users u ON u.id = mpr.user_id
     {$where}
     ORDER BY mpr.created_at DESC LIMIT 200",
    $params
);

echo json_encode(['requests' => $requests, 'total' => count($requests)]);
