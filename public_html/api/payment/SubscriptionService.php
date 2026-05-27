<?php
// public_html/api/payment/SubscriptionService.php
// Сумісність: PHP 7.4+, MySQL 5.7+
// Без: match(), str_starts_with(), ?->, fn()

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../plans.php';
require_once __DIR__ . '/PaymentManager.php';

class SubscriptionService
{
    // ════════════════════════════════════════
    //  1. ІНІЦІЮВАТИ ОПЛАТУ
    // ════════════════════════════════════════

    public function initiate(array $user, string $planId, string $period, string $paymentMethod, string $promoCode = ''): array
    {
        $manager  = PaymentManager::getInstance();
        $provider = $manager->getProvider($paymentMethod);

        if (!$provider || !$provider->isEnabled()) {
            throw new RuntimeException("Payment method '{$paymentMethod}' is not available.");
        }
        if (!Plans::exists($planId)) {
            throw new RuntimeException("Plan '{$planId}' does not exist.");
        }

        $amountData      = $this->calcAmount($planId, $period);
        $amount          = $amountData[0];
        $currency        = $amountData[1];
        $endAt           = $this->calcEndAt($period);
        $discountPercent = 0;
        $promoApplied    = '';

        // ── Валідація промокоду ──────────────────────────────────────────────
        if ($promoCode !== '') {
            $promoCode = strtoupper(trim($promoCode));
            $promo = DB::row(
                "SELECT id, discount_percent, expires_at, target_plan
                 FROM email_logs
                 WHERE user_id    = ?
                   AND promo_code = ?
                   AND email_type = 'upsell'
                   AND (expires_at IS NULL OR expires_at >= CURDATE())
                 ORDER BY created_at DESC
                 LIMIT 1",
                [$user['id'], $promoCode]
            );

            if (!$promo) {
                throw new RuntimeException("Промокод '{$promoCode}' недійсний або не призначений вашому акаунту.");
            }
            if ($promo['target_plan'] !== $planId) {
                throw new RuntimeException("Промокод '{$promoCode}' дійсний лише для тарифу " . strtoupper($promo['target_plan']) . ".");
            }

            $discountPercent = (int)$promo['discount_percent'];
            $amount          = round($amount * (1 - $discountPercent / 100), 2);
            $promoApplied    = $promoCode;
        }

        // Створюємо підписку та платіж в транзакції
        $subId     = 0;
        $paymentId = 0;

        DB::pdo()->beginTransaction();
        try {
            DB::exec(
                "INSERT INTO subscriptions
                   (user_id, plan_id, payment_method, period, start_at, end_at,
                    status, auto_renew, amount, currency)
                 VALUES (?, ?, ?, ?, NOW(), ?, 'pending', 0, ?, ?)",
                [$user['id'], $planId, $paymentMethod, $period, $endAt, $amount, $currency]
            );
            $subId = (int)DB::pdo()->lastInsertId();

            DB::exec(
                "INSERT INTO payments
                   (subscription_id, user_id, payment_method, amount, currency, status)
                 VALUES (?, ?, ?, ?, ?, 'pending')",
                [$subId, $user['id'], $paymentMethod, $amount, $currency]
            );
            $paymentId = (int)DB::pdo()->lastInsertId();

            DB::pdo()->commit();
        } catch (Exception $e) {
            DB::pdo()->rollBack();
            throw $e;
        }

        // Сесія у провайдері
        $baseUrl = env('FRONTEND_URL', env('APP_URL', ''));
        $session = $provider->createPaymentSession([
            'user_id'         => $user['id'],
            'plan_id'         => $planId,
            'period'          => $period,
            'amount'          => $amount,
            'currency'        => $currency,
            'email'           => $user['email'],
            'name'            => trim(($user['name'] ?? '') . ' ' . ($user['surname'] ?? '')),
            'sub_id'          => $subId,
            'promo_code'      => $promoApplied,
            'discount_percent'=> $discountPercent,
            'success_url'     => $baseUrl . '/app?payment=success&sub=' . $subId,
            'cancel_url'      => $baseUrl . '/app?payment=cancel&sub='  . $subId,
        ]);

        if (!empty($session['payment_id'])) {
            DB::exec("UPDATE payments SET external_id = ? WHERE id = ?", [$session['payment_id'], $paymentId]);
        }

        if ($paymentMethod === 'manual') {
            DB::exec("UPDATE subscriptions SET status = 'awaiting_manual_confirmation' WHERE id = ?", [$subId]);
            DB::exec("UPDATE payments SET status = 'awaiting_manual_confirmation' WHERE id = ?", [$paymentId]);
        }

        $extra = isset($session['extra']) ? $session['extra'] : [];

        return [
            'sub_id'          => $subId,
            'payment_id'      => $paymentId,
            'redirect_url'    => isset($session['redirect_url']) ? $session['redirect_url'] : null,
            'extra'           => $extra,
            'provider'        => $paymentMethod,
            'amount'          => $amount,
            'discount_percent'=> $discountPercent,
            'promo_code'      => $promoApplied,
        ];
    }

