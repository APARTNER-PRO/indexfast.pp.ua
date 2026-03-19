#!/usr/bin/env php
<?php
// ══════════════════════════════════════════════
//  Health Check — перевірка стану черги
//  Якщо є pending jobs > 15 хвилин → алерт
// ══════════════════════════════════════════════
$root = dirname(__DIR__) . '/api';
require_once $root . '/config.php';
require_once $root . '/db.php';

$ts = date('Y-m-d H:i:s');

// Jobs що висять в pending більше 15 хвилин
$stale = DB::row(
    "SELECT COUNT(*) c FROM jobs
     WHERE status='pending' AND available_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE)"
);
$staleCount = (int)$stale['c'];

// Jobs що processing більше 10 хвилин (воркер можливо завис)
$stuck = DB::row(
    "SELECT COUNT(*) c FROM jobs
     WHERE status='processing' AND started_at < DATE_SUB(NOW(), INTERVAL 10 MINUTE)"
);
$stuckCount = (int)$stuck['c'];

if ($staleCount > 0 || $stuckCount > 0) {
    $msg = "IndexFast Worker Alert [{$ts}]: stale_pending={$staleCount} stuck_processing={$stuckCount}";
    echo "{$msg}\n";

    // Telegram алерт (опціонально)
    $tgToken = env('TELEGRAM_BOT_TOKEN', '');
    $tgChat  = env('TELEGRAM_CHAT_ID', '');
    if ($tgToken && $tgChat) {
        $url = "https://api.telegram.org/bot{$tgToken}/sendMessage";
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode(['chat_id' => $tgChat, 'text' => "⚠️ {$msg}"]),
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_TIMEOUT        => 5,
        ]);
        curl_exec($ch);
        curl_close($ch);
    }
} else {
    $pending = (int)DB::row("SELECT COUNT(*) c FROM jobs WHERE status='pending'")['c'];
    echo "[{$ts}] Queue OK | pending={$pending}\n";
}
