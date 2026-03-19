<?php
// ══════════════════════════════════════════════
//  PATCH /api/sites/toggle.php
//  body: { site_id }
//  Перемикає статус active ↔ paused
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';

requireMethod('PATCH');
$uid    = (int)requireAuth()['sub'];
$body   = getBody();
$siteId = (int)($body['site_id'] ?? 0);
if (!$siteId) respond(422, 'site_id обов\'язковий');

$site = DB::row(
    "SELECT id, domain, status FROM sites WHERE id=? AND user_id=?",
    [$siteId, $uid]
);
if (!$site) respond(404, 'Сайт не знайдено');

// error → active (розблокування після помилки теж через toggle)
$newStatus = ($site['status'] === 'active') ? 'paused' : 'active';

DB::exec(
    "UPDATE sites SET status=?, error_message=NULL WHERE id=?",
    [$newStatus, $siteId]
);

respondOk(
    $newStatus === 'paused' ? "Сайт {$site['domain']} призупинено" : "Сайт {$site['domain']} активовано",
    ['status' => $newStatus]
);
