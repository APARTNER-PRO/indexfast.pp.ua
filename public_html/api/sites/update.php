<?php
// ══════════════════════════════════════════════
//  PATCH /api/sites/update.php
//  body: { site_id, domain?, sitemap_url?, service_account? }
//  Оновлює домен, sitemap або Service Account
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('PATCH');
$uid    = (int)requireAuth()['sub'];
$body   = getBody();
$siteId = (int)($body['site_id'] ?? 0);
if (!$siteId) respond(422, 'site_id обов\'язковий');

// Перевірка що сайт належить юзеру
$site = DB::row(
    "SELECT id, domain, sitemap_url, status FROM sites WHERE id=? AND user_id=?",
    [$siteId, $uid]
);
if (!$site) respond(404, 'Сайт не знайдено');

$updates = [];
$params  = [];

// ── Домен
if (isset($body['domain'])) {
    $domain = sanitize(preg_replace('#^https?://#', '', trim($body['domain'])));
    $domain = rtrim($domain, '/');
    if (!$domain) respond(422, 'Невалідний домен');

    // Перевіряємо дублікат (інший сайт з таким доменом)
    $dup = DB::row(
        "SELECT id FROM sites WHERE user_id=? AND domain=? AND id!=?",
        [$uid, $domain, $siteId]
    );
    if ($dup) respond(409, "Сайт $domain вже підключено");

    $updates[] = "domain=?";
    $params[]  = $domain;
}

// ── Sitemap URL
if (isset($body['sitemap_url'])) {
    $sitemap = trim($body['sitemap_url']);
    if (!filter_var($sitemap, FILTER_VALIDATE_URL))
        respond(422, 'Невалідний URL sitemap.xml');
    $updates[] = "sitemap_url=?";
    $params[]  = $sitemap;
}

// ── Статус (активація після паузи)
if (isset($body['status']) && in_array($body['status'], ['active', 'paused'], true)) {
    $updates[] = "status=?";
    $params[]  = $body['status'];
}

// Застосовуємо зміни в sites
if ($updates) {
    $params[] = $siteId;
    DB::exec(
        "UPDATE sites SET " . implode(', ', $updates) . ", updated_at=NOW() WHERE id=?",
        $params
    );
}

// ── Service Account (окрема таблиця)
if (isset($body['service_account']) && trim($body['service_account']) !== '') {
    $saRaw = trim($body['service_account']);
    $sa    = json_decode($saRaw, true);

    if (!$sa || ($sa['type'] ?? '') !== 'service_account')
        respond(422, 'Невалідний Google Service Account JSON (type має бути "service_account")');
    if (!isset($sa['client_email'], $sa['private_key']))
        respond(422, 'JSON не містить client_email або private_key');

    $encKey = base64_encode($saRaw);

    // Оновлюємо в site_credentials
    try {
        DB::exec(
            "INSERT INTO site_credentials (site_id, service_account)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE service_account = VALUES(service_account)",
            [$siteId, $encKey]
        );
    } catch (Throwable $e) {
        error_log('[sites/update] site_credentials: ' . $e->getMessage());
    }


    // Скидаємо помилку сайту якщо була
    DB::exec(
        "UPDATE sites SET status='active', error_message=NULL WHERE id=? AND status='error'",
        [$siteId]
    );
}

// Перераховуємо кількість URL у sitemap якщо змінився URL
if (isset($body['sitemap_url'])) {
    try {
        $urlCount = parseSitemapCount($body['sitemap_url']);
        if ($urlCount > 0)
            DB::exec("UPDATE sites SET total_urls=? WHERE id=?", [$urlCount, $siteId]);
    } catch (Throwable) {}
}

// Повертаємо оновлений сайт
$updated = DB::row(
    "SELECT id, domain, sitemap_url, status, error_message,
            total_urls, indexed_total, last_run_at
     FROM sites WHERE id=?",
    [$siteId]
);

// Перевіряємо чи є SA
$hasSa = (bool)DB::row(
    "SELECT site_id FROM site_credentials WHERE site_id=?", [$siteId]
);

respondOk('Сайт оновлено', [
    'site' => [
        'id'            => (int)$updated['id'],
        'domain'        => $updated['domain'],
        'sitemap_url'   => $updated['sitemap_url'],
        'status'        => $updated['status'],
        'error_message' => $updated['error_message'],
        'total_urls'    => (int)$updated['total_urls'],
        'indexed_total' => (int)$updated['indexed_total'],
        'last_run_at'   => $updated['last_run_at'],
        'has_sa'        => $hasSa,
    ],
]);

// ── parseSitemapCount helper (той самий що в index.php)
function parseSitemapCount(string $url): int {
    try {
        $ctx = stream_context_create(['http' => ['timeout' => 5, 'user_agent' => 'IndexFast-Bot/1.0']]);
        if (!filter_var($url, FILTER_VALIDATE_URL)) return 0;
        $raw = @file_get_contents($url, false, $ctx);
        if (!$raw) return 0;
        if (substr($raw, 0, 2) === "\x1f\x8b") $raw = gzdecode($raw);
        $doc = new SimpleXMLElement($raw, LIBXML_NOERROR);
        if ($doc->getName() === 'sitemapindex') {
            return count($doc->sitemap) * 100; // приблизно
        }
        return count($doc->url);
    } catch (Throwable) { return 0; }
}
