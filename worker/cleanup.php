#!/usr/bin/env php
<?php
// ══════════════════════════════════════════════
//  Cleanup — очищення старих даних
//  Запускається cron раз на добу
// ══════════════════════════════════════════════
$root = dirname(__DIR__) . '/api';
require_once $root . '/config.php';
require_once $root . '/db.php';

$ts = date('Y-m-d H:i:s');
echo "[{$ts}] Cleanup started\n";

// ── Видаляємо done/failed jobs старіші 30 днів
$deleted = DB::exec(
    "DELETE FROM jobs WHERE status IN ('done','failed','cancelled')
     AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)"
);
echo "[{$ts}] Deleted old jobs: {$deleted}\n";

// ── Видаляємо indexing_log старіші 90 днів
$deleted = DB::exec(
    "DELETE FROM indexing_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)"
);
echo "[{$ts}] Deleted old logs: {$deleted}\n";

// ── Видаляємо daily_usage старіші 365 днів
$deleted = DB::exec(
    "DELETE FROM daily_usage WHERE usage_date < DATE_SUB(CURDATE(), INTERVAL 365 DAY)"
);
echo "[{$ts}] Deleted old usage: {$deleted}\n";

echo "[{$ts}] Cleanup done\n";