    // ════════════════════════════════════════
    //  2. АКТИВУВАТИ ПІДПИСКУ
    // ════════════════════════════════════════

    public function activate(
        int    $userId,
        int    $subId,
        string $externalPaymentId,
               $externalSubId = null,
               $expiresAt     = null
    ): void {
        $sub = null;

        DB::pdo()->beginTransaction();
        try {
            // Деактивуємо попередню
            DB::exec(
                "UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW()
                 WHERE user_id = ? AND status = 'paid' AND id != ?",
                [$userId, $subId]
            );

            // Активуємо поточну
            DB::exec(
                "UPDATE subscriptions
                 SET status = 'paid',
                     external_payment_id = COALESCE(?, external_payment_id),
                     external_sub_id     = COALESCE(?, external_sub_id),
                     end_at              = COALESCE(?, end_at),
                     start_at            = NOW()
                 WHERE id = ? AND user_id = ?",
                [$externalPaymentId, $externalSubId, $expiresAt, $subId, $userId]
            );

            // Оновлюємо платіж
            DB::exec(
                "UPDATE payments
                 SET status = 'paid',
                     external_id = COALESCE(?, external_id),
                     paid_at = NOW()
                 WHERE subscription_id = ?
                   AND status IN ('pending', 'awaiting_manual_confirmation')
                 ORDER BY created_at DESC LIMIT 1",
                [$externalPaymentId, $subId]
            );

            $sub = DB::row("SELECT plan_id, end_at FROM subscriptions WHERE id = ?", [$subId]);
            if (!$sub) {
                throw new RuntimeException("Subscription #{$subId} not found");
            }

            $finalExpires = $expiresAt !== null ? $expiresAt : $sub['end_at'];

            DB::exec(
                "UPDATE users
                 SET plan = ?,
                     plan_started_at        = NOW(),
                     plan_expires_at        = ?,
                     active_subscription_id = ?
                 WHERE id = ?",
                [$sub['plan_id'], $finalExpires, $subId, $userId]
            );

            DB::pdo()->commit();
        } catch (Exception $e) {
            DB::pdo()->rollBack();
            throw $e;
        }

        // Email поза транзакцією
        try {
            $user = DB::row("SELECT email, name FROM users WHERE id = ?", [$userId]);
            if ($user && $sub) {
                $expires = $expiresAt !== null ? $expiresAt : $sub['end_at'];
                $this->sendActivationEmail($user, $sub['plan_id'], $expires);
            }
        } catch (Exception $e) {
            error_log("[SubscriptionService] Activation email: " . $e->getMessage());
        }

        // Conversion tracking — позначаємо upsell email який призвів до апгрейду
        try {
            DB::exec(
                "UPDATE email_logs
                 SET converted_at = NOW()
                 WHERE user_id     = ?
                   AND email_type  = 'upsell'
                   AND target_plan = ?
                   AND converted_at IS NULL
                 ORDER BY created_at DESC
                 LIMIT 1",
                [$userId, $sub['plan_id']]
            );
        } catch (Exception $e) {
            error_log("[SubscriptionService] Conversion tracking: " . $e->getMessage());
        }
    }

    // ════════════════════════════════════════
    //  3. СКАСУВАННЯ
    // ════════════════════════════════════════

    public function cancel(int $userId, int $subId): void
    {
        $sub = DB::row("SELECT * FROM subscriptions WHERE id = ? AND user_id = ?", [$subId, $userId]);
        if (!$sub) {
            throw new RuntimeException("Subscription not found");
        }

        if (!empty($sub['external_sub_id'])) {
            try {
                $provider = PaymentManager::getInstance()->getProvider($sub['payment_method']);
                if ($provider !== null) {
                    $provider->cancelSubscription($sub['external_sub_id']);
                }
            } catch (Exception $e) {
                error_log("[SubscriptionService] Provider cancel: " . $e->getMessage());
            }
        }

        DB::exec(
            "UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW() WHERE id = ?",
            [$subId]
        );
    }

