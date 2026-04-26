<?php
// ══════════════════════════════════════════════
//  GET /api/gsc/sites.php
//  Повертає список сайтів з Google Search Console
//  Використовує збережений gsc_access_token
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';

requireMethod('GET');
$uid = (int)requireAuth()['sub'];

$user = DB::row(
    "SELECT gsc_access_token, gsc_token_expires FROM users WHERE id=?",
    [$uid]
);

if (!$user || empty($user['gsc_access_token'])) {
    respond(403, 'Не авторизовано для Google Search Console. Спочатку підключіть GSC.');
}

// Перевіряємо чи не протік токен
if ($user['gsc_token_expires'] && strtotime($user['gsc_token_expires']) < time()) {
    // Очищаємо протілий токен
    DB::exec("UPDATE users SET gsc_access_token=NULL, gsc_token_expires=NULL WHERE id=?", [$uid]);
    respond(403, 'GSC токен протік. Підключіть Search Console знову.');
}

// ── Запит до Search Console API
$ch = curl_init('https://www.googleapis.com/webmasters/v3/sites');
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
    respond(502, "Search Console API помилка: $err");
}

$data  = json_decode($body, true) ?? [];
$items = $data['siteEntry'] ?? [];

if (empty($items)) {
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
