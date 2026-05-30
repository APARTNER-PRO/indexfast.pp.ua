<?php
// public_html/api/billing/serve_receipt.php

// Require the same authentication as the rest of the admin panel
require_once dirname(__DIR__, 2) . '/admin/auth.php';

// 1. Prevent path traversal and sanitize filename
$filename = $_GET['file'] ?? '';
$filename = basename($filename); // basename strips any directory paths

if (empty($filename) || !preg_match('/^receipt_[a-zA-Z0-9_\-\.]+\.[a-zA-Z0-9]+$/', $filename)) {
    http_response_code(400);
    die('Invalid filename');
}

// 2. Resolve the path
$dir = dirname(__DIR__, 3) . '/storage/receipts/';
$filepath = $dir . $filename;

if (!file_exists($filepath)) {
    http_response_code(404);
    die('File not found');
}

// 3. Detect MIME type
$ext = strtolower(pathinfo($filepath, PATHINFO_EXTENSION));
$mime = 'application/octet-stream';
switch ($ext) {
    case 'pdf':
        $mime = 'application/pdf';
        break;
    case 'jpg':
    case 'jpeg':
        $mime = 'image/jpeg';
        break;
    case 'png':
        $mime = 'image/png';
        break;
    case 'webp':
        $mime = 'image/webp';
        break;
}

// 4. Send headers and stream file
header('Content-Type: ' . $mime);
header('Content-Length: ' . filesize($filepath));
header('Cache-Control: private, no-cache, no-store, must-revalidate'); // Do not cache sensitive receipts publicly
readfile($filepath);
exit;