    // ════════════════════════════════════════
    //  4. EXPIRE CRON
    // ════════════════════════════════════════

    public function expireSubscriptions(): int
    {
        $expired = DB::all(
            "SELECT s.id, s.user_id, s.plan_id, u.email, u.name
             FROM subscriptions s
             JOIN users u ON u.id = s.user_id
             WHERE s.end_at IS NOT NULL
               AND s.end_at < NOW()
               AND s.status IN ('paid', 'cancelled')"
        );

        $count = 0;
        foreach ($expired as $row) {
            try {
                $this->expireOne($row);
                $count++;
            } catch (Exception $e) {
                error_log("[expire] #{$row['id']}: " . $e->getMessage());
            }
        }

        // "Осирілі" юзери без активної підписки
        DB::exec(
            "UPDATE users
             SET plan = 'start',
                 plan_expires_at        = NULL,
                 plan_started_at        = NULL,
                 active_subscription_id = NULL
             WHERE plan != 'start'
               AND plan_expires_at IS NOT NULL
               AND plan_expires_at < NOW()
               AND (
                 active_subscription_id IS NULL
                 OR active_subscription_id NOT IN (
                   SELECT id FROM subscriptions WHERE status = 'paid'
                 )
               )"
        );

        return $count;
    }

    private function expireOne(array $sub): void
    {
        DB::pdo()->beginTransaction();
        try {
            DB::exec(
                "UPDATE subscriptions SET status = 'expired', expired_at = NOW() WHERE id = ?",
                [$sub['id']]
            );

            $other = DB::row(
                "SELECT id FROM subscriptions
                 WHERE user_id = ? AND status = 'paid' AND id != ?",
                [$sub['user_id'], $sub['id']]
            );

            if (!$other) {
                DB::exec(
                    "UPDATE users
                     SET plan = 'start',
                         plan_expires_at        = NULL,
                         plan_started_at        = NULL,
                         active_subscription_id = NULL
                     WHERE id = ?",
                    [$sub['user_id']]
                );
            }

            DB::pdo()->commit();
        } catch (Exception $e) {
            DB::pdo()->rollBack();
            throw $e;
        }

        try {
            $this->sendExpiredEmail($sub['email'], $sub['name'], $sub['plan_id']);
        } catch (Exception $e) {
            error_log("[expire email] " . $e->getMessage());
        }
    }

    // ════════════════════════════════════════
    //  5. ПОТОЧНА ПІДПИСКА
    // ════════════════════════════════════════

    public function getActive(int $userId): ?array
    {
        return DB::row(
            "SELECT * FROM subscriptions
             WHERE user_id = ? AND status = 'paid'
             ORDER BY created_at DESC LIMIT 1",
            [$userId]
        );
    }

    // ════════════════════════════════════════
    //  HELPERS
    // ════════════════════════════════════════

    private function calcAmount(string $planId, string $period): array
    {
        $key      = 'PRICE_' . strtoupper($planId) . '_' . strtoupper($period);
        $amount   = (float)(env($key, 0));
        $currency = env('DEFAULT_CURRENCY', 'UAH');
        return [$amount, $currency];
    }

    private function calcEndAt(string $period): ?string
    {
        if ($period === 'year') {
            return date('Y-m-d H:i:s', strtotime('+1 year'));
        }
        if ($period === '3_years') {
            return date('Y-m-d H:i:s', strtotime('+3 years'));
        }
        if ($period === 'custom') {
            return null;
        }
        // month та будь-який інший
        return date('Y-m-d H:i:s', strtotime('+1 month'));
    }

    // ════════════════════════════════════════
    //  EMAILS (рядки без unicode escapes для читабельності)
    // ════════════════════════════════════════

