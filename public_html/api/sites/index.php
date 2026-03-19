<?php
// ══════════════════════════════════════════════
//  /api/sites/index.php
//  GET  → список сайтів
//  POST → додати сайт
//  MySQL 5.7 сумісний
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/plans.php';

$uid  = (int)requireAuth()['sub'];
$user = DB::row("SELECT plan FROM users WHERE id=?", [$uid]);
$plan = $user['plan'] ?? 'start';

// ════════════════════════════════
//  GET — список сайтів
// ════════════════════════════════
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sites  = DB::all(
        "SELECT id, domain, sitemap_url, status, error_message,
                total_urls, indexed_total, last_run_at, created_at
         FROM sites WHERE user_id=? ORDER BY created_at DESC",
        [$uid]
    );
    $usage  = Plans::todayUsage($uid, $plan);
    $limits = Plans::get($plan);

    respondOk('OK', [
        'sites' => array_map(fn($s) => [
            'id'            => (int)$s['id'],
            'domain'        => $s['domain'],
            'sitemap_url'   => $s['sitemap_url'],
            'status'        => $s['status'],
            'error_message' => $s['error_message'],
            'total_urls'    => (int)$s['total_urls'],
            'indexed_total' => (int)$s['indexed_total'],
            'last_run_at'   => $s['last_run_at'],
            'created_at'    => $s['created_at'],
        ], $sites),
        'plan'   => $plan,
        'limits' => $limits,
        'today'  => [
            'sent'      => (int)$usage['urls_sent'],
            'limit'     => (int)$usage['urls_limit'],
            'remaining' => max(0, (int)$usage['urls_limit'] - (int)$usage['urls_sent']),
        ],
    ]);
}

// ════════════════════════════════
//  POST — додати сайт
// ════════════════════════════════
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = getBody();
    requireField($body, 'domain', 'sitemap_url', 'service_account');

    // Нормалізуємо домен
    $domain = sanitize(preg_replace('#^https?://#', '', trim($body['domain'])));
    $domain = rtrim($domain, '/');
    if (!$domain) respond(422, 'Невалідний домен');

    $sitemap = trim($body['sitemap_url']);
    if (!filter_var($sitemap, FILTER_VALIDATE_URL))
        respond(422, 'Невалідний URL sitemap.xml');

    // Валідація Google Service Account JSON
    $saRaw = trim($body['service_account']);
    $sa    = json_decode($saRaw, true);
    if (!$sa || ($sa['type'] ?? '') !== 'service_account')
        respond(422, 'Невалідний Google Service Account JSON (type має бути "service_account")');
    if (!isset($sa['client_email'], $sa['private_key']))
        respond(422, 'Файл не містить полів client_email або private_key');

    // Перевірка ліміту сайтів
    $maxSites = Plans::get($plan)['max_sites'];
    $cnt      = (int)DB::row("SELECT COUNT(*) c FROM sites WHERE user_id=?", [$uid])['c'];
    if ($cnt >= $maxSites)
        respond(403, "Ваш план «{$plan}» дозволяє максимум {$maxSites} сайт(ів). Оновіть план.");

    // Дублікат
    if (DB::row("SELECT id FROM sites WHERE user_id=? AND domain=?", [$uid, $domain]))
        respond(409, "Сайт {$domain} вже підключено");

    $encKey = base64_encode($saRaw);

    // ── Визначаємо чи існує колонка service_account в sites
    $hasCol = DB::row(
        "SELECT COUNT(*) AS cnt
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME   = 'sites'
           AND COLUMN_NAME  = 'service_account'"
    )['cnt'] > 0;

    // ── INSERT в sites
    if ($hasCol) {
        // Стара схема (schema_v2 без v3) — колонка ще є в sites
        $siteId = DB::exec(
            "INSERT INTO sites (user_id, domain, sitemap_url, service_account, status)
             VALUES (?, ?, ?, ?, 'active')",
            [$uid, $domain, $sitemap, $encKey]
        );
    } else {
        // Нова схема (schema_v3) — credentials окремо
        $siteId = DB::exec(
            "INSERT INTO sites (user_id, domain, sitemap_url, status)
             VALUES (?, ?, ?, 'active')",
            [$uid, $domain, $sitemap]
        );
    }

    // ── Зберігаємо credentials в site_credentials (якщо таблиця є)
    try {
        DB::exec(
            "INSERT INTO site_credentials (site_id, service_account)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE service_account = VALUES(service_account)",
            [$siteId, $encKey]
        );
    } catch (Throwable $e) {
        // Таблиця site_credentials ще не створена (schema_v3 не виконано)
        // credentials збережено в sites.service_account (якщо колонка є)
        error_log('[sites/add] site_credentials insert failed: ' . $e->getMessage());
    }

    // ── Рахуємо URL у sitemap
    $urlCount = parseSitemapCount($sitemap);
    if ($urlCount > 0)
        DB::exec("UPDATE sites SET total_urls=? WHERE id=?", [$urlCount, $siteId]);

    $site = DB::row(
        "SELECT id, domain, sitemap_url, status, total_urls, indexed_total, created_at
         FROM sites WHERE id=?",
        [$siteId]
    );

    respondOk('Сайт підключено!', ['site' => [
        'id'            => (int)$site['id'],
        'domain'        => $site['domain'],
        'sitemap_url'   => $site['sitemap_url'],
        'status'        => $site['status'],
        'total_urls'    => (int)$site['total_urls'],
        'indexed_total' => (int)$site['indexed_total'],
        'created_at'    => $site['created_at'],
    ]]);
}

respond(405, 'Method Not Allowed');


// ── SSRF захист: блокуємо приватні IP та небезпечні схеми
function validatePublicUrl(string $url): bool {
    $parsed = parse_url($url);
    if (!$parsed || !isset($parsed['host'])) return false;
    // Дозволяємо тільки http/https
    if (!in_array($parsed['scheme'] ?? '', ['http', 'https'], true)) return false;
    $host = strtolower($parsed['host']);
    // Блокуємо localhost і приватні діапазони
    $blocked = ['localhost', '127.', '0.', '10.', '192.168.', '172.16.', '172.17.',
                '172.18.', '172.19.', '172.2', '169.254.', '::1', 'metadata.'];
    foreach ($blocked as $b) {
        if (str_starts_with($host, $b) || $host === rtrim($b, '.')) return false;
    }
    // Резолвимо IP і перевіряємо
    $ip = gethostbyname($host);
    if ($ip === $host) return false; // не резолвиться
    foreach ($blocked as $b) {
        if (str_starts_with($ip, $b)) return false;
    }
    return true;
}

// ── Парсинг sitemap
function parseSitemapCount(string $url, int $depth = 0): int {
    if ($depth > 3) return 0;
    try {
        $ctx = stream_context_create(['http' => ['timeout' => 6, 'user_agent' => 'IndexFast/1.0']]);
        if (!validatePublicUrl($url)) return 0;
        $xml = @file_get_contents($url, false, $ctx);
        if (!$xml) return 0;
        $doc = new SimpleXMLElement($xml);
        if ($doc->getName() === 'sitemapindex') {
            $total = 0;
            foreach ($doc->sitemap as $s)
                $total += parseSitemapCount((string)$s->loc, $depth + 1);
            return min($total, 100000);
        }
        return count($doc->url ?? []);
    } catch (Throwable) { return 0; }
}
