<?php
// ══════════════════════════════════════════════
//  GET /api/indexing/status.php
//  ?job_id=123          → статус конкретного job
//  ?site_id=5           → останній job для сайту
//  ?site_id=5&all=1     → всі jobs для сайту (остання 20)
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('GET');
$uid = (int)requireAuth()['sub'];

$jobId  = (int)($_GET['job_id']  ?? 0);
$siteId = (int)($_GET['site_id'] ?? 0);
$all    = (bool)($_GET['all']    ?? false);

// ── За конкретним job_id
if ($jobId) {
    $job = DB::row(
        "SELECT j.*, s.domain
         FROM jobs j JOIN sites s ON s.id = j.site_id
         WHERE j.id=? AND j.user_id=?",
        [$jobId, $uid]
    );
    if (!$job) respond(404, 'Job не знайдено');

    respondOk('OK', ['job' => formatJob($job)]);
}

// ── За site_id
if ($siteId) {
    // Перевіряємо доступ
    if (!DB::row("SELECT id FROM sites WHERE id=? AND user_id=?", [$siteId, $uid])) {
        respond(404, 'Сайт не знайдено');
    }

    if ($all) {
        $jobs = DB::all(
            "SELECT j.*, s.domain FROM jobs j JOIN sites s ON s.id=j.site_id
             WHERE j.site_id=? AND j.user_id=? ORDER BY j.created_at DESC LIMIT 20",
            [$siteId, $uid]
        );
        respondOk('OK', ['jobs' => array_map('formatJob', $jobs)]);
    }

    // Останній job
    $job = DB::row(
        "SELECT j.*, s.domain FROM jobs j JOIN sites s ON s.id=j.site_id
         WHERE j.site_id=? AND j.user_id=? ORDER BY j.created_at DESC LIMIT 1",
        [$siteId, $uid]
    );
    if (!$job) respond(404, 'Немає завдань для цього сайту');

    respondOk('OK', ['job' => formatJob($job)]);
}

respond(422, 'Потрібен job_id або site_id');

function formatJob(array $j): array {
    $total   = (int)$j['total'];
    $sent    = (int)$j['sent'];
    $failed  = (int)$j['failed'];
    $done    = $sent + $failed;
    $pct     = $total > 0 ? round($done / $total * 100) : 0;

    return [
        'id'          => (int)$j['id'],
        'site_id'     => (int)$j['site_id'],
        'domain'      => $j['domain'] ?? null,
        'status'      => $j['status'],
        'total'       => $total,
        'sent'        => $sent,
        'failed'      => $failed,
        'progress'    => $pct,              // 0-100
        'attempts'    => (int)$j['attempts'],
        'last_error'  => $j['last_error'],
        'created_at'  => $j['created_at'],
        'started_at'  => $j['started_at'],
        'finished_at' => $j['finished_at'],
        'duration_s'  => $j['started_at'] && $j['finished_at']
            ? (int)(strtotime($j['finished_at']) - strtotime($j['started_at']))
            : null,
    ];
}
