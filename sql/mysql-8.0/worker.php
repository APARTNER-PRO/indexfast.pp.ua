#!/usr/bin/env php
<?php
// ══════════════════════════════════════════════
//  IndexFast — Job Queue Worker
//  Запускається через cron кожну хвилину:
//  * * * * * php /var/www/html/worker/worker.php >> /var/log/indexfast-worker.log 2>&1
//
//  Один запуск = обробка одного batch jobs
//  Захист від паралельного запуску через lock-файл
// ══════════════════════════════════════════════

define('WORKER_START',     microtime(true));
define('WORKER_MAX_TIME',  50);          // секунд (менше за 60с cron інтервал)
define('WORKER_BATCH',     10);          // jobs за один запуск
define('GOOGLE_BATCH',     10);          // паралельних curl запитів до Google за раз
define('JOB_LOCK_TIMEOUT', 300);         // секунд (5 хвилин) — вважаємо job завислим

// ── Bootstrap
$root = dirname(__DIR__) . '/api';
require_once $root . '/config.php';
require_once __DIR__ . '/db_worker.php';  // окремий db без HTTP exit
require_once $root . '/plans.php';

// ── Singleton lock: тільки один воркер одночасно
$lockFile = sys_get_temp_dir() . '/indexfast_worker.lock';
$lock = fopen($lockFile, 'c');
if (!flock($lock, LOCK_EX | LOCK_NB)) {
    log_msg("Worker already running, skipping.");
    exit(0);
}

log_msg("Worker started.");
log_msg("Root path: " . $root);
log_msg("DB: " . DB_HOST . " / " . DB_NAME);

// ── Перевіряємо pending jobs
$pendingCount = DB::row("SELECT COUNT(*) AS cnt FROM jobs WHERE status='pending' AND available_at <= NOW()");
log_msg("Pending jobs: " . ($pendingCount['cnt'] ?? 0));

// ── Відмовляємось від зависших jobs (processing > LOCK_TIMEOUT секунд)
DB::exec(
    "UPDATE jobs SET status='pending', attempts=attempts+1, started_at=NULL
     WHERE status='processing'
       AND started_at < DATE_SUB(NOW(), INTERVAL ? SECOND)
       AND attempts < max_attempts",
    [JOB_LOCK_TIMEOUT]
);
// Фіналізуємо jobs що вичерпали спроби
DB::exec(
    "UPDATE jobs SET status='failed', last_error='Max attempts exceeded'
     WHERE status='processing'
       AND started_at < DATE_SUB(NOW(), INTERVAL ? SECOND)
       AND attempts >= max_attempts",
    [JOB_LOCK_TIMEOUT]
);

// ── Головний цикл
$processed = 0;

while (elapsed() < WORKER_MAX_TIME) {

    // Беремо наступний доступний job (SELECT FOR UPDATE — атомарно)
    $job = DB::pdo()->transaction(function(PDO $pdo) {
        $stmt = $pdo->prepare(
            "SELECT j.*, u.plan
             FROM jobs j
             JOIN users u ON u.id = j.user_id
             WHERE j.status = 'pending'
               AND j.available_at <= NOW()
               AND j.attempts < j.max_attempts
             ORDER BY j.priority ASC, j.available_at ASC
             LIMIT 1
             FOR UPDATE"
        );
        $stmt->execute();
        $job = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$job) return null;

        // Відразу позначаємо як processing (в межах тієї ж транзакції)
        $pdo->prepare(
            "UPDATE jobs SET status='processing', started_at=NOW(), attempts=attempts+1 WHERE id=?"
        )->execute([$job['id']]);

        return $job;
    });

    if (!$job) {
        // Перевіряємо чому немає job
        $anyJob = DB::row("SELECT id, status, available_at, attempts, max_attempts FROM jobs WHERE status='pending' LIMIT 1");
        if ($anyJob) {
            log_msg("Job #{$anyJob['id']} exists but not picked up. available_at={$anyJob['available_at']} attempts={$anyJob['attempts']}/{$anyJob['max_attempts']}");
        }
        log_msg("No pending jobs. Sleeping 5s.");
        sleep(5);
        // Якщо і після сну немає — виходимо
        $check = DB::row("SELECT COUNT(*) c FROM jobs WHERE status='pending' AND available_at<=NOW()");
        if ((int)$check['c'] === 0) break;
        continue;
    }

    log_msg("Processing job #{$job['id']} site_id={$job['site_id']} attempt={$job['attempts']}");

    processJob($job);
    $processed++;
}

log_msg("Worker finished. Processed: {$processed} jobs. Time: " . round(elapsed(), 2) . "s");

