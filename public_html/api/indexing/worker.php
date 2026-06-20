<?php
// ══════════════════════════════════════════════
//  GET /api/indexing/worker.php?key=...
//  Обробляє чергу завдань на індексацію через HTTP
// ══════════════════════════════════════════════

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/plans.php';

// ── Перевірка доступу
$key = $_GET['key'] ?? '';
if ($key !== WORKER_KEY && !DEBUG) {
    http_response_code(403);
    die("Access Denied. Invalid or missing worker key.");
}

// ── Налаштування
define('WORKER_START',     microtime(true));
define('WORKER_MAX_TIME',  45);          // секунд (менше ніж таймаут сервера)
define('WORKER_BATCH',     5);           // jobs за один запуск через HTTP
define('GOOGLE_BATCH',     10);          // паралельних запитів до Google
define('JOB_LOCK_TIMEOUT', 300);         // 5 хвилин

set_time_limit(60);
ignore_user_abort(true); // Продовжуємо навіть якщо юзер закрив вкладку

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-cache');

echo "IndexFast HTTP Worker Started\n";
echo "---------------------------\n";

// ── Singleton lock
$lockFile = sys_get_temp_dir() . '/indexfast_http_worker.lock';
$lock = fopen($lockFile, 'c');
if (!flock($lock, LOCK_EX | LOCK_NB)) {
    die("Another worker is already running. Skipping.\n");
}

// ── Очистка зависших завдань
DB::exec(
    "UPDATE jobs SET status='pending', attempts=attempts+1, started_at=NULL
     WHERE status='processing'
       AND started_at < DATE_SUB(NOW(), INTERVAL ? SECOND)
       AND attempts < 3",
    [JOB_LOCK_TIMEOUT]
);

$processed = 0;
while ((microtime(true) - WORKER_START) < WORKER_MAX_TIME && $processed < WORKER_BATCH) {
    
    $job = DB::transaction(function($pdo) {
        $stmt = $pdo->prepare(
            "SELECT j.*, u.plan FROM jobs j
             JOIN users u ON u.id = j.user_id
             WHERE j.status = 'pending' AND j.available_at <= NOW() AND j.attempts < 3
             ORDER BY j.priority ASC, j.available_at ASC LIMIT 1 FOR UPDATE"
        );
        $stmt->execute();
        $job = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$job) return null;

        $pdo->prepare("UPDATE jobs SET status='processing', started_at=NOW(), attempts=attempts+1 WHERE id=?")
            ->execute([$job['id']]);
        return $job;
    });

    if (!$job) {
        echo "No pending jobs. Finishing.\n";
        break;
    }

    echo "Processing Job #{$job['id']} (Site: {$job['site_id']})...\n";
    processOneJob($job);
    $processed++;
}

echo "---------------------------\n";
echo "Finished. Processed: {$processed} jobs. Time: " . round(microtime(true) - WORKER_START, 2) . "s\n";

flock($lock, LOCK_UN);
fclose($lock);

