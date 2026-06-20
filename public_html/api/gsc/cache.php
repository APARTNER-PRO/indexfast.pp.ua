<?php
require_once dirname(dirname(__DIR__)) . '/api/db.php';

function gsc_metrics_cache_init() {
    DB::exec("
        CREATE TABLE IF NOT EXISTS `gsc_metrics_cache` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `site_id` INT NOT NULL,
            `type` VARCHAR(32) NOT NULL DEFAULT 'summary',
            `period_days` INT NOT NULL,
            `date` DATE NOT NULL,
            `metrics_json` JSON NOT NULL,
            `updated_at` DATETIME NOT NULL,
            UNIQUE KEY `idx_cache_unique` (`user_id`, `site_id`, `type`, `period_days`, `date`),
            KEY `idx_cache_updated` (`updated_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
}

function gscGetCachedMetrics(int $uid, array $siteIds, int $days, string $type = 'summary'): array {
    if (!$siteIds) return [];
    
    // Auto-init table just in case
    static $initDone = false;
    if (!$initDone) {
        gsc_metrics_cache_init();
        $initDone = true;
    }

    $today = date('Y-m-d');
    $placeholders = implode(',', array_fill(0, count($siteIds), '?'));
    
    // Враховуємо TTL 6 годин
    $params = array_merge([$uid, $type, $days, $today], $siteIds);
    $rows = DB::all("
        SELECT site_id, metrics_json 
        FROM gsc_metrics_cache 
        WHERE user_id = ? 
          AND type = ?
          AND period_days = ? 
          AND date = ? 
          AND updated_at > NOW() - INTERVAL 6 HOUR
          AND site_id IN ($placeholders)
    ", $params);

    $cached = [];
    foreach ($rows as $row) {
        $cached[(int)$row['site_id']] = json_decode($row['metrics_json'], true);
    }
    
    return $cached;
}

function gscSetCachedMetrics(int $uid, int $siteId, int $days, array $metrics, string $type = 'summary'): void {
    $today = date('Y-m-d');
    $json = json_encode($metrics, JSON_UNESCAPED_UNICODE);
    
    DB::exec("
        INSERT INTO gsc_metrics_cache (user_id, site_id, type, period_days, date, metrics_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
            metrics_json = VALUES(metrics_json),
            updated_at = NOW()
    ", [$uid, $siteId, $type, $days, $today, $json]);
}