// ── Звільняємо lock
flock($lock, LOCK_UN);
fclose($lock);
exit(0);


// ══════════════════════════════════════════════
//  Обробка одного job
// ══════════════════════════════════════════════
function processJob(array $job): void {
    $jobId  = (int)$job['id'];
    $userId = (int)$job['user_id'];
    $siteId = (int)$job['site_id'];
    $plan   = $job['plan'] ?? 'start';

    // ── Отримуємо credentials (site_credentials або sites.service_account)
    $cred = DB::row("SELECT service_account FROM site_credentials WHERE site_id=?", [$siteId]);

    if (!$cred) {
        // Fallback: стара схема — credentials в sites.service_account
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
                // Мігруємо автоматично
                try {
                    DB::exec(
                        "INSERT INTO site_credentials (site_id, service_account)
                         VALUES (?, ?)
                         ON DUPLICATE KEY UPDATE service_account = VALUES(service_account)",
                        [$siteId, $sa['service_account']]
                    );
                    $cred = ['service_account' => $sa['service_account']];
                } catch (Throwable $e) {
                    error_log('[worker] migrate credentials failed: ' . $e->getMessage());
                }
            }
        }
    }

    if (!$cred) {
        failJob($jobId, $userId, 0, 'Немає credentials для сайту');
        return;
    }
    $saJson = base64_decode($cred['service_account']);

    // ── Отримуємо access token (один на весь job)
    $key   = json_decode($saJson, true);
    $token = getAccessToken($key);
    if (!$token) {
        // Retry: помилка отримання токена — не вина юзера
        retryJob($jobId, $userId, 'Не вдалось отримати Google access token', delay: 60);
        return;
    }

    // ── Беремо URL з payload
    $payload = json_decode($job['payload'], true);
    $urls    = $payload['urls'] ?? [];
    if (empty($urls)) {
        failJob($jobId, $userId, 0, 'Порожній payload');
        return;
    }

    // ── Відправляємо URL батчами через паралельний curl
    $sent = $failed = 0;

    foreach (array_chunk($urls, GOOGLE_BATCH) as $batch) {
        if (elapsed() > WORKER_MAX_TIME - 5) {
            // Часу майже немає — перепланувати залишок
            log_msg("Job #{$jobId}: time limit approaching, rescheduling remaining URLs");
            rescheduleRemaining($jobId, $userId, $siteId, array_slice($urls, $sent + $failed), $plan);
            break;
        }

        $results = sendBatch($batch, $token);

        if (!empty($results)) {
            // Перевіряємо чи існує колонка url_hash (schema_v4)
            static $hasUrlHash = null;
            if ($hasUrlHash === null) {
                $hasUrlHash = (bool)(DB::row(
                    "SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
                     WHERE TABLE_SCHEMA = DATABASE()
                       AND TABLE_NAME   = 'indexing_log'
                       AND COLUMN_NAME  = 'url_hash'"
                )['cnt'] ?? 0);
            }

            // Перевіряємо чи є 429 в цьому батчі
            $quotaHit     = false;
            $retryDelay   = 60;
            $quotaUrls    = [];  // URL що отримали 429 — треба відправити пізніше

            foreach ($results as $url => $result) {
                // ── Google 429: Rate limit — НЕ позначаємо як error
                if ($result['quota']) {
                    $quotaHit   = true;
                    $retryDelay = max($retryDelay, (int)($result['retry_after'] ?? 60));
                    $quotaUrls[] = $url;
                    // Лишаємо статус 'pending' — не оновлюємо в БД
                    continue;
                }

                $status  = $result['ok'] ? 'ok' : 'error';
                $code    = $result['code'];
                $errMsg  = $result['error'] ?? null;

                try {
                    if ($hasUrlHash) {
                        DB::exec(
                            "UPDATE indexing_log
                             SET status=?, http_status=?, error_msg=?
                             WHERE job_id=? AND url_hash=SHA2(?,256)",
                            [$status, $code, $errMsg, $jobId, $url]
                        );
                    } else {
                        DB::exec(
                            "UPDATE indexing_log
                             SET status=?, http_status=?, error_msg=?
                             WHERE job_id=? AND url=?",
                            [$status, $code, $errMsg, $jobId, $url]
                        );
                    }
                } catch (Throwable $e) {
                    error_log("[worker] UPDATE indexing_log failed: " . $e->getMessage());
                }

                $result['ok'] ? $sent++ : $failed++;
            }

            // ── Якщо 429 — переносимо залишок URLs в новий job з затримкою
            if ($quotaHit) {
                // Збираємо всі URL що ще не оброблені (quota + ще не відправлені)
                $processedUrls  = array_keys($results);
                $allRemaining   = array_values(array_diff($urls, array_keys(
                    array_filter($results, fn($r) => $r['ok'] || (!$r['ok'] && !$r['quota']))
                )));

                if (!empty($allRemaining)) {
                    log_msg("Job #{$jobId}: Google 429 — rescheduling " . count($allRemaining) . " URLs in {$retryDelay}s");

                    // Новий job з затримкою
                    $newJobId = DB::exec(
                        "INSERT INTO jobs (user_id, site_id, type, payload, status, total, priority, available_at)
                         VALUES (?,?,'index_urls',?,'pending',?,?,DATE_ADD(NOW(), INTERVAL ? SECOND))",
                        [$userId, $siteId, json_encode(['urls' => $allRemaining]),
                         count($allRemaining), Plans::jobPriority($plan), $retryDelay]
                    );

                    // Переприв'язуємо pending логи до нового job
                    if ($hasUrlHash) {
                        $hashPlaceholders = implode(',', array_fill(0, count($allRemaining), 'SHA2(?,256)'));
                        DB::exec(
                            "UPDATE indexing_log SET job_id=? WHERE job_id=? AND status='pending'
                             AND url_hash IN ({$hashPlaceholders})",
                            array_merge([$newJobId, $jobId], $allRemaining)
                        );
                    } else {
                        $placeholders = implode(',', array_fill(0, count($allRemaining), '?'));
                        DB::exec(
                            "UPDATE indexing_log SET job_id=? WHERE job_id=? AND status='pending'
                             AND url IN ({$placeholders})",
                            array_merge([$newJobId, $jobId], $allRemaining)
                        );
                    }

                    // Повертаємо ліміт для непроведених URL
                    Plans::release($userId, count($allRemaining));
                }

                // Завершуємо поточний job як done (що відправили — відправили)
                break;
            }
        }

        // Оновлюємо прогрес job після кожного batch
        DB::exec(
            "UPDATE jobs SET sent=?, failed=? WHERE id=?",
            [$sent, $failed, $jobId]
        );

        // Мікропауза між батчами (не спамимо Google)
        if (count($urls) > GOOGLE_BATCH) usleep(200_000); // 200ms
    }

    // ── Оновлюємо статистику сайту
    if ($sent > 0) {
        DB::exec(
            "UPDATE sites SET indexed_total=indexed_total+?, last_run_at=NOW(), status='active', error_message=NULL WHERE id=?",
            [$sent, $siteId]
        );
    }

    // ── Фіналізуємо job
    $status = ($failed === count($urls)) ? 'failed' : 'done';
    $err    = $status === 'failed' ? "Всі {$failed} URL повернули помилку від Google" : null;

    DB::exec(
        "UPDATE jobs SET status=?, sent=?, failed=?, finished_at=NOW(), last_error=? WHERE id=?",
        [$status, $sent, $failed, $err, $jobId]
    );

    // ── Якщо помилка була зі сторони Google (5xx) — retry
    if ($status === 'failed' && $job['attempts'] < (int)$job['max_attempts']) {
        retryJob($jobId, $userId, $err, delay: 300);
        return;
    }

    log_msg("Job #{$jobId} done: sent={$sent} failed={$failed}");
}


