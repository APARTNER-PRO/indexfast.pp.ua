<?php
// ══════════════════════════════════════════════
//  GET /api/indexing/logs.php
//  ?site_id=  ?limit=50  ?offset=0  ?status=ok|error|pending
//  Оптимізовано: covering indexes idx_site_log, idx_user_log
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';
requireMethod('GET');

$uid    = (int)requireAuth()['sub'];
$siteId = (int)($_GET['site_id'] ?? 0);
$limit  = min((int)($_GET['limit']  ?? 50), 200);
$offset = max((int)($_GET['offset'] ?? 0), 0);
$status = $_GET['status'] ?? '';  // optional filter

// Дозволені значення status
$allowedStatus = ['ok', 'error', 'pending', ''];
if (!in_array($status, $allowedStatus, true)) $status = '';

if ($siteId) {
    // Перевіряємо доступ — covering index idx_user_dashboard(user_id, ...)
    if (!DB::row("SELECT id FROM sites WHERE id=? AND user_id=?", [$siteId, $uid]))
        respond(404, 'Сайт не знайдено');

    // Запит використовує covering index idx_site_log(site_id, created_at, status, http_status)
    if ($status) {
        $logs  = DB::all(
            "SELECT id, url, status, http_status, error_msg, created_at
             FROM indexing_log
             WHERE site_id=? AND status=?
             ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [$siteId, $status, $limit, $offset]
        );
        $total = (int)DB::row(
            "SELECT COUNT(*) c FROM indexing_log WHERE site_id=? AND status=?",
            [$siteId, $status]
        )['c'];
    } else {
        $logs  = DB::all(
            "SELECT id, url, status, http_status, error_msg, created_at
             FROM indexing_log
             WHERE site_id=?
             ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [$siteId, $limit, $offset]
        );
        // COUNT(*) за site_id — використовує idx_site_log prefix
        $total = (int)DB::row(
            "SELECT COUNT(*) c FROM indexing_log WHERE site_id=?",
            [$siteId]
        )['c'];
    }
} else {
    // Всі логи юзера — idx_user_log(user_id, created_at, status, http_status, site_id)
    // JOIN sites потрібен тільки для domain — використовуємо site_id з індексу
    // і окремо підтягуємо domain через IN (уникаємо nested loop join)

    if ($status) {
        $logs = DB::all(
            "SELECT l.id, l.url, l.status, l.http_status, l.error_msg, l.created_at, l.site_id
             FROM indexing_log l
             WHERE l.user_id=? AND l.status=?
             ORDER BY l.created_at DESC LIMIT ? OFFSET ?",
            [$uid, $status, $limit, $offset]
        );
        $total = (int)DB::row(
            "SELECT COUNT(*) c FROM indexing_log WHERE user_id=? AND status=?",
            [$uid, $status]
        )['c'];
    } else {
        $logs = DB::all(
            "SELECT l.id, l.url, l.status, l.http_status, l.error_msg, l.created_at, l.site_id
             FROM indexing_log l
             WHERE l.user_id=?
             ORDER BY l.created_at DESC LIMIT ? OFFSET ?",
            [$uid, $limit, $offset]
        );
        $total = (int)DB::row(
            "SELECT COUNT(*) c FROM indexing_log WHERE user_id=?",
            [$uid]
        )['c'];
    }

    // Підтягуємо domain одним запитом замість JOIN (менше locks)
    $siteIds = array_unique(array_column($logs, 'site_id'));
    $domains = [];
    if ($siteIds) {
        $in     = implode(',', array_fill(0, count($siteIds), '?'));
        $sdRows = DB::all("SELECT id, domain FROM sites WHERE id IN ({$in})", $siteIds);
        foreach ($sdRows as $row) $domains[$row['id']] = $row['domain'];
    }
    foreach ($logs as &$log) {
        $log['domain'] = $domains[$log['site_id']] ?? null;
        unset($log['site_id']);
    }
    unset($log);
}

respondOk('OK', [
    'logs'   => $logs,
    'total'  => $total,
    'limit'  => $limit,
    'offset' => $offset,
]);
