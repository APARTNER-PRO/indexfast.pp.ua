<?php
// DELETE /api/sites/delete.php  body: {site_id}
require_once dirname(__DIR__) . '/middleware.php';
require_once dirname(__DIR__) . '/db.php';
requireMethod('DELETE');
$uid  = requireAuth()['sub'];
$body = getBody();
$id   = (int)($body['site_id'] ?? 0);
if (!$id) respond(422, 'site_id обов\'язковий');
$site = DB::row("SELECT domain FROM sites WHERE id=? AND user_id=?", [$id, $uid]);
if (!$site) respond(404, 'Сайт не знайдено');
DB::exec("DELETE FROM sites WHERE id=? AND user_id=?", [$id, $uid]);
respondOk("Сайт {$site['domain']} видалено");
