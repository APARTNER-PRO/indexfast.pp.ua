<?php
$_SERVER['REQUEST_METHOD'] = 'GET';
$_GET['days'] = 7;
$_GET['site_ids'] = '41,43,44,45';

// Mock requireAuth() and respondOk() so we can test chart.php logic
function requireMethod() {}
function requireAuth() { return ['sub' => 1]; }
function respondOk($msg, $data) {
    echo json_encode(['success' => true, 'message' => $msg] + $data, JSON_PRETTY_PRINT);
    exit;
}
function respond($code, $msg, $data=[]) {
    echo json_encode(['success' => false, 'message' => $msg] + $data, JSON_PRETTY_PRINT);
    exit;
}

require 'd:/OSPanel/home/tools/indexfast.local/public_html/api/db.php';
require 'd:/OSPanel/home/tools/indexfast.local/public_html/api/gsc/helpers.php';

// Now include the chart code (except we skip require_once for middleware since we mocked it)
// We'll read chart.php, remove the require middleware line, and eval it.
$chartCode = file_get_contents('d:/OSPanel/home/tools/indexfast.local/public_html/api/gsc/chart.php');
$chartCode = preg_replace('/require_once.*middleware\.php\';/', '', $chartCode);
$chartCode = preg_replace('/require_once.*db\.php\';/', '', $chartCode);
$chartCode = preg_replace('/require_once.*helpers\.php\';/', '', $chartCode);
$chartCode = str_replace('<?php', '', $chartCode);

eval($chartCode);
