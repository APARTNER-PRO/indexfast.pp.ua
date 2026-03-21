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

// Ініціалізуємо змінні (захист від undefined variable якщо try кидає виняток)
$logs   = [];
$total  = 0;

try {
$siteId = (int)($_GET['site_id'] ?? 0);
$limit  = min((int)($_GET['limit']  ?? 50), 200);
$offset = max((int)($_GET['offset'] ?? 0), 0);
$status   = $_GET['status']    ?? '';
$dateFrom = $_GET['date_from'] ?? '';
$dateTo   = $_GET['date_to']   ?? '';

// Валідація status
$allowedStatus = ['ok', 'error', 'pending', ''];
if (!in_array($status, $allowedStatus, true)) $status = '';

// Валідація дат (YYYY-MM-DD)
$dateRegex = '/^\d{4}-\d{2}-\d{2}$/';
if ($dateFrom && !preg_match($dateRegex, $dateFrom)) $dateFrom = '';
if ($dateTo   && !preg_match($dateRegex, $dateTo))   $dateTo   = '';

// ── Будуємо динамічний WHERE з усіма фільтрами
$where  = [];
$params = [];

if ($siteId) {
    if (!DB::row("SELECT id FROM sites WHERE id=? AND user_id=?", [$siteId, $uid]))
        respond(404, 'Сайт не знайдено');
    $where[]  = "site_id=?";
    $params[] = $siteId;
} else {
    $where[]  = "user_id=?";
    $params[] = $uid;
}

if ($status)   { $where[] = "status=?";                 $params[] = $status;         }
if ($dateFrom) { $where[] = "DATE(created_at) >= ?";    $params[] = $dateFrom;       }
if ($dateTo)   { $where[] = "DATE(created_at) <= ?";    $params[] = $dateTo;         }

$whereSQL = implode(' AND ', $where);

// Поля — для запиту з siteId не потрібен site_id, для загального — потрібен
$fields = $siteId
    ? "id, url, status, http_status, error_msg, created_at"
    : "id, url, status, http_status, error_msg, created_at, site_id";

$logs  = DB::all(
    "SELECT {$fields} FROM indexing_log
     WHERE {$whereSQL}
     ORDER BY created_at DESC LIMIT ? OFFSET ?",
    array_merge($params, [$limit, $offset])
);
$total = (int)DB::row(
    "SELECT COUNT(*) c FROM indexing_log WHERE {$whereSQL}",
    $params
)['c'];

if (!$siteId) {

    // Підтягуємо domain одним запитом
    $siteIds = array_values(array_unique(array_filter(array_column($logs, 'site_id'))));
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

} catch (Throwable $e) {
    error_log('[logs.php] Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    respond(500, 'Помилка запиту логів: ' . (DEBUG ? $e->getMessage() : 'внутрішня помилка сервера'));
}

respondOk('OK', [
    'logs'   => $logs,
    'total'  => $total,
    'limit'  => $limit,
    'offset' => $offset,
]);