// ══════════════════════════════════════════════
//  Паралельний curl до Google Indexing API
// ══════════════════════════════════════════════
function sendBatch(array $urls, string $token): array {
    $mh      = curl_multi_init();
    $handles = [];

    foreach ($urls as $url) {
        $ch = curl_init('https://indexing.googleapis.com/v3/urlNotifications:publish');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER         => true,   // отримуємо заголовки для Retry-After
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode(['url' => $url, 'type' => 'URL_UPDATED']),
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                "Authorization: Bearer {$token}",
            ],
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_CONNECTTIMEOUT => 5,
        ]);
        curl_multi_add_handle($mh, $ch);
        $handles[$url] = $ch;
    }

    // Виконуємо всі запити паралельно
    do {
        $status = curl_multi_exec($mh, $running);
        if ($running) curl_multi_select($mh, 0.5);
    } while ($running && $status === CURLM_OK);

    // Збираємо результати
    $results = [];
    foreach ($handles as $url => $ch) {
        $raw        = curl_multi_getcontent($ch);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $headers    = substr($raw, 0, $headerSize);
        $body       = substr($raw, $headerSize);
        $code       = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $ok         = $code === 200;
        $err        = null;
        $retryAfter = 60;  // default

        if (!$ok) {
            $resp = json_decode($body, true);
            $err  = $resp['error']['message'] ?? "HTTP {$code}";
            if ($code === 429) {
                // Читаємо Retry-After заголовок якщо є
                if (preg_match('/Retry-After:\s*(\d+)/i', $headers, $m)) {
                    $retryAfter = (int)$m[1];
                }
                log_msg("WARN: Google quota (429) for URL: {$url}, retry-after: {$retryAfter}s");
            }
        }

        $results[$url] = ['ok' => $ok, 'code' => $code, 'error' => $err, 'quota' => ($code === 429), 'retry_after' => $retryAfter];
        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);
    }

    curl_multi_close($mh);
    return $results;
}


