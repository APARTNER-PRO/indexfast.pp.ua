<?php
// worker/upsell_worker.php
// Запуск: php worker/upsell_worker.php
// Cron:   0 14 * * * php /home/USER/worker/upsell_worker.php
// PHP 7.4+ / MySQL 5.7+

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
require_once $apiDir . '/plans.php';

$lock = sys_get_temp_dir() . '/indexfast_upsell.lock';
if (file_exists($lock) && (time() - filemtime($lock)) < 3600) {
    exit(0);
}
file_put_contents($lock, getmypid());

function logMsg(string $msg): void {
    echo '[' . date('Y-m-d H:i:s') . '] ' . $msg . "\n";
    if (PHP_SAPI !== 'cli') { flush(); if (ob_get_level()) ob_flush(); }
}

logMsg('=== upsell_worker started ===');

try {
    // ─── Таблиця з повним conversion tracking ────────────────────────────────
    DB::exec("
        CREATE TABLE IF NOT EXISTS `email_logs` (
          `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `user_id`          INT UNSIGNED NOT NULL,
          `email_type`       ENUM('inactivity','upsell') NOT NULL,
          `email_subtype`    VARCHAR(50) NOT NULL,
          `token`            VARCHAR(64) NOT NULL,
          `target_plan`      VARCHAR(20) DEFAULT NULL,
          `discount_percent` TINYINT UNSIGNED DEFAULT NULL,
          `duration_months`  TINYINT UNSIGNED DEFAULT NULL,
          `promo_code`       VARCHAR(50) DEFAULT NULL,
          `expires_at`       DATE DEFAULT NULL,
          `opened_at`        DATETIME DEFAULT NULL,
          `clicked_at`       DATETIME DEFAULT NULL,
          `converted_at`     DATETIME DEFAULT NULL,
          `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_token` (`token`),
          INDEX `idx_user_created` (`user_id`, `created_at`),
          INDEX `idx_user_type`    (`user_id`, `email_type`, `created_at`),
          INDEX `idx_token`        (`token`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // ─── ОДИН запит замість N+1 ───────────────────────────────────────────────
    // Всі агрегати (сайти, usage, jobs, email_logs) — через LEFT JOIN підзапитів.
    // При 10k юзерів: 1 запит замість 50k+.
    $users = DB::all("
        SELECT
            u.id, u.email, u.name, u.plan,
            COALESCE(s_agg.sites_count,       0)    AS sites_count,
            COALESCE(du_agg.active_days,       0)    AS active_days,
            COALESCE(du_agg.max_usage_pct,     0)    AS max_usage_pct,
            COALESCE(j_agg.jobs_7d,            0)    AS jobs_7d,
            COALESCE(el_agg.emails_30d,        0)    AS emails_30d,
            COALESCE(el_agg.upsell_30d,        0)    AS upsell_30d,
            el_agg.last_email_at

        FROM users u

        -- Кількість сайтів
        LEFT JOIN (
            SELECT user_id, COUNT(*) AS sites_count
            FROM sites
            GROUP BY user_id
        ) s_agg ON s_agg.user_id = u.id

        -- Активність за 7 днів: кількість активних днів + пік навантаження
        LEFT JOIN (
            SELECT
                user_id,
                COUNT(CASE WHEN urls_sent > 0 THEN 1 END)                                    AS active_days,
                MAX(CASE WHEN urls_limit > 0 THEN (urls_sent / urls_limit * 100) ELSE 0 END) AS max_usage_pct
            FROM daily_usage
            WHERE usage_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY user_id
        ) du_agg ON du_agg.user_id = u.id

        -- Кількість jobs за 7 днів
        LEFT JOIN (
            SELECT user_id, COUNT(*) AS jobs_7d
            FROM jobs
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY user_id
        ) j_agg ON j_agg.user_id = u.id

        -- Email ліміти (всі типи листів)
        LEFT JOIN (
            SELECT
                user_id,
                SUM(created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY))                             AS emails_30d,
                SUM(email_type = 'upsell' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY))   AS upsell_30d,
                MAX(created_at)                                                                  AS last_email_at
            FROM email_logs
            GROUP BY user_id
        ) el_agg ON el_agg.user_id = u.id

        WHERE u.is_active = 1
          AND u.plan IN ('start', 'pro', 'agency')
          AND DATEDIFF(CURDATE(), DATE(IFNULL(u.plan_started_at, u.created_at))) > 14

        HAVING
            emails_30d < 4
            AND upsell_30d < 3
            AND (last_email_at IS NULL OR DATEDIFF(NOW(), last_email_at) >= 7)
    ");

    logMsg("Candidates after pre-filter: " . count($users));

    $sentCount = 0;

    foreach ($users as $u) {
        $userId       = (int)$u['id'];
        $currentPlan  = $u['plan'];
        $sitesCount   = (int)$u['sites_count'];
        $activeDays   = (int)$u['active_days'];
        $maxUsagePct  = (float)$u['max_usage_pct'];
        $jobs7d       = (int)$u['jobs_7d'];

        // ─── Score System ────────────────────────────────────────────────────
        $score      = 0;
        $targetPlan = '';
        $discount   = 0;
        $duration   = 0;

        if ($currentPlan === 'start') {
            if ($maxUsagePct >= 70)   { $score += 40; }
            elseif ($maxUsagePct >= 40) { $score += 15; }
            if ($sitesCount > 2)      { $score += 30; }
            elseif ($sitesCount > 0)  { $score += 10; }
            if ($activeDays >= 3)     { $score += 20; }
            if ($jobs7d > 5)          { $score += 15; }

            if ($score >= 65) {
                if ($sitesCount >= 5 || $maxUsagePct >= 95) {
                    $targetPlan = 'agency';
                    $discount   = rand(35, 45);
                    $duration   = rand(1, 2);
                } else {
                    $targetPlan = 'pro';
                    $discount   = rand(20, 30);
                    $duration   = rand(2, 3);
                }
            }
        } elseif ($currentPlan === 'pro') {
            if ($sitesCount >= 5)     { $score += 40; }
            elseif ($sitesCount >= 3) { $score += 20; }
            if ($maxUsagePct >= 70)   { $score += 35; }
            elseif ($maxUsagePct >= 50) { $score += 15; }
            if ($activeDays >= 4)     { $score += 15; }
            if ($jobs7d > 10)         { $score += 20; }

            if ($score >= 65) {
                $targetPlan = 'agency';
                $discount   = rand(30, 40);
                $duration   = 2;
            }
        } elseif ($currentPlan === 'agency') {
            if ($sitesCount >= 10)    { $score += 40; }
            elseif ($sitesCount >= 5) { $score += 20; }
            if ($maxUsagePct >= 80)   { $score += 35; }
            elseif ($maxUsagePct >= 60) { $score += 15; }
            if ($activeDays >= 5)     { $score += 15; }
            if ($jobs7d > 20)         { $score += 20; }

            if ($score >= 65) {
                $targetPlan = 'enterprise';
                $discount   = 0;
                $duration   = 0;
            }
        }

        if ($score < 65 || empty($targetPlan)) {
            logMsg("  [Skip] {$u['email']}: Score {$score} (Sites: {$sitesCount}, MaxUsage: {$maxUsagePct}%, ActiveDays: {$activeDays}, Jobs: {$jobs7d})");
            continue;
        }

        // ─── Генерація токена та метаданих пропозиції ─────────────────────
        $token     = bin2hex(random_bytes(32));
        $promoCode = strtoupper($targetPlan) . $discount . 'OFF';
        $expiresAt = date('Y-m-d', strtotime('+7 days'));
        $expiresDisplay = date('d.m.Y', strtotime('+7 days'));

        // ─── Зберігаємо в email_logs ДО відправки (маємо token для email) ─
        DB::exec(
            "INSERT INTO email_logs
                (user_id, email_type, email_subtype, token, target_plan, discount_percent, duration_months, promo_code, expires_at)
             VALUES (?, 'upsell', ?, ?, ?, ?, ?, ?, ?)",
            [$userId, $targetPlan, $token, $targetPlan, $discount, $duration, $promoCode, $expiresAt]
        );

        // ─── Відправка ───────────────────────────────────────────────────
        try {
            sendUpsellEmail($u, $targetPlan, $discount, $duration, $maxUsagePct, $sitesCount, $expiresDisplay, $token, $promoCode);
            logMsg("  Sent [{$currentPlan}→{$targetPlan}] {$u['email']} | -{$discount}% | expires {$expiresDisplay} | score={$score}");
            $sentCount++;
        } catch (Exception $e) {
            logMsg("  Email fail {$u['email']}: " . $e->getMessage());
            // Видаляємо запис якщо лист не вдалося надіслати
            DB::exec("DELETE FROM email_logs WHERE token = ?", [$token]);
        }
    }

    logMsg("Total sent: $sentCount");
    logMsg('=== Done ===');

} catch (Exception $e) {
    logMsg('ERROR: ' . $e->getMessage());
    error_log('[upsell_worker] ' . $e->getMessage());
} finally {
    @unlink($lock);
}

// ─────────────────────────────────────────────────────────────────────────────

function sendUpsellEmail(
    array  $user,
    string $targetPlan,
    int    $discount,
    int    $duration,
    float  $maxLimit,
    int    $sites,
    string $expiresDisplay,
    string $token,
    string $promoCode
): void {
    $name            = !empty($user['name']) ? htmlspecialchars($user['name']) : 'друже';
    $currentPlanName = strtoupper($user['plan']);
    $targetPlanName  = strtoupper($targetPlan);
    $envUrl          = env('FRONTEND_URL', env('APP_URL', ''));
    $urls            = explode(',', $envUrl);
    $appUrl          = rtrim(trim($urls[0]), '/');

    // URL для відстеження кліку
    $pricingUrl    = ($targetPlan === 'enterprise') ? 'mailto:support@' . parse_url($appUrl, PHP_URL_HOST) . '?subject=Enterprise Plan Inquiry' : $appUrl . '/app#pricing';
    $trackClickUrl = $appUrl . '/api/track/click.php?t=' . urlencode($token) . '&u=' . urlencode(base64_encode($pricingUrl));

    // Tracking pixel
    $trackOpenUrl  = $appUrl . '/api/track/open.php?t=' . urlencode($token);

    if ($targetPlan === 'enterprise') {
        $subject = "🌟 Ваш бізнес росте! Переходьте на Enterprise-рівень";
    } else {
        if ($maxLimit >= 90) {
            $subject = "⚠️ Ваш денний ліміт майже вичерпано! Тримайте -{$discount}% на {$targetPlanName}";
        } elseif ($maxLimit >= 70) {
            $subject = "🔥 Ви активно індексуєте! Збільшіть ліміти зі знижкою -{$discount}%";
        } elseif ($sites > 2 && $currentPlanName === 'START') {
            $subject = "📈 Ваші сайти ростуть! Забирайте -{$discount}% на тариф {$targetPlanName}";
        } else {
            $subjects = [
                "🎁 Персональна пропозиція: -{$discount}% на тариф {$targetPlanName}",
                "🚀 Час масштабуватись! Знижка -{$discount}% на {$targetPlanName}",
                "⚡ Прискорте індексацію з тарифом {$targetPlanName} (-{$discount}%)"
            ];
            $subject = $subjects[array_rand($subjects)];
        }
    }

    $html  = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>';
    $html .= '<body style="background:#050508;margin:0;padding:20px;font-family:Arial,sans-serif">';
    $html .= '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">';
    $html .= '<table width="520" style="background:#111119;border-radius:16px;border:1px solid rgba(255,255,255,.08);max-width:520px">';
    $html .= '<tr><td style="background:#050508;padding:20px 32px"><span style="font-size:18px;font-weight:800;color:#eeeef6">Index<span style="color:#00ff88">Fast</span></span></td></tr>';
    $html .= '<tr><td style="padding:28px;color:#c8c8d8;font-size:14px;line-height:1.7">';

    $html .= '<p>&#x1F44B; Привіт, <strong style="color:#eeeef6">' . $name . '</strong>!</p>';

    // Поточні обмеження
    $html .= '<p>Ми помітили вашу високу активність! Зараз ви використовуєте тариф <strong>' . $currentPlanName . '</strong>.';
    if ($maxLimit >= 70) {
        $html .= ' Останнім часом ви використали <strong>' . round($maxLimit) . '%</strong> свого денного ліміту URL.';
    }
    if ($sites > 2 && $currentPlanName === 'START') {
        $html .= ' У вас вже додано <strong>' . $sites . ' сайтів</strong>, що обмежує ефективність сканування на базовому тарифі.';
    }
    $html .= '</p>';

    // Пояснюємо користь upgrade
    if ($targetPlan === 'enterprise') {
        $html .= '<p>Ми помітили, що ви вже працюєте з великими обсягами даних. Тариф AGENCY має свої межі, але для ваших потреб ми можемо запропонувати індивідуальне рішення — <strong>Enterprise</strong>.</p>';
        
        $html .= '<div style="background:rgba(255,208,96,0.05); border:1px dashed #ffd060; padding:24px; border-radius:12px; margin:24px 0;">';
        $html .= '<h3 style="color:#ffd060; margin:0 0 16px 0; font-size:18px;">Enterprise — Індивідуально під ваші потреби</h3>';
        $html .= '<ul style="color:#c8c8d8; font-size:15px; line-height:1.8; list-style:none; padding-left:0; margin:0;">';
        $html .= '<li><span style="color:#00ff88; margin-right:8px;">✓</span>Необмежено URL/день</li>';
        $html .= '<li><span style="color:#00ff88; margin-right:8px;">✓</span>Необмежено сайтів</li>';
        $html .= '<li><span style="color:#00ff88; margin-right:8px;">✓</span>Кілька Service Account</li>';
        $html .= '<li><span style="color:#00ff88; margin-right:8px;">✓</span>Виділений воркер</li>';
        $html .= '<li><span style="color:#00ff88; margin-right:8px;">✓</span>Інтеграція під ключ</li>';
        $html .= '<li><span style="color:#00ff88; margin-right:8px;">✓</span>SLA та гарантії uptime</li>';
        $html .= '<li><span style="color:#00ff88; margin-right:8px;">✓</span>Персональний менеджер</li>';
        $html .= '</ul></div>';

        $html .= '<p style="text-align:center;margin:32px 0">';
        $html .= '<a href="' . htmlspecialchars($trackClickUrl) . '" style="background:#ffd060;color:#050508;padding:14px 36px;border-radius:100px;text-decoration:none;font-weight:800;font-size:16px;">Зв\'язатись &rarr;</a>';
        $html .= '</p>';
    } else {
        $html .= '<p>Щоб індексувати ще більше сторінок без затримок, пропонуємо перейти на тариф <strong style="color:#ffd060">' . $targetPlanName . '</strong>. Ви отримаєте розширені ліміти та пріоритетне автоматичне сканування.</p>';

        // Пропозиція зі строком дії
        $html .= '<div style="background:rgba(0,255,136,0.05); border:1px dashed #00ff88; padding:20px; border-radius:8px; text-align:center; margin:20px 0;">';
        $html .= '<span style="color:#eeeef6; font-size:15px;">Ваша персональна знижка:</span><br>';
        $html .= '<strong style="color:#00ff88; font-size:32px; line-height:1.4;">-' . $discount . '%</strong><br>';
        $html .= '<span style="color:#c8c8d8; font-size:13px;">на перші ' . $duration . ' ' . ($duration === 1 ? 'місяць' : 'місяці') . ' за промокодом ';
        $html .= '<strong style="color:#eeeef6; letter-spacing:0.06em; font-size:14px;">' . $promoCode . '</strong></span><br>';
        $html .= '<span style="color:#ff6b6b; font-size:12px; margin-top:8px; display:inline-block;">&#x23F0; Дійсно до ' . $expiresDisplay . '</span>';
        $html .= '</div>';

        $html .= '<p style="text-align:center;margin:24px 0">';
        $html .= '<a href="' . htmlspecialchars($trackClickUrl) . '" style="background:#00ff88;color:#050508;padding:13px 32px;border-radius:100px;text-decoration:none;font-weight:700;font-size:15px;">Оновити тариф &rarr;</a>';
        $html .= '</p>';
    }

    // Tracking pixel (останній елемент перед закриттям)
    $html .= '<img src="' . htmlspecialchars($trackOpenUrl) . '" width="1" height="1" alt="" style="display:block;">';
    $html .= '</td></tr></table></td></tr></table></body></html>';

    Mailer::send($user['email'], $subject, $html);
}
