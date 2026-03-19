<?php
// ══════════════════════════════════════════════
//  IndexFast — helpers.php
//  JWT, Email (SMTP), Rate Limiting, Tokens
// ══════════════════════════════════════════════

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// ════════════════════════════════════════
//  JWT — без зовнішніх бібліотек
// ════════════════════════════════════════
class JWT {

    public static function encode(array $payload): string {
        $header  = self::b64url(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = self::b64url(json_encode($payload));
        $sig     = self::b64url(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
        return "$header.$payload.$sig";
    }

    public static function decode(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $payload, $sig] = $parts;
        $expected = self::b64url(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));

        // Constant-time comparison
        if (!hash_equals($expected, $sig)) return null;

        $data = json_decode(self::b64url_decode($payload), true);
        if (!$data || (isset($data['exp']) && $data['exp'] < time())) return null;

        return $data;
    }

    public static function access(array $user): string {
        return self::encode([
            'sub'  => $user['id'],
            'email'=> $user['email'],
            'name' => $user['name'],
            'plan' => $user['plan'],
            'iat'  => time(),
            'exp'  => time() + JWT_ACCESS_TTL,
            'type' => 'access',
        ]);
    }

    public static function refresh(array $user): string {
        return self::encode([
            'sub'  => $user['id'],
            'iat'  => time(),
            'exp'  => time() + JWT_REFRESH_TTL,
            'type' => 'refresh',
        ]);
    }

    private static function b64url(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    private static function b64url_decode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}

// ════════════════════════════════════════
//  RATE LIMITING
// ════════════════════════════════════════
class RateLimit {

    public static function check(string $action): void {
        $ip = self::getIP();
        [$max, $window] = self::limits($action);

        // Чистимо старі записи
        DB::exec("DELETE FROM rate_limits WHERE last_attempt < DATE_SUB(NOW(), INTERVAL ? MINUTE)", [$window]);

        $row = DB::row(
            "SELECT * FROM rate_limits WHERE ip = ? AND action = ?",
            [$ip, $action]
        );

        if ($row) {
            // Чи заблоковано
            if ($row['blocked_until'] && strtotime($row['blocked_until']) > time()) {
                $wait = ceil((strtotime($row['blocked_until']) - time()) / 60);
                respond(429, "Забагато спроб. Спробуйте через {$wait} хв.");
            }
            // Оновлюємо лічильник
            $newAttempts = $row['attempts'] + 1;
            $blocked = null;
            if ($newAttempts >= $max) {
                $blocked = date('Y-m-d H:i:s', time() + $window * 60);
            }
            DB::exec(
                "UPDATE rate_limits SET attempts = ?, blocked_until = ?, last_attempt = NOW() WHERE id = ?",
                [$newAttempts, $blocked, $row['id']]
            );
        } else {
            DB::exec(
                "INSERT INTO rate_limits (ip, action, attempts) VALUES (?, ?, 1)",
                [$ip, $action]
            );
        }
    }

    public static function reset(string $ip, string $action): void {
        DB::exec("DELETE FROM rate_limits WHERE ip = ? AND action = ?", [$ip, $action]);
    }

    private static function limits(string $action): array {
        return match($action) {
            'login'   => [RATE_LOGIN_MAX,  RATE_LOGIN_WINDOW],
            'register'=> [RATE_REG_MAX,    RATE_REG_WINDOW],
            'forgot'  => [RATE_FORGOT_MAX, RATE_FORGOT_WINDOW],
            default   => [10, 60],
        };
    }

    public static function getIP(): string {
        $headers = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
        foreach ($headers as $h) {
            if (!empty($_SERVER[$h])) {
                $ip = trim(explode(',', $_SERVER[$h])[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP)) return $ip;
            }
        }
        return '0.0.0.0';
    }
}

// ════════════════════════════════════════
//  TOKENS — email verify, password reset
// ════════════════════════════════════════
class Token {

    public static function create(int $userId, string $type): string {
        // Видаляємо попередні невикористані токени цього типу
        DB::exec("DELETE FROM tokens WHERE user_id = ? AND type = ? AND used_at IS NULL", [$userId, $type]);

        $ttl = $type === 'password_reset' ? TOKEN_PASSWORD_RESET_TTL : TOKEN_EMAIL_VERIFY_TTL;
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime("+{$ttl} minutes"));

        DB::exec(
            "INSERT INTO tokens (user_id, token, type, expires_at) VALUES (?, ?, ?, ?)",
            [$userId, $token, $type, $expires]
        );

        return $token;
    }

    public static function verify(string $token, string $type): ?array {
        $row = DB::row(
            "SELECT t.*, u.id as uid, u.email, u.name FROM tokens t
             JOIN users u ON u.id = t.user_id
             WHERE t.token = ? AND t.type = ? AND t.used_at IS NULL AND t.expires_at > NOW()",
            [$token, $type]
        );
        return $row ?: null;
    }

    public static function consume(string $token): void {
        DB::exec("UPDATE tokens SET used_at = NOW() WHERE token = ?", [$token]);
    }
}

