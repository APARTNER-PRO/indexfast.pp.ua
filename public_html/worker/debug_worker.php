#!/usr/bin/env php
<?php

define('START', microtime(true));

// ── Bootstrap
$root = dirname(__DIR__) . '/api';
require_once $root . '/config.php';
require_once __DIR__ . '/db_worker.php';
require_once $root . '/plans.php';

log_msg("=== DEBUG WORKER START ===");

// ── Отримуємо всі pending jobs
$jobs = DB::all("
    SELECT j.*, u.plan
    FROM jobs j
    JOIN users u ON u.id = j.user_id
    WHERE j.status='pending'
      AND j.available_at <= NOW()
      AND j.attempts < j.max_attempts
    ORDER BY j.priority ASC, j.available_at ASC
");

log_msg("Found jobs: " . count($jobs));

if (empty($jobs)) {
    log_msg("No jobs найдено.");
    exit;
}

// ── Обробка всіх job
foreach ($jobs as $job) {
    log_msg("");
    log_msg("========== JOB #{$job['id']} ==========");
    processDebugJob($job);
}

log_msg("");
log_msg("=== DONE in " . round(elapsed(), 2) . "s ===");


// ═══════════════════════════════════════
// DEBUG JOB PROCESS
// ═══════════════════════════════════════
function processDebugJob(array $job): void {

    $jobId  = (int)$job['id'];
    $siteId = (int)$job['site_id'];
    $userId = (int)$job['user_id'];

    log_msg("Step 1: Mark job as processing");

    DB::exec(
        "UPDATE jobs SET status='processing', started_at=NOW(), attempts=attempts+1 WHERE id=?",
        [$jobId]
    );

    // ── Credentials
    log_msg("Step 2: Load credentials");

    $cred = DB::row("SELECT service_account FROM site_credentials WHERE site_id=?", [$siteId]);

    if (!$cred) {
        log_msg("ERROR: no credentials");
        fail($jobId, "No credentials");
        return;
    }

    $saJson = base64_decode($cred['service_account']);
    $key    = json_decode($saJson, true);

    log_msg("client_email: " . ($key['client_email'] ?? 'NULL'));
    log_msg("private_key length: " . strlen($key['private_key'] ?? ''));

    log_msg("OK: credentials loaded");

    // ── Token
    log_msg("Step 3: Get Google token");

    $token = getAccessToken($key);

    if (!$token) {
        log_msg("ERROR: token failed");
        retry($jobId, "Token error");
        return;
    }

    log_msg("OK: token received");

    // ── Payload
    log_msg("Step 4: Parse payload");

    $payload = json_decode($job['payload'], true);
    $urls    = $payload['urls'] ?? [];

    log_msg("URLs count: " . count($urls));

    if (empty($urls)) {
        fail($jobId, "Empty payload");
        return;
    }

    // ── Sending
    log_msg("Step 5: Sending to Google");

    $results = sendBatchDebug($urls, $token);

    $sent = 0;
    $failed = 0;

    foreach ($results as $url => $res) {
        if ($res['ok']) {
            log_msg("[OK] {$url}");
            $sent++;
        } else {
            log_msg("[ERR {$res['code']}] {$url} → {$res['error']}");
            $failed++;
        }
    }

    // ── Finish
    log_msg("Step 6: Finish job");

    $status = ($failed === count($urls)) ? 'failed' : 'done';

    DB::exec(
        "UPDATE jobs SET status=?, sent=?, failed=?, finished_at=NOW() WHERE id=?",
        [$status, $sent, $failed, $jobId]
    );

    log_msg("DONE: sent={$sent}, failed={$failed}");
}


// ═══════════════════════════════════════
// CURL DEBUG (Google Indexing)
// ═══════════════════════════════════════
function sendBatchDebug(array $urls, string $token): array {

    $results = [];

    foreach ($urls as $url) {

        log_msg("→ Sending: {$url}");

        $ch = curl_init('https://indexing.googleapis.com/v3/urlNotifications:publish');

        $cacert = __DIR__ . '/cacert.pem';

        $opts = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'url' => $url,
                'type' => 'URL_UPDATED'
            ]),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                "Authorization: Bearer {$token}",
            ],
        ];

        if (file_exists($cacert)) {
            log_msg("→ SSL: using cacert.pem");
            $opts[CURLOPT_CAINFO] = $cacert;
        } else {
            log_msg("⚠ SSL disabled (DEV)");
            $opts[CURLOPT_SSL_VERIFYPEER] = false;
            $opts[CURLOPT_SSL_VERIFYHOST] = false;
        }

        curl_setopt_array($ch, $opts);

        $body = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($body === false) {
            log_msg("❌ CURL ERROR: " . curl_error($ch));
        }

        curl_close($ch);

        $ok = $code === 200;
        $err = null;

        if (!$ok) {
            $resp = json_decode($body, true);
            $err = $resp['error']['message'] ?? "HTTP {$code}";
        }

        $results[$url] = [
            'ok' => $ok,
            'code' => $code,
            'error' => $err
        ];
    }

    return $results;
}


