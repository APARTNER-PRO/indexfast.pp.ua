<?php
// ══════════════════════════════════════════════
//  POST /api/indexing/run.php
//  Додає завдання в чергу (НЕ виконує синхронно)
//  Відповідь: 202 Accepted + job_id
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/plans.php';

requireMethod('POST');
$uid  = (int)requireAuth()['sub'];
$user = DB::row("SELECT plan FROM users WHERE id=?", [$uid]);
$plan = $user['plan'] ?? 'start';

$body   = getBody();
$siteId = (int)($body['site_id'] ?? 0);
if (!$siteId) respond(422, 'site_id обов\'язковий');

// ── Перевіряємо сайт
$site = DB::row(
    "SELECT id, domain, sitemap_url, status FROM sites WHERE id=? AND user_id=?",
    [$siteId, $uid]
);
if (!$site)                       respond(404, 'Сайт не знайдено');
if ($site['status'] === 'paused') respond(403, 'Сайт на паузі. Активуйте його спочатку.');

// ── Перевіряємо credentials (site_credentials або sites.service_account)
$cred = DB::row("SELECT site_id FROM site_credentials WHERE site_id=?", [$siteId]);

if (!$cred) {
    // Fallback: перевіряємо чи є в sites.service_account (стара схема)
    $hasCol = DB::row(
        "SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME   = 'sites'
           AND COLUMN_NAME  = 'service_account'"
    )['cnt'] > 0;

    if ($hasCol) {
        $sa = DB::row(
            "SELECT service_account FROM sites WHERE id=? AND service_account IS NOT NULL",
            [$siteId]
        );
        if ($sa) {
            // Мігруємо в site_credentials автоматично
            try {
                DB::exec(
                    "INSERT INTO site_credentials (site_id, service_account)
                     VALUES (?, ?)
                     ON DUPLICATE KEY UPDATE service_account = VALUES(service_account)",
                    [$siteId, $sa['service_account']]
                );
                $cred = ['site_id' => $siteId];
            } catch (Throwable $e) {
                error_log('[run] migrate credentials failed: ' . $e->getMessage());
            }
        }
    }
}

if (!$cred) respond(422, 'Немає Google Service Account. Видаліть і підключіть сайт знову.');

// ── Перевіряємо денний ліміт
$remaining = Plans::remaining($uid, $plan);
if ($remaining <= 0) {
    $usage = Plans::todayUsage($uid, $plan);
    respond(429, "Денний ліміт вичерпано ({$usage['urls_limit']} URL/день). Ліміт оновиться завтра о 00:00.");
}

// ── Чи немає вже активного job для цього сайту?
$active = DB::row(
    "SELECT id FROM jobs WHERE site_id=? AND user_id=? AND status IN ('pending','processing')",
    [$siteId, $uid]
);
if ($active) {
    respond(409, "Для сайту вже є активне завдання #" . (int)$active['id'] . ". Дочекайтесь завершення.");
}

// ── Скільки URL поставити в чергу
$requested = isset($body['count']) ? (int)$body['count'] : $remaining;
$count     = min(max(1, $requested), $remaining);

// ── Читаємо URL зі sitemap (лише парсинг, без Google API)
$urls = SitemapParser::fetch($site['sitemap_url'], $count);
if (empty($urls)) {
    DB::exec("UPDATE sites SET status='error', error_message='Sitemap порожній або недоступний' WHERE id=?", [$siteId]);
    respond(422, 'Не вдалось отримати URL зі sitemap. Перевірте URL та доступність файлу.');
}

// ── Резервуємо ліміт одразу (захист від race condition паралельних запитів)
Plans::reserve($uid, count($urls));

// ── Створюємо job в черзі
$jobId = DB::exec(
    "INSERT INTO jobs (user_id, site_id, type, payload, status, total, priority)
     VALUES (?, ?, 'index_urls', ?, 'pending', ?, ?)",
    [$uid, $siteId, json_encode(['urls' => $urls]), count($urls), Plans::jobPriority($plan)]
);

// ── Логуємо кожен URL як 'pending'
$pdo    = DB::pdo();
$chunks = array_chunk($urls, 500);  // batch insert по 500
foreach ($chunks as $chunk) {
    $vals = implode(',', array_map(
        fn($url) => "({$siteId},{$uid}," . $pdo->quote($url) . ",'pending',{$jobId})",
        $chunk
    ));
    DB::exec("INSERT INTO indexing_log (site_id,user_id,url,status,job_id) VALUES {$vals}");
}

http_response_code(202);
respondOk('Завдання додано в чергу', [
    'job_id'    => (int)$jobId,
    'queued'    => count($urls),
    'remaining' => max(0, $remaining - count($urls)),
    'status'    => 'pending',
]);


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

// ══════════════════════════════════════════════
//  Парсер sitemap — читає URL, без Google API
// ══════════════════════════════════════════════
class SitemapParser {
    public static function fetch(string $url, int $limit, int $depth = 0): array {
        if ($depth > 3 || $limit <= 0) return [];
        try {
            $ctx = stream_context_create(['http' => [
                'timeout'    => 8,
                'user_agent' => 'IndexFast-Bot/1.0',
                'header'     => 'Accept-Encoding: gzip',
            ]]);
            if (!validatePublicUrl($url)) return [];
            $raw = @file_get_contents($url, false, $ctx);
            if (!$raw) return [];
            if (substr($raw, 0, 2) === "\x1f\x8b") $raw = gzdecode($raw);

            $doc  = new SimpleXMLElement($raw, LIBXML_NOERROR);
            $urls = [];

            if ($doc->getName() === 'sitemapindex') {
                foreach ($doc->sitemap as $s) {
                    if (count($urls) >= $limit) break;
                    $urls = array_merge($urls, self::fetch((string)$s->loc, $limit - count($urls), $depth + 1));
                }
            } else {
                foreach ($doc->url as $u) {
                    if (count($urls) >= $limit) break;
                    $loc = trim((string)$u->loc);
                    if (filter_var($loc, FILTER_VALIDATE_URL)) $urls[] = $loc;
                }
            }
            return $urls;
        } catch (Throwable) { return []; }
    }
}
