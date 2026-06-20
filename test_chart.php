<?php
require 'd:/OSPanel/home/tools/indexfast.local/public_html/api/db.php';
require 'd:/OSPanel/home/tools/indexfast.local/public_html/api/gsc/helpers.php';
$uid = 1; // Assuming user ID 1
$token = gscGetAccessToken($uid);
$days = 7;
$siteUrl = 'sc-domain:apartner.pro';
$start = date('Y-m-d', strtotime('-8 days'));
$end = date('Y-m-d', strtotime('-2 days'));
$encoded = rawurlencode($siteUrl);
$url = 'https://www.googleapis.com/webmasters/v3/sites/' . $encoded . '/searchAnalytics/query';
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode(['startDate' => $start, 'endDate' => $end, 'dimensions' => ['date']]),
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: application/json']
]);
$res = curl_exec($ch);
print_r(json_decode($res, true));