    private function sendActivationEmail(array $user, string $planId, ?string $expiresAt): void
    {
        $label   = Plans::label($planId);
        $expDate = $expiresAt ? date('d.m.Y', strtotime($expiresAt)) : 'безстрокова';
        $url     = env('FRONTEND_URL', env('APP_URL', '')) . '/app';
        $name    = htmlspecialchars($user['name']);

        $html  = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>';
        $html .= '<body style="background:#050508;margin:0;padding:20px;font-family:Arial,sans-serif">';
        $html .= '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">';
        $html .= '<table width="520" style="background:#111119;border-radius:16px;border:1px solid rgba(255,255,255,.08);max-width:520px">';
        $html .= '<tr><td style="background:#050508;padding:20px 32px;border-bottom:1px solid rgba(255,255,255,.06)">';
        $html .= '<span style="font-size:20px;font-weight:800;color:#eeeef6">Index<span style="color:#00ff88">Fast</span></span>';
        $html .= '</td></tr><tr><td style="padding:32px;color:#c8c8d8;font-size:15px;line-height:1.7">';
        $html .= '<p>&#x2705; &#1055;&#1088;&#1080;&#1074;&#1110;&#1090;, <strong style="color:#eeeef6">' . $name . '</strong>!</p>';
        $html .= '<p>&#1055;&#1110;&#1076;&#1087;&#1080;&#1089;&#1082;&#1072; <strong style="color:#00ff88">' . htmlspecialchars($label) . '</strong> &#1072;&#1082;&#1090;&#1080;&#1074;&#1086;&#1074;&#1072;&#1085;&#1072;. &#1044;&#1110;&#1108; &#1076;&#1086;: <strong style="color:#eeeef6">' . $expDate . '</strong></p>';
        $html .= '<p style="text-align:center;margin:28px 0">';
        $html .= '<a href="' . htmlspecialchars($url) . '" style="background:#00ff88;color:#050508;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700">&#1055;&#1077;&#1088;&#1077;&#1081;&#1090;&#1080; &#1076;&#1086; &#1082;&#1072;&#1073;&#1110;&#1085;&#1077;&#1090;&#1091; &rarr;</a>';
        $html .= '</p></td></tr></table></td></tr></table></body></html>';

        Mailer::send($user['email'], '&#x2705; &#1055;&#1110;&#1076;&#1087;&#1080;&#1089;&#1082;&#1072; ' . $label . ' &#1072;&#1082;&#1090;&#1080;&#1074;&#1086;&#1074;&#1072;&#1085;&#1072; &mdash; IndexFast', $html);
    }

    private function sendExpiredEmail(string $email, string $name, string $planId): void
    {
        $label = Plans::label($planId);
        $url   = env('FRONTEND_URL', env('APP_URL', '')) . '/app#pricing';
        $name  = htmlspecialchars($name);

        $html  = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>';
        $html .= '<body style="background:#050508;margin:0;padding:20px;font-family:Arial,sans-serif">';
        $html .= '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">';
        $html .= '<table width="520" style="background:#111119;border-radius:16px;border:1px solid rgba(255,255,255,.08);max-width:520px">';
        $html .= '<tr><td style="background:#050508;padding:20px 32px"><span style="font-size:20px;font-weight:800;color:#eeeef6">Index<span style="color:#00ff88">Fast</span></span></td></tr>';
        $html .= '<tr><td style="padding:32px;color:#c8c8d8;font-size:15px;line-height:1.7">';
        $html .= '<p>&#1055;&#1088;&#1080;&#1074;&#1110;&#1090;, <strong style="color:#eeeef6">' . $name . '</strong>!</p>';
        $html .= '<p>&#1055;&#1110;&#1076;&#1087;&#1080;&#1089;&#1082;&#1072; <strong style="color:#ffd060">' . htmlspecialchars($label) . '</strong> &#1079;&#1072;&#1074;&#1077;&#1088;&#1096;&#1080;&#1083;&#1072;&#1089;&#1100;. &#1040;&#1082;&#1072;&#1091;&#1085;&#1090; &#1087;&#1077;&#1088;&#1077;&#1074;&#1077;&#1076;&#1077;&#1085;&#1086; &#1085;&#1072; &#1073;&#1077;&#1079;&#1082;&#1086;&#1096;&#1090;&#1086;&#1074;&#1085;&#1080;&#1081; &#1087;&#1083;&#1072;&#1085;.</p>';
        $html .= '<p style="text-align:center;margin:28px 0">';
        $html .= '<a href="' . htmlspecialchars($url) . '" style="background:#00ff88;color:#050508;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700">&#1055;&#1086;&#1085;&#1086;&#1074;&#1080;&#1090;&#1080; &#1087;&#1110;&#1076;&#1087;&#1080;&#1089;&#1082;&#1091; &rarr;</a>';
        $html .= '</p></td></tr></table></td></tr></table></body></html>';

        Mailer::send($email, '&#1055;&#1110;&#1076;&#1087;&#1080;&#1089;&#1082;&#1072; ' . $label . ' &#1079;&#1072;&#1074;&#1077;&#1088;&#1096;&#1080;&#1083;&#1072;&#1089;&#1100; &mdash; IndexFast', $html);
    }
}