// ═══════════════════════════════════════
// OAuth TOKEN
// ═══════════════════════════════════════
function getAccessToken(array $key): ?string {

    log_msg("→ OAuth: preparing JWT");

    if (isset($key['private_key'])) {
        $key['private_key'] = str_replace('\n', "\n", $key['private_key']);
    }

    if (empty($key['client_email']) || empty($key['private_key'])) {
        log_msg("ERROR: invalid service account");
        return null;
    }

    $now = time();

    $header  = b64(json_encode(['alg'=>'RS256','typ'=>'JWT']));
    $payload = b64(json_encode([
        'iss'   => $key['client_email'],
        'scope' => 'https://www.googleapis.com/auth/indexing',
        'aud'   => 'https://oauth2.googleapis.com/token',
        'iat'   => $now,
        'exp'   => $now + 3600
    ]));

    log_msg("→ OAuth: init OpenSSL");

    $pk = openssl_pkey_get_private($key['private_key']);

    if (!$pk) {
        log_msg("❌ OpenSSL ERROR");
        return null;
    }

    log_msg("→ OAuth: signing");

    openssl_sign("$header.$payload", $sig, $pk, 'SHA256');

    $jwt = "$header.$payload." . b64($sig);

    log_msg("→ OAuth: request");

    $ch = curl_init('https://oauth2.googleapis.com/token');

    $cacert = __DIR__ . '/cacert.pem';

    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $jwt
        ]),
        CURLOPT_TIMEOUT => 15,
    ];

    if (file_exists($cacert)) {
        log_msg("→ SSL: using cacert.pem");
        $opts[CURLOPT_CAINFO] = $cacert;
    } else {
        log_msg("⚠ SSL disabled (DEV)");
        $opts[CURLOPT_SSL_VERIFYPEER] = false;
        $opts[CURLOPT_SSL_VERIFYHOST] = false;
    }

    curl_setopt_array($ch, $opts);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($response === false) {
        log_msg("❌ CURL ERROR: " . curl_error($ch));
        curl_close($ch);
        return null;
    }

    curl_close($ch);

    log_msg("→ OAuth HTTP: {$httpCode}");
    log_msg("→ OAuth response: " . $response);

    $resp = json_decode($response, true);

    if (!isset($resp['access_token'])) {
        log_msg("❌ OAuth FAILED");
        return null;
    }

    log_msg("✔ OAuth SUCCESS");

    return $resp['access_token'];
}


// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════
function fail($jobId, $msg) {
    DB::exec("UPDATE jobs SET status='failed', last_error=? WHERE id=?", [$msg, $jobId]);
    log_msg("FAILED: {$msg}");
}

function retry($jobId, $msg) {
    DB::exec("UPDATE jobs SET status='pending', last_error=? WHERE id=?", [$msg, $jobId]);
    log_msg("RETRY: {$msg}");
}

function log_msg($msg) {
    echo "[" . date('H:i:s') . "] {$msg}\n";
}

function elapsed() {
    return microtime(true) - START;
}

function b64($d) {
    return rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
}