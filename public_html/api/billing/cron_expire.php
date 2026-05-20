<?php
// public_html/api/billing/cron_expire.php
// GET /api/billing/cron_expire.php?key=WORKER_KEY
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../plans.php';
require_once __DIR__ . '/../payment/SubscriptionService.php';

header('Content-Type: application/json; charset=UTF-8');

// Перевірка ключа — WORKER_KEY з .env
$key = isset($_GET['key']) ? $_GET['key'] : (isset($_SERVER['HTTP_X_WORKER_KEY']) ? $_SERVER['HTTP_X_WORKER_KEY'] : '');
if ($key !== env('WORKER_KEY', '')) {
    http_response_code(403);
    echo '{"error":"Forbidden"}';
    exit;
}

// Захист від паралельного запуску
$lockFile = sys_get_temp_dir() . '/indexfast_expire.lock';
if (file_exists($lockFile) && (time() - filemtime($lockFile)) < 3600) {
    echo json_encode(['status' => 'skipped', 'reason' => 'already_running']);
    exit;
}
file_put_contents($lockFile, getmypid());

$started = microtime(true);
$count   = 0;
$log     = [];

try {
    $svc   = new SubscriptionService();
    $count = $svc->expireSubscriptions();
    $log[] = 'Expired: ' . $count;

    $r3 = sendReminderBatch(3);
    $log[] = 'Reminders 3d: ' . $r3;

    $r7 = sendReminderBatch(7);
    $log[] = 'Reminders 7d: ' . $r7;

} catch (Exception $e) {
    @unlink($lockFile);
    error_log('[cron_expire] ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'error' => $e->getMessage()]);
    exit;
}

@unlink($lockFile);

echo json_encode([
    'status'  => 'ok',
    'expired' => $count,
    'log'     => $log,
    'elapsed' => round(microtime(true) - $started, 3),
    'ran_at'  => date('Y-m-d H:i:s'),
]);

// ─────────────────────────────────────────
function sendReminderBatch(int $days): int
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

    foreach ($rows as $row) {
        try {
            sendReminderEmail($row, $days);
        } catch (Exception $e) {
            error_log('[reminder] ' . $e->getMessage());
        }
    }
    return count($rows);
}

function sendReminderEmail(array $row, int $days): void
{
    $label = Plans::label($row['plan_id']);
    $date  = date('d.m.Y', strtotime($row['end_at']));
    $url   = env('FRONTEND_URL', env('APP_URL', '')) . '/app#pricing';
    $name  = htmlspecialchars($row['name']);

    // PHP 7.4 compatible day word
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
    $html .= '<a href="' . htmlspecialchars($url) . '" style="background:#00ff88;color:#050508;padding:12px 24px;border-radius:100px;text-decoration:none;font-weight:700">Поновити →</a>';
    $html .= '</p></td></tr></table></td></tr></table></body></html>';

    Mailer::send(
        $row['email'],
        '⏰ Підписка ' . $label . ' завершується ' . $date,
        $html
    );
}
