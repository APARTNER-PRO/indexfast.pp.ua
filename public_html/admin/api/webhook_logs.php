<?php
// public_html/admin/api/webhook_logs.php
require_once dirname(__DIR__) . '/auth.php';

header('Content-Type: application/json; charset=UTF-8');

$provider = $_GET['provider'] ?? null;
$status   = $_GET['status']   ?? null;
$limit    = min((int)($_GET['limit'] ?? 200), 1000);

$where = []; $params = [];
if ($provider) { $where[] = 'provider=?';    $params[] = $provider; }
if ($status)   { $where[] = 'status=?';      $params[] = $status;   }
$w = $where ? 'WHERE '.implode(' AND ',$where) : '';

$logs = DB::all(
    "SELECT id, provider, event_type, external_id, status, ip, error, created_at, processed_at
     FROM webhook_logs {$w} ORDER BY created_at DESC LIMIT {$limit}",
    $params
);

echo json_encode(['logs' => $logs, 'total' => count($logs)]);
