<?php
// ══════════════════════════════════════════════
//  GET /api/gsc/sites.php
//  Повертає список сайтів з Google Search Console
//  Використовує збережений gsc_access_token
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';
require_once __DIR__ . '/helpers.php';

requireMethod('GET');
$uid = (int)requireAuth()['sub'];
$token = gscGetAccessToken($uid);

// ── Запит до Search Console API
$ch = curl_init('https://www.googleapis.com/webmasters/v3/sites');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $token,
        'Accept: application/json',
    ],
]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200) {
    $err = json_decode($body, true)['error']['message'] ?? "HTTP $code";
    respond(502, "Search Console API помилка: $err");
}

$data  = json_decode($body, true) ?? [];
$items = $data['siteEntry'] ?? [];

if (empty($items)) {
    // Тимчасово для дебагу: якщо порожньо, можемо глянути структуру
    // error_log("GSC Sites empty. Raw body: " . $body);
    // respondOk('Немає сайтів у Search Console', ['sites' => [], 'debug_raw' => $data]);
    respondOk('Немає сайтів у Search Console', ['sites' => []]);
}

// ── Фільтруємо і форматуємо
// GSC повертає URL як: sc-domain:example.com або https://example.com/
$already = array_column(
    DB::all("SELECT domain FROM sites WHERE user_id=?", [$uid]),
    'domain'
);

$sites = [];
foreach ($items as $item) {
    $url        = $item['siteUrl'] ?? '';
    $permission = $item['permissionLevel'] ?? '';

    // Тільки сайти з правом FULL або OWNER (не READ_ONLY для індексації)
    // Але для імпорту показуємо всі — SA додається окремо
    // if ($permission !== 'siteOwner') continue;
    if ($permission === 'siteUnverifiedUser') continue;

    $domain = preg_replace('#^(sc-domain:|https?://|http?://)#', '', rtrim($url, '/'));
    $domain = preg_replace('#/.*$#', '', $domain); // прибираємо path

    if (!$domain) continue;

    // Формуємо sitemap URL
    $sitemapUrl = 'https://' . $domain . '/sitemap.xml';
    if (str_starts_with($url, 'http://')) $sitemapUrl = 'http://' . $domain . '/sitemap.xml';

    $sites[] = [
        'gsc_url'    => $url,
        'domain'     => $domain,
        'sitemap'    => $sitemapUrl,
        'permission' => $permission,
        'already'    => in_array($domain, $already),
    ];
}

// Сортуємо: спочатку ті що ще не додані
usort($sites, fn($a, $b) => $a['already'] <=> $b['already']);

respondOk('OK', ['sites' => $sites]);
