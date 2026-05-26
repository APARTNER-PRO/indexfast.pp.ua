<?php
// worker/inactivity_reminders.php
// Запуск: php worker/inactivity_reminders.php
// Cron:   0 12 * * * php /home/USER/worker/inactivity_reminders.php
// PHP 7.4+ / MySQL 5.7+
//
// Ліміти розсилок (разом із upsell_worker.php):
//   - Глобальний ліміт:   макс. 4 листи будь-якого типу за 30 днів на одного юзера
//   - Inactivity-листи:   макс. 2 листи за 30 днів на одного юзера
//   - Мінімальний інтервал між будь-якими листами: 5 днів

$isCli = PHP_SAPI === 'cli';

$apiDir = file_exists(dirname(__DIR__) . '/public_html/api/config.php')
    ? dirname(__DIR__) . '/public_html/api'
    : dirname(__DIR__) . '/api';

require_once $apiDir . '/config.php';

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

$lock = sys_get_temp_dir() . '/indexfast_inactivity.lock';
if (file_exists($lock) && (time() - filemtime($lock)) < 3600) {
    logMsg('Already running, skipping.');
    exit(0);
}
file_put_contents($lock, getmypid());

function logMsg(string $msg): void
{
    echo '[' . date('Y-m-d H:i:s') . '] ' . $msg . "\n";
    if (PHP_SAPI !== 'cli') { flush(); if (ob_get_level()) ob_flush(); }
}

logMsg('=== inactivity_reminders started ===');

