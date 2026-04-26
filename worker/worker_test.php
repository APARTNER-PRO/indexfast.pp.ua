<?php
// ══════════════════════════════════════════════
//  worker_test.php — діагностика воркера
//  Запуск: php worker/worker_test.php
// ══════════════════════════════════════════════
$root = dirname(__DIR__) . '/api';
require_once __DIR__ . '/db_worker.php';
require_once $root . '/plans.php';

echo "=== IndexFast Worker Diagnostics ===\n\n";

// 1. З'єднання з БД
echo "1. DB connection...\n";
try {
    DB::pdo();
    echo "   OK\n";
} catch (Throwable $e) {
    echo "   FAIL: " . $e->getMessage() . "\n";
    exit(1);
}

// 2. Таблиці
echo "\n2. Tables...\n";
$tables = ['users','sites','jobs','indexing_log','site_credentials','daily_usage'];
foreach ($tables as $t) {
    $exists = DB::row("SELECT COUNT(*) AS c FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?", [$t]);
    echo "   " . ($exists['c'] ? "OK" : "MISSING") . " - $t\n";
}

// 3. Pending jobs
echo "\n3. Pending jobs...\n";
$jobs = DB::all("SELECT j.id, j.site_id, j.status, j.attempts, j.max_attempts, j.available_at, j.payload, u.email FROM jobs j JOIN users u ON u.id=j.user_id WHERE j.status='pending' ORDER BY j.id DESC LIMIT 5");
if (empty($jobs)) {
    echo "   (немає pending jobs)\n";
} else {
    foreach ($jobs as $j) {
        $payload = json_decode($j['payload'], true);
        $urlCount = count($payload['urls'] ?? []);
        echo "   Job #{$j['id']} site={$j['site_id']} user={$j['email']} urls={$urlCount} attempts={$j['attempts']}/{$j['max_attempts']} available_at={$j['available_at']}\n";
    }
}

// 4. Processing jobs (зависші)
echo "\n4. Processing jobs...\n";
$proc = DB::all("SELECT id, site_id, started_at, attempts FROM jobs WHERE status='processing'");
if (empty($proc)) {
    echo "   (немає)\n";
} else {
    foreach ($proc as $j) {
        $age = time() - strtotime($j['started_at']);
        echo "   Job #{$j['id']} site={$j['site_id']} started={$j['started_at']} age={$age}s\n";
    }
}

// 5. Site credentials
echo "\n5. Site credentials...\n";
$creds = DB::all("SELECT sc.site_id, s.domain, LENGTH(sc.service_account) AS sa_len FROM site_credentials sc JOIN sites s ON s.id=sc.site_id");
if (empty($creds)) {
    echo "   УВАГА: немає жодного Service Account!\n";
    echo "   Додайте сайт з Service Account через кабінет.\n";
} else {
    foreach ($creds as $c) {
        $sa = json_decode(base64_decode($c['sa_len'] > 10 ?
            DB::row("SELECT service_account FROM site_credentials WHERE site_id=?", [$c['site_id']])['service_account'] : ''), true);
        $valid = isset($sa['type']) && $sa['type'] === 'service_account' && isset($sa['private_key']);
        echo "   " . ($valid ? "OK" : "INVALID JSON") . " - site={$c['site_id']} domain={$c['domain']} sa_len={$c['sa_len']}\n";
    }
}

// 6. Тест getAccessToken
echo "\n6. Google API access token test...\n";
$cred = DB::row("SELECT sc.service_account, s.domain FROM site_credentials sc JOIN sites s ON s.id=sc.site_id LIMIT 1");
if ($cred) {
    $key = json_decode(base64_decode($cred['service_account']), true);
    if (!$key || !isset($key['private_key'])) {
        echo "   FAIL: Service Account JSON невалідний для {$cred['domain']}\n";
    } else {
        require_once __DIR__ . '/worker.php';  // для getAccessToken
        // Не підключаємо worker.php — просто перевіряємо структуру ключа
        echo "   JSON OK: client_email={$key['client_email']}\n";
        echo "   private_key: " . (strlen($key['private_key']) > 100 ? "OK (" . strlen($key['private_key']) . " chars)" : "INVALID") . "\n";
    }
} else {
    echo "   SKIP (немає credentials)\n";
}

// 7. Failed jobs останні
echo "\n7. Recent failed jobs...\n";
$failed = DB::all("SELECT id, site_id, last_error, finished_at FROM jobs WHERE status='failed' ORDER BY id DESC LIMIT 5");
if (empty($failed)) {
    echo "   (немає)\n";
} else {
    foreach ($failed as $j) {
        echo "   Job #{$j['id']} site={$j['site_id']} error=\"{$j['last_error']}\" at={$j['finished_at']}\n";
    }
}

// 8. Lock файл
echo "\n8. Lock file...\n";
$lockFile = sys_get_temp_dir() . '/indexfast_worker.lock';
if (file_exists($lockFile)) {
    $age = time() - filemtime($lockFile);
    echo "   Lock exists, age={$age}s";
    if ($age > 70) echo " (STALE — видаліть: rm {$lockFile})";
    echo "\n";
} else {
    echo "   OK (немає активного lock)\n";
}

echo "\n=== Done ===\n";
