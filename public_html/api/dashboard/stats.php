<?php
// ══════════════════════════════════════════════
//  GET /api/dashboard/stats.php
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/plans.php';
require_once dirname(__DIR__) . '/gsc/helpers.php';
requireMethod('GET');

$uid = (int)requireAuth()['sub'];

// ── 1. Юзер
$user = DB::row(
    "SELECT id, name, surname, email, email_verified, marketing_consent, plan, plan_expires_at, avatar_url FROM users WHERE id = ?",
    [$uid]
);
if (!$user) respond(404, 'Користувача не знайдено');

$plan = $user['plan'] ?? 'start';
$cfg  = Plans::get($plan);

// ── 2. Денний ліміт
$day = Plans::todayUsage($uid, $plan);
$todaySent  = (int)$day['urls_sent'];
$todayLimit = (int)$day['urls_limit'];

// Дельта vs вчора
$yday = DB::row(
    "SELECT urls_sent FROM daily_usage
     WHERE user_id = ? AND usage_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)",
    [$uid]
);
$delta = $todaySent - (int)($yday['urls_sent'] ?? 0);

// Місяць
$month = (int)(DB::row(
    "SELECT COALESCE(SUM(urls_sent), 0) AS s FROM daily_usage
     WHERE user_id = ? AND usage_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')",
    [$uid]
)['s'] ?? 0);

// ── 3. Сайти
$hasGscUrl = gscHasGscUrlColumn();
$sites = [];
try {
    $sites = DB::all(
        "SELECT id, domain, sitemap_url, status, error_message,
                total_urls, indexed_total, last_run_at, indexnow_key, indexnow_enabled" . ($hasGscUrl ? ', gsc_url' : '') . "
         FROM sites WHERE user_id = ? ORDER BY created_at DESC",
        [$uid]
    );
} catch (Throwable $e) {
    // Таблиця sites ще не створена
    error_log('[stats] sites query failed: ' . $e->getMessage());
}

// ── 4. has_sa — чи є service_account для кожного сайту
$sitesHasSa = [];
$siteIds = array_column($sites, 'id');
if ($siteIds) {
    try {
        $in = implode(',', array_fill(0, count($siteIds), '?'));
        $saRows = DB::all(
            "SELECT site_id FROM site_credentials WHERE site_id IN ({$in})",
            $siteIds
        );
        foreach ($saRows as $r) $sitesHasSa[$r['site_id']] = true;
    } catch (Throwable $e) {
        error_log('[stats] has_sa query failed: ' . $e->getMessage());
    }
}

// ── 5. Активні jobs (простий запит без ROW_NUMBER)
$activeJobs = [];
if ($siteIds) {
    try {
        $in = implode(',', array_fill(0, count($siteIds), '?'));
        $jobs = DB::all(
            "SELECT site_id, id, status, total, sent, failed,
                    ROUND((sent + failed) / NULLIF(total, 0) * 100) AS progress
             FROM jobs
             WHERE site_id IN ({$in}) AND user_id = ?
               AND status IN ('pending', 'processing', 'done', 'failed')
             ORDER BY created_at DESC",
            array_merge($siteIds, [$uid])
        );
        // Беремо тільки перший (найсвіжіший) job для кожного сайту
        foreach ($jobs as $j) {
            $sid = $j['site_id'];
            if (!isset($activeJobs[$sid])) {
                $activeJobs[$sid] = $j;
            }
        }
    } catch (Throwable $e) {
        error_log('[stats] jobs query failed: ' . $e->getMessage());
    }
}

// ── 5. Логи
$logs = [];
$siteDomains = array_column($sites, 'domain', 'id');
try {
    $logs = DB::all(
        "SELECT url, status, http_status, error_msg, indexnow_status, indexnow_http_status, created_at, site_id
         FROM indexing_log
         WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
        [$uid]
    );
    foreach ($logs as &$log) {
        $log['domain'] = $siteDomains[$log['site_id']] ?? null;
        unset($log['site_id']);
    }
    unset($log);
} catch (Throwable $e) {
    error_log('[stats] logs query failed: ' . $e->getMessage());
}

// ── 6. Графік
$chart = [];
try {
    $chart = DB::all(
        "SELECT usage_date AS date, urls_sent AS sent
         FROM daily_usage
         WHERE user_id = ? AND usage_date >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
         ORDER BY usage_date ASC",
        [$uid]
    );
} catch (Throwable $e) {
    error_log('[stats] chart query failed: ' . $e->getMessage());
}

respondOk('OK', [
    'user' => [
        'id'             => (int)$user['id'],
        'name'           => $user['name'],
        'surname'        => $user['surname'],
        'email'          => $user['email'],
        'email_verified'     => (bool)$user['email_verified'],
        'marketing_consent'  => (bool)$user['marketing_consent'],
        'plan'               => $plan,
        'plan_expires_at'    => $user['plan_expires_at'],
        'plan_label'     => $cfg['label'],
        'avatar_url'     => $user['avatar_url'],
    ],
    'today' => [
        'sent'      => $todaySent,
        'limit'     => $todayLimit,
        'remaining' => max(0, $todayLimit - $todaySent),
        'delta'     => $delta,
    ],
    'month'       => $month,
    'sites'       => array_map(fn($s) => [
        'id'            => (int)$s['id'],
        'domain'        => $s['domain'],
        'sitemap_url'   => $s['sitemap_url'],
        'status'        => $s['status'],
        'error_message' => $s['error_message'],
        'total_urls'    => (int)$s['total_urls'],
        'indexed_total' => (int)$s['indexed_total'],
        'last_run_at'   => $s['last_run_at'],
        'indexnow_key'  => $s['indexnow_key'] ?? null,
        'indexnow_enabled' => !empty($s['indexnow_enabled']),
        'has_sa'        => isset($sitesHasSa[$s['id']]),
        'gsc_url'       => $hasGscUrl ? ($s['gsc_url'] ?? null) : null,
        'active_job'    => isset($activeJobs[$s['id']]) ? [
            'id'       => (int)$activeJobs[$s['id']]['id'],
            'status'   => $activeJobs[$s['id']]['status'],
            'progress' => (int)($activeJobs[$s['id']]['progress'] ?? 0),
            'sent'     => (int)$activeJobs[$s['id']]['sent'],
            'failed'   => (int)$activeJobs[$s['id']]['failed'],
            'total'    => (int)$activeJobs[$s['id']]['total'],
        ] : null,
    ], $sites),
    'sites_limit' => $cfg['max_sites'],
    'logs'        => $logs,
    'chart'       => $chart,
]);
