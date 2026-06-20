<?php
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';
require_once __DIR__ . '/helpers.php';

requireMethod('GET');
$uid = (int)requireAuth()['sub'];

$siteIdsRaw = $_GET['site_ids'] ?? '';
$siteIds = array_filter(array_map('intval', preg_split('/[,\s]+/', $siteIdsRaw)));
$days = isset($_GET['days']) ? (int)$_GET['days'] : 28;

// Збільшуємо ліміт часу для багатьох сайтів
set_time_limit(0);

$data = gscMetricsForSites($uid, $siteIds, $days);
respondOk('OK', $data);