try {
    // Спільна таблиця з upsell_worker.php — трекінг ВСІХ маркетингових листів
    DB::exec("
        CREATE TABLE IF NOT EXISTS `email_logs` (
          `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `user_id`     INT UNSIGNED NOT NULL,
          `email_type`  ENUM('inactivity','upsell') NOT NULL,
          `email_subtype` VARCHAR(50) NOT NULL,
          `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          INDEX `idx_user_created` (`user_id`, `created_at`),
          INDEX `idx_user_type`    (`user_id`, `email_type`, `created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    workerInactivityReminders();

    logMsg('=== Done ===');
} catch (Exception $e) {
    logMsg('ERROR: ' . $e->getMessage());
    error_log('[inactivity_reminders] ' . $e->getMessage());
} finally {
    @unlink($lock);
}

// ─────────────────────────────────────────────────────────────────────────────
// Константи лімітів
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_MAX_PER_30D     = 4;  // максимум будь-яких листів за 30 днів
const INACTIVITY_MAX_PER_30D = 2;  // максимум inactivity листів за 30 днів
const MIN_GAP_DAYS           = 5;  // мінімальний інтервал між будь-якими листами (днів)

/**
 * Перевіряє частотні ліміти перед відправкою inactivity листа.
 * Повертає причину блокування або null якщо відправку дозволено.
 */
function checkEmailLimits(int $userId): ?string
{
    // 1. Глобальний ліміт: всі листи за 30 днів
    $globalCount = (int)DB::value(
        "SELECT COUNT(*) FROM email_logs WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
        [$userId]
    );
    if ($globalCount >= GLOBAL_MAX_PER_30D) {
        return "global_limit_reached ({$globalCount}/" . GLOBAL_MAX_PER_30D . " за 30д)";
    }

    // 2. Inactivity ліміт: inactivity-листи за 30 днів
    $inactivityCount = (int)DB::value(
        "SELECT COUNT(*) FROM email_logs WHERE user_id = ? AND email_type = 'inactivity' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
        [$userId]
    );
    if ($inactivityCount >= INACTIVITY_MAX_PER_30D) {
        return "inactivity_limit_reached ({$inactivityCount}/" . INACTIVITY_MAX_PER_30D . " за 30д)";
    }

    // 3. Мінімальний інтервал: будь-який лист за останні 5 днів
    $lastSentAt = DB::value(
        "SELECT created_at FROM email_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [$userId]
    );
    if ($lastSentAt) {
        $daysSinceLast = (int)DB::value(
            "SELECT DATEDIFF(NOW(), ?)", [$lastSentAt]
        );
        if ($daysSinceLast < MIN_GAP_DAYS) {
            return "min_gap_not_reached ({$daysSinceLast}/" . MIN_GAP_DAYS . "д)";
        }
    }

    return null; // Відправку дозволено
}

/**
 * Логує відправлений лист у спільну таблицю.
 */
function logEmailSent(int $userId, string $subtype): void
{
    DB::exec(
        "INSERT INTO email_logs (user_id, email_type, email_subtype) VALUES (?, 'inactivity', ?)",
        [$userId, $subtype]
    );
}

function workerInactivityReminders(): void
{
    $rows = DB::all(
        "SELECT 
            u.id, u.email, u.name, u.created_at, u.last_login_at,
            DATEDIFF(CURDATE(), DATE(IFNULL(u.last_login_at, u.created_at))) as days_inactive,
            (SELECT COUNT(*) FROM sites WHERE user_id = u.id) as sites_count,
            (SELECT COALESCE(SUM(urls_sent), 0) FROM daily_usage WHERE user_id = u.id) as total_scans
         FROM users u
         WHERE u.is_active = 1
           AND DATEDIFF(CURDATE(), DATE(IFNULL(u.last_login_at, u.created_at))) IN (2, 3, 7, 14)"
    );

    logMsg("Found " . count($rows) . " users for potential reminders.");

    $sent = 0;
    $skipped = 0;

    foreach ($rows as $row) {
        $days  = (int)$row['days_inactive'];
        $sites = (int)$row['sites_count'];
        $scans = (int)$row['total_scans'];

        // Визначаємо тип листа
        $type = null;
        if ($days === 2 && $sites === 0) {
            $type = 'setup_site';
        } elseif ($days === 3 && $sites > 0 && $scans === 0) {
            $type = 'setup_json';
        } elseif ($days === 7 && $scans === 0) {
            $type = 'setup_help';
        } elseif ($days === 14 && $scans > 0) {
            $type = 'feedback_success';
        }

        if (!$type) continue;

        // Перевіряємо частотні ліміти
        $limitReason = checkEmailLimits((int)$row['id']);
        if ($limitReason !== null) {
            logMsg("  Skipped {$row['email']} ({$type}): {$limitReason}");
            $skipped++;
            continue;
        }

        try {
            workerSendInactivityEmail($row, $type);
            logEmailSent((int)$row['id'], $type);
            $sent++;
        } catch (Exception $e) {
            logMsg('  Email fail for ' . $row['email'] . ': ' . $e->getMessage());
        }
    }

    logMsg("Summary: sent={$sent}, skipped={$skipped}");
}

function workerSendInactivityEmail(array $row, string $type): void
{
    $envUrl = env('FRONTEND_URL', env('APP_URL', ''));
    $urls   = explode(',', $envUrl);
    $appUrl = rtrim(trim($urls[0]), '/');
    $url    = $appUrl . '/app';
    $name  = !empty($row['name']) ? htmlspecialchars($row['name']) : 'друже';
    $email = $row['email'];

    $html  = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>';
    $html .= '<body style="background:#050508;margin:0;padding:20px;font-family:Arial,sans-serif">';
    $html .= '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">';
    $html .= '<table width="520" style="background:#111119;border-radius:16px;border:1px solid rgba(255,255,255,.08);max-width:520px">';
    $html .= '<tr><td style="background:#050508;padding:20px 32px"><span style="font-size:18px;font-weight:800;color:#eeeef6">Index<span style="color:#00ff88">Fast</span></span></td></tr>';
    $html .= '<tr><td style="padding:28px;color:#c8c8d8;font-size:14px;line-height:1.7">';

    if ($type === 'setup_site') {
        $subject = '🚀 Час додати ваш перший сайт до IndexFast!';
        $html .= '<p>&#x1F44B; Привіт, <strong style="color:#eeeef6">' . $name . '</strong>!</p>';
        $html .= '<p>Ви зареєструвались в IndexFast, але ще не додали жодного сайту.</p>';
        $html .= '<p>Додайте ваш сайт прямо зараз, щоб почати миттєво відправляти сторінки на індексацію в Google. Наш безкоштовний тариф дозволяє відправляти до 10 URL щодня!</p>';
        $btnText = 'Додати сайт';
    } elseif ($type === 'setup_json') {
        $subject = '🔑 Завершіть налаштування: підключіть Google Indexing API';
        $html .= '<p>&#x1F44B; Привіт, <strong style="color:#eeeef6">' . $name . '</strong>!</p>';
        $html .= '<p>Ви додали сайт до IndexFast, але ми бачимо, що ви ще не відправили жодного URL на індексацію.</p>';
        $html .= '<p>Можливо, ви зупинилися на кроці підключення JSON-ключа Service Account? У нашій документації є покрокова відео-інструкція, як це зробити за 5 хвилин.</p>';
        $btnText = 'Читати інструкцію';
        $url = $appUrl . '/docs';
    } elseif ($type === 'setup_help') {
        $subject = '🛠 Потрібна допомога з налаштуванням індексації?';
        $html .= '<p>&#x1F44B; Привіт, <strong style="color:#eeeef6">' . $name . '</strong>!</p>';
        $html .= '<p>Ми помітили, що ви ще не розпочали сканування сайтів. Підключення Google Indexing API іноді може здатися складним на перший погляд.</p>';
        $html .= '<p>Якщо у вас виникли труднощі чи помилки — просто відпишіть на цей лист! Наша підтримка з радістю допоможе вам налаштувати все від А до Я.</p>';
        $btnText = 'Перейти в кабінет';
    } elseif ($type === 'feedback_success') {
        $subject = '📈 Як успіхи з індексацією в Google?';
        $html .= '<p>&#x1F44B; Привіт, <strong style="color:#eeeef6">' . $name . '</strong>!</p>';
        $html .= '<p>Ви вже успішно використовували IndexFast для відправки сторінок в Google. Ми хотіли поцікавитись, чи вже є позитивні результати в Google Search Console?</p>';
        $html .= '<p>Чи подобається вам наш сервіс? Якщо у вас є пропозиції щодо покращення або виникли запитання — будемо раді почути вас. Просто відпишіть на цей лист.</p>';
        $btnText = 'Відкрити IndexFast';
    } else {
        $subject = '🤔 Як вам сервіс IndexFast?';
        $html .= '<p>Привіт, <strong style="color:#eeeef6">' . $name . '</strong>!</p><p>Чи потрібна вам допомога з налаштуванням?</p>';
        $btnText = 'Перейти в кабінет';
    }

    $html .= '<p style="text-align:center;margin:24px 0">';
    $html .= '<a href="' . htmlspecialchars($url) . '" style="background:#00ff88;color:#050508;padding:12px 24px;border-radius:100px;text-decoration:none;font-weight:700">' . $btnText . '</a>';
    $html .= '</p></td></tr></table></td></tr></table></body></html>';

    Mailer::send($email, $subject, $html);
    logMsg("  Sent [{$type}] → {$email}");
}
