<?php
// ══════════════════════════════════════════════
//  GET /api/gsc/redirect.php
//  Редірект на Google OAuth для доступу до Search Console
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/middleware.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';

requireMethod('GET');
$uid = (int)requireAuth()['sub'];

if (!GOOGLE_CLIENT_ID) respond(503, 'Google OAuth не налаштовано');

$state = bin2hex(random_bytes(16));
session_start();
$_SESSION['gsc_state'] = $state;
$_SESSION['gsc_uid']   = $uid;

$params = http_build_query([
    'client_id'     => GOOGLE_CLIENT_ID,
    'redirect_uri'  => APP_URL . '/api/gsc/callback.php',
    'response_type' => 'code',
    'scope'         => 'openid email https://www.googleapis.com/auth/webmasters.readonly',
    'state'         => $state,
    'access_type'   => 'offline',
    'prompt'        => 'consent select_account',
]);

header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . $params);
exit;