// ══════════════════════════════════════════════
//  Google Service Account → Access Token
// ══════════════════════════════════════════════
function getAccessToken(array $key): ?string {
    $now     = time();
    $header  = b64u(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $payload = b64u(json_encode([
        'iss'   => $key['client_email'],
        'scope' => 'https://www.googleapis.com/auth/indexing',
        'aud'   => 'https://oauth2.googleapis.com/token',
        'iat'   => $now,
        'exp'   => $now + 3600,
    ]));
    $sig = '';
    $pk  = openssl_pkey_get_private($key['private_key']);
    if (!$pk) return null;
    openssl_sign("{$header}.{$payload}", $sig, $pk, 'SHA256');
    $jwt = "{$header}.{$payload}." . b64u($sig);

    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $jwt,
        ]),
        CURLOPT_TIMEOUT => 10,
    ]);
    $resp = json_decode(curl_exec($ch), true);
    curl_close($ch);
    return $resp['access_token'] ?? null;
}


// ══════════════════════════════════════════════
//  Хелпери управління jobs
// ══════════════════════════════════════════════
function failJob(int $jobId, int $userId, int $sent, string $error): void {
    DB::exec(
        "UPDATE jobs SET status='failed', sent=?, finished_at=NOW(), last_error=? WHERE id=?",
        [$sent, $error, $jobId]
    );
    // Повертаємо зарезервований ліміт якщо відправки не було
    if ($sent === 0) {
        $job = DB::row("SELECT total FROM jobs WHERE id=?", [$jobId]);
        if ($job) Plans::release($userId, (int)$job['total']);
    }
    log_msg("Job #{$jobId} FAILED: {$error}");
}

function retryJob(int $jobId, int $userId, ?string $error, int $delay = 60): void {
    DB::exec(
        "UPDATE jobs SET status='pending', started_at=NULL,
                         available_at=DATE_ADD(NOW(), INTERVAL ? SECOND),
                         last_error=?
         WHERE id=?",
        [$delay, $error, $jobId]
    );
    log_msg("Job #{$jobId} scheduled for retry in {$delay}s: {$error}");
}

function rescheduleRemaining(int $jobId, int $userId, int $siteId, array $remainingUrls, string $plan): void {
    if (empty($remainingUrls)) return;
    // Створюємо новий job для залишкових URL
    $newJobId = DB::exec(
        "INSERT INTO jobs (user_id, site_id, type, payload, status, total, priority, available_at)
         VALUES (?,?,'index_urls',?,'pending',?,?,NOW())",
        [$userId, $siteId, json_encode(['urls' => $remainingUrls]),
         count($remainingUrls), Plans::jobPriority($plan)]
    );
    // Логи переприв'язуємо до нового job
    $pdo = DB::pdo();
    $ids = implode(',', array_fill(0, count($remainingUrls), '?'));
    $params = array_merge($remainingUrls, [$jobId]);
    DB::exec(
        "UPDATE indexing_log SET job_id=?, status='pending' WHERE url IN ({$ids}) AND job_id=? AND status='pending'",
        array_merge([$newJobId], $remainingUrls, [$jobId])
    );
    log_msg("Rescheduled " . count($remainingUrls) . " URLs to new job #{$newJobId}");
}


// ══════════════════════════════════════════════
//  Утиліти
// ══════════════════════════════════════════════
function elapsed(): float {
    return microtime(true) - WORKER_START;
}

function log_msg(string $msg): void {
    $ts = date('Y-m-d H:i:s');
    echo "[{$ts}] {$msg}\n";
}

function b64u(string $d): string {
    return rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
}

// ── PDO transaction helper (якщо немає в DB class)
if (!method_exists('DB', 'transaction')) {
    // Fallback: додаємо через closure
    DB::pdo()->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}

// Розширюємо DB::pdo() методом transaction якщо його немає
class WorkerPDO {
    public static function transaction(callable $fn) {
        $pdo = DB::pdo();
        $pdo->beginTransaction();
        try {
            $result = $fn($pdo);
            $pdo->commit();
            return $result;
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}

// Патчимо виклик вище
// (у продакшн краще додати transaction() прямо в клас DB)
