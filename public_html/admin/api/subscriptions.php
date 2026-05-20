<?php
// public_html/admin/api/subscriptions.php
require_once dirname(__DIR__) . '/auth.php';

header('Content-Type: application/json; charset=UTF-8');

$subscriptions = DB::all(
    "SELECT s.id, s.plan_id, s.payment_method, s.period, s.start_at, s.end_at,
            s.status, s.amount, s.currency, s.created_at,
            u.email, u.name, u.surname
     FROM subscriptions s
     JOIN users u ON u.id = s.user_id
     ORDER BY s.created_at DESC LIMIT 500"
);

$stats = DB::row(
    "SELECT COUNT(*) AS total,
            SUM(status='paid')      AS active,
            SUM(status='pending')   AS pending,
            SUM(status='expired')   AS expired,
            SUM(status='cancelled') AS cancelled
     FROM subscriptions"
) ?? [];

$revenue = DB::row(
    "SELECT COALESCE(SUM(amount),0) AS month_revenue FROM payments
     WHERE status='paid' AND paid_at >= DATE_FORMAT(NOW(),'%Y-%m-01')"
) ?? [];

echo json_encode(['subscriptions' => $subscriptions, 'stats' => array_merge($stats, $revenue)]);
