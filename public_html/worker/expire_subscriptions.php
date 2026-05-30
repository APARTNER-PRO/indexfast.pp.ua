<?php
// worker/expire_subscriptions.php
// Запуск: php worker/expire_subscriptions.php
// Cron:   5 0 * * * php /home/USER/worker/expire_subscriptions.php
// PHP 7.4+ / MySQL 5.7+

$isCli = PHP_SAPI === 'cli';

// Шлях до public_html/api/config.php
$apiDir = file_exists(dirname(__DIR__) . '/public_html/api/config.php')
    ? dirname(__DIR__) . '/public_html/api'
    : dirname(__DIR__) . '/api';

require_once $apiDir . '/config.php';

// URL захист
if (!$isCli) {
    $key = isset($_GET['token']) ? $_GET['token'] : (isset($_GET['key']) ? $_GET['key'] : '');
    if ($key !== env('WORKER_KEY', '')) {
        http_response_code(403);
        die('Forbidden');
    }
    header('Content-Type: text/plain; charset=UTF-8');
}

require_once $apiDir . '/db.php';
require_once $apiDir . '/helpers.php';
require_once $apiDir . '/plans.php';
require_once $apiDir . '/payment/SubscriptionService.php';

// Захист від паралельного запуску
$lock = sys_get_temp_dir() . '/indexfast_expire.lock';
if (file_exists($lock) && (time() - filemtime($lock)) < 3600) {
    logMsg('Already running, skipping.');
    exit(0);
}
file_put_contents($lock, getmypid());

function logMsg(string $msg): void
{
    $line = '[' . date('Y-m-d H:i:s') . '] ' . $msg . "\n";
    echo $line;
    if (PHP_SAPI !== 'cli') {
        flush();
        if (ob_get_level()) ob_flush();
    }
}

logMsg('=== expire_subscriptions started ===');

try {
    $svc   = new SubscriptionService();
    $count = $svc->expireSubscriptions();
    logMsg('Expired: ' . $count);

    workerReminders(3);
    workerReminders(7);

    logMsg('=== Done ===');
} catch (Exception $e) {
    logMsg('ERROR: ' . $e->getMessage());
    error_log('[expire_subscriptions] ' . $e->getMessage());
} finally {
    @unlink($lock);
}

function workerReminders(int $days): void
{
    $rows = DB::all(
        "SELECT s.plan_id, s.end_at, u.email, u.name
         FROM subscriptions s
         JOIN users u ON u.id = s.user_id
         WHERE s.status = 'paid'
           AND s.end_at IS NOT NULL
           AND DATE(s.end_at) = DATE_ADD(CURDATE(), INTERVAL ? DAY)",
        [$days]
    );

    logMsg('Reminders ' . $days . 'd: ' . count($rows));

    foreach ($rows as $row) {
        try {
            workerSendReminder($row, $days);
        } catch (Exception $e) {
            logMsg('  Email fail: ' . $e->getMessage());
        }
    }
}

function workerSendReminder(array $row, int $days): void
{
    $label  = Plans::label($row['plan_id']);
    $date   = date('d.m.Y', strtotime($row['end_at']));
    $envUrls = explode(',', env('FRONTEND_URL', env('APP_URL', '')));
    $appUrl  = rtrim(trim($envUrls[0]), '/');
    $url    = $appUrl . '/app#pricing';
    $name   = htmlspecialchars($row['name']);

    if ($days === 1) {
        $dayWord = 'день';
    } elseif ($days < 5) {
        $dayWord = 'дні';
    } else {
        $dayWord = 'днів';
    }

    $html  = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>';
    $html .= '<body style="background:#050508;margin:0;padding:20px;font-family:Arial,sans-serif">';
    $html .= '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">';
    $html .= '<table width="520" style="background:#111119;border-radius:16px;border:1px solid rgba(255,255,255,.08);max-width:520px">';
    $html .= '<tr><td style="background:#050508;padding:20px 32px"><span style="font-size:18px;font-weight:800;color:#eeeef6">Index<span style="color:#00ff88">Fast</span></span></td></tr>';
    $html .= '<tr><td style="padding:28px;color:#c8c8d8;font-size:14px;line-height:1.7">';
    $html .= '<p>&#x23F0; Привіт, <strong style="color:#eeeef6">' . $name . '</strong>!</p>';
    $html .= '<p>Підписка <strong style="color:#ffd060">' . htmlspecialchars($label) . '</strong> завершується <strong>' . $date . '</strong> — через <strong>' . $days . ' ' . $dayWord . '</strong>.</p>';
    $html .= '<p style="text-align:center;margin:24px 0">';
    $html .= '<a href="' . htmlspecialchars($url) . '" style="background:#00ff88;color:#050508;padding:12px 24px;border-radius:100px;text-decoration:none;font-weight:700">Поновити &rarr;</a>';
    $html .= '</p>';

    try {
        $unsubUrl = Token::unsubscribeUrl((int)$row['id']);
    } catch (Throwable $e) {
        $unsubUrl = $appUrl . '/app/profile';
    }
    $html .= '<p style="color:#555570;font-size:11px;text-align:center;margin-top:20px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px">';
    $html .= '<a href="' . htmlspecialchars($unsubUrl) . '" style="color:#555570;text-decoration:underline">відписатись від новин сервісу</a>';
    $html .= '</p></td></tr></table></td></tr></table></body></html>';

    Mailer::send($row['email'], '⏰ Підписка ' . $label . ' завершується ' . $date, $html);
    logMsg('  Sent to ' . $row['email']);
}
