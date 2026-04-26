<?php
// Shared auth check для підсторінок адмінки
require_once dirname(__DIR__) . '/api/config.php';
require_once dirname(__DIR__) . '/api/db.php';
session_start();

define('ADMIN_PASS', env('ADMIN_PASSWORD', 'change_me_admin'));
define('ADMIN_IPS',  array_filter(array_map('trim', explode(',', env('ADMIN_IPS', '')))));

// IP захист
if (!empty(ADMIN_IPS)) {
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
    $ip = trim(explode(',', $ip)[0]);
    if (!in_array($ip, ADMIN_IPS, true)) { http_response_code(403); die('Access denied.'); }
}

// Auth check
if (empty($_SESSION['admin_auth'])) {
    die('<script>top.location.href="/admin/"</script>');
}