// ════════════════════════════════════════
//  EMAIL — SMTP без PHPMailer (native)
//  Або з PHPMailer якщо доступний
// ════════════════════════════════════════
class Mailer {

    public static function send(string $to, string $subject, string $html): bool {
        // Якщо PHPMailer є — використовуємо його
        if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            return self::sendViaPHPMailer($to, $subject, $html);
        }
        // Fallback: PHP mail() + headers
        return self::sendViaMailFunction($to, $subject, $html);
    }

    private static function sendViaPHPMailer(string $to, string $subject, string $html): bool {
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = SMTP_USER;
            $mail->Password   = SMTP_PASS;
            $mail->SMTPSecure = SMTP_SECURE === 'ssl'
                ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
                : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = (int) SMTP_PORT;
            $mail->CharSet    = 'UTF-8';

            $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
            $mail->addAddress($to);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $html;
            $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>'], "\n", $html));

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('[Mailer] PHPMailer error: ' . $e->getMessage());
            return false;
        }
    }

    private static function sendViaMailFunction(string $to, string $subject, string $html): bool {
        $headers = implode("\r\n", [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM . '>',
            'Reply-To: ' . MAIL_FROM,
            'X-Mailer: PHP/' . PHP_VERSION,
        ]);
        return mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $html, $headers);
    }

    // ── Шаблони листів
    public static function verifyEmail(string $to, string $name, string $token): bool {
        $link = APP_URL . '/api/auth/verify-email.php?token=' . urlencode($token);
        $html = self::template('Підтвердіть email', "
            <p>Привіт, <strong>{$name}</strong>!</p>
            <p>Дякуємо за реєстрацію в IndexFast. Натисніть кнопку нижче щоб підтвердити вашу email адресу:</p>
            <p style='text-align:center;margin:32px 0'>
              <a href='{$link}' style='background:#00ff88;color:#050508;padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:700;font-family:sans-serif'>
                Підтвердити email →
              </a>
            </p>
            <p style='color:#888;font-size:13px'>Посилання дійсне 24 години. Якщо ви не реєструвались — просто проігноруйте цей лист.</p>
            <p style='color:#888;font-size:12px'>Або скопіюйте посилання: <a href='{$link}' style='color:#00ff88'>{$link}</a></p>
        ");
        return self::send($to, 'Підтвердіть email — IndexFast', $html);
    }

    public static function resetPassword(string $to, string $name, string $token): bool {
        $link = APP_URL . '/auth.html?mode=reset&token=' . urlencode($token);
        $html = self::template('Скидання пароля', "
            <p>Привіт, <strong>{$name}</strong>!</p>
            <p>Ми отримали запит на скидання пароля для вашого акаунту IndexFast.</p>
            <p style='text-align:center;margin:32px 0'>
              <a href='{$link}' style='background:#00ff88;color:#050508;padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:700;font-family:sans-serif'>
                Скинути пароль →
              </a>
            </p>
            <p style='color:#888;font-size:13px'>Посилання дійсне <strong>60 хвилин</strong>. Якщо ви не робили цей запит — проігноруйте лист, пароль не зміниться.</p>
            <p style='color:#888;font-size:12px'>Або скопіюйте посилання: <a href='{$link}' style='color:#00ff88'>{$link}</a></p>
        ");
        return self::send($to, 'Скидання пароля — IndexFast', $html);
    }

    private static function template(string $title, string $body): string {
        return <<<HTML
        <!DOCTYPE html>
        <html lang="uk">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#0a0a10;font-family:'DM Sans',Arial,sans-serif;color:#eeeef6">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a10;padding:40px 20px">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#111119;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;max-width:560px;width:100%">
                <!-- Header -->
                <tr>
                  <td style="background:#050508;padding:24px 36px;border-bottom:1px solid rgba(255,255,255,0.06)">
                    <span style="font-family:sans-serif;font-size:22px;font-weight:800;color:#eeeef6">Index<span style="color:#00ff88">Fast</span></span>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:36px;font-size:15px;line-height:1.7;color:#c8c8d8">
                    <h2 style="margin:0 0 20px;font-size:20px;color:#eeeef6;font-weight:700">{$title}</h2>
                    {$body}
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;color:#555570;text-align:center">
                    © IndexFast · <a href="https://indexfast.pp.ua" style="color:#555570">indexfast.pp.ua</a>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
        HTML;
    }
}

// ════════════════════════════════════════
//  HTTP HELPERS
// ════════════════════════════════════════

function respond(int $code, string $message, array $data = []): never {
    http_response_code($code);
    echo json_encode(['success' => $code < 400, 'message' => $message, ...$data], JSON_UNESCAPED_UNICODE);
    exit;
}

function respondOk(string $message, array $data = []): never {
    respond(200, $message, $data);
}

function getBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

function requireField(array $data, string ...$fields): void {
    foreach ($fields as $f) {
        if (empty($data[$f])) {
            respond(422, "Поле '{$f}' є обов'язковим");
        }
    }
}

function sanitize(string $str): string {
    return htmlspecialchars(trim($str), ENT_QUOTES | ENT_HTML5, 'UTF-8');
}
