<?php
// ══════════════════════════════════════════════
//  GET /api/gsc/sitemaps.php?url=...
//  Повертає список Sitemaps для конкретного сайту в GSC
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';

requireMethod('GET');
$uid = (int)requireAuth()['sub'];

$gscUrl = $_GET['url'] ?? '';
if (!$gscUrl) respond(422, 'Відсутній параметр url');

$user = DB::row(
    "SELECT gsc_access_token, gsc_token_expires FROM users WHERE id=?",
    [$uid]
);

if (!$user || empty($user['gsc_access_token'])) {
    respond(403, 'Не авторизовано для GSC');
}

// Перевірка токена (спрощена)
if ($user['gsc_token_expires'] && strtotime($user['gsc_token_expires']) < time()) {
    respond(403, 'GSC токен прострочений');
}

// ── Запит до Search Console API (Sitemaps list)
// Ендпоінт: https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps
$encodedUrl = urlencode($gscUrl);
$ch = curl_init("https://www.googleapis.com/webmasters/v3/sites/{$encodedUrl}/sitemaps");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $user['gsc_access_token'],
        'Accept: application/json',
    ],
]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200) {
    $err = json_decode($body, true)['error']['message'] ?? "HTTP $code";
    respond(502, "GSC API помилка: $err");
}

$data = json_decode($body, true) ?? [];
$items = $data['sitemap'] ?? [];

$sitemaps = [];
foreach ($items as $item) {
    $sitemaps[] = [
        'path' => $item['path'] ?? '',
        'last_submitted' => $item['lastSubmitted'] ?? '',
        'errors' => $item['errors'] ?? 0,
        'warnings' => $item['warnings'] ?? 0,
        'type' => $item['type'] ?? '',
    ];
}

respondOk('OK', ['sitemaps' => $sitemaps]);
