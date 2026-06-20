<?php
require 'd:/OSPanel/home/tools/indexfast.local/public_html/api/config.php';
require 'd:/OSPanel/home/tools/indexfast.local/public_html/api/helpers.php';
require 'd:/OSPanel/home/tools/indexfast.local/public_html/api/vendor/autoload.php';
use \Firebase\JWT\JWT;

$payload = [
    'sub' => 1,
    'iat' => time(),
    'exp' => time() + 3600,
    'type' => 'access'
];
$jwt = JWT::encode($payload, JWT_SECRET, 'HS256');

$url = 'http://indexfast.local/api/gsc/chart.php?days=60&site_ids=41,43,44,45';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $jwt]);
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: $httpcode\n";
echo "cURL Error: $error\n";
echo "Response: $response\n";