// ── Функція обробки одного завдання (спрощена версія з worker.php)
function processOneJob(array $job) {
    $jobId  = (int)$job['id'];
    $userId = (int)$job['user_id'];
    $siteId = (int)$job['site_id'];
    
    // Credentials
    $cred = DB::row("SELECT service_account FROM site_credentials WHERE site_id=?", [$siteId]);
    if (!$cred) {
        DB::exec("UPDATE jobs SET status='failed', last_error='No credentials' WHERE id=?", [$jobId]);
        echo "   Error: No credentials for site\n";
        return;
    }

    $saJson = base64_decode($cred['service_account']);
    $key    = json_decode($saJson, true);
    $token  = getGoogleToken($key);
    
    if (!$token) {
        DB::exec("UPDATE jobs SET status='pending', started_at=NULL, available_at=DATE_ADD(NOW(), INTERVAL 1 MINUTE) WHERE id=?", [$jobId]);
        echo "   Error: Failed to get Google Token. Postponed.\n";
        return;
    }

    $payload = json_decode($job['payload'], true);
    $urls    = $payload['urls'] ?? [];
    
    $sent = 0; $failed = 0;
    foreach (array_chunk($urls, GOOGLE_BATCH) as $batch) {
        $results = sendToGoogle($batch, $token);
        foreach ($results as $url => $res) {
            $status = $res['ok'] ? 'ok' : 'error';
            DB::exec("UPDATE indexing_log SET status=?, http_status=?, error_msg=? WHERE job_id=? AND url=?", 
                     [$status, $res['code'], $res['error'], $jobId, $url]);
            $res['ok'] ? $sent++ : $failed++;
        }
        DB::exec("UPDATE jobs SET sent=?, failed=? WHERE id=?", [$sent, $failed, $jobId]);
        usleep(100000); // 100ms pause
    }

    $status = ($failed === count($urls)) ? 'failed' : 'done';
    DB::exec("UPDATE jobs SET status=?, finished_at=NOW() WHERE id=?", [$status, $jobId]);
    if ($sent > 0) {
        DB::exec("UPDATE sites SET indexed_total=indexed_total+?, last_run_at=NOW() WHERE id=?", [$sent, $siteId]);
    }
    echo "   Done: Sent: {$sent}, Failed: {$failed}\n";

    // ── Відправка в IndexNow паралельно
    if (defined('INDEXNOW_ENABLED') && INDEXNOW_ENABLED) {
        $site = DB::row("SELECT domain, indexnow_key, indexnow_enabled FROM sites WHERE id=?", [$siteId]);
        if ($site && !empty($site['indexnow_enabled']) && !empty($site['indexnow_key'])) {
            $inRes = sendToIndexNow($urls, $site['domain'], $site['indexnow_key']);
            if ($inRes['ok']) {
                echo "   IndexNow: Sent {$inRes['count']} URLs (Code: {$inRes['code']})\n";
            } else {
                echo "   IndexNow: Failed (Code: {$inRes['code']})\n";
            }
        }
    }
}

function getGoogleToken(array $key) {
    $now = time();
    $b64 = function($d) { return rtrim(strtr(base64_encode($d), '+/', '-_'), '='); };
    $header = $b64(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $payload = $b64(json_encode([
        'iss' => $key['client_email'], 'scope' => 'https://www.googleapis.com/auth/indexing',
        'aud' => 'https://oauth2.googleapis.com/token', 'iat' => $now, 'exp' => $now + 3600
    ]));
    $sig = '';
    openssl_sign("$header.$payload", $sig, openssl_pkey_get_private($key['private_key']), 'SHA256');
    $jwt = "$header.$payload." . $b64($sig);

    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion' => $jwt]),
        CURLOPT_TIMEOUT => 10
    ]);
    $resp = json_decode(curl_exec($ch), true);
    return $resp['access_token'] ?? null;
}

function sendToGoogle(array $urls, string $token) {
    $mh = curl_multi_init();
    $handles = [];
    foreach ($urls as $url) {
        $ch = curl_init('https://indexing.googleapis.com/v3/urlNotifications:publish');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode(['url' => $url, 'type' => 'URL_UPDATED']),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json', "Authorization: Bearer {$token}"],
            CURLOPT_TIMEOUT => 15
        ]);
        curl_multi_add_handle($mh, $ch);
        $handles[$url] = $ch;
    }
    do { curl_multi_exec($mh, $running); } while ($running);
    $results = [];
    foreach ($handles as $url => $ch) {
        $body = curl_multi_getcontent($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $resp = json_decode($body, true);
        $results[$url] = ['ok' => $code === 200, 'code' => $code, 'error' => $resp['error']['message'] ?? null];
        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);
    }
    curl_multi_close($mh);
    return $results;
}

function sendToIndexNow(array $urls, string $host, string $key): array {
    if (empty($urls)) return ['ok' => false, 'code' => 0, 'count' => 0];
    
    // Можна відправляти до 10,000 URL за раз
    $payload = [
        'host' => $host,
        'key'  => $key,
        'keyLocation' => "https://{$host}/{$key}.txt",
        'urlList' => array_values($urls) // IndexNow очікує звичайний масив
    ];

    $ch = curl_init('https://api.indexnow.org/indexnow');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json; charset=utf-8'],
        CURLOPT_TIMEOUT => 15
    ]);

    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['ok' => in_array($code, [200, 202]), 'code' => $code, 'count' => count($urls)];
}
