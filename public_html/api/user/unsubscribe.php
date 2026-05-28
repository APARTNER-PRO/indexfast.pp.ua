<?php
// ══════════════════════════════════════════════
//  GET /api/user/unsubscribe.php?token=...
//  Одноклікова відписка від маркетингових листів
//  Не вимагає авторизації — токен одноразовий
// ══════════════════════════════════════════════
require_once dirname(dirname(__DIR__)) . '/api/config.php';
require_once dirname(dirname(__DIR__)) . '/api/db.php';

// Завантажуємо .env
$envFile = dirname(dirname(__DIR__)) . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
        [$key, $val] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($val, " \t\n\r\0\x0B\"'");
    }
}

$token = trim($_GET['token'] ?? '');

// ── Показуємо HTML сторінку (не JSON — це браузерний endpoint)
header('Content-Type: text/html; charset=UTF-8');

function page(string $icon, string $title, string $msg, bool $isError = false): string {
    $color = $isError ? '#ff4d6d' : '#00ff88';
    return <<<HTML
    <!DOCTYPE html>
    <html lang="uk">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>{$title} — IndexFast</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#050508;color:#f0f0f8;font-family:'DM Sans',system-ui,sans-serif;
          min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
        .card{background:#111119;border:1px solid rgba(255,255,255,0.08);border-radius:20px;
          padding:48px 40px;max-width:440px;width:100%;text-align:center}
        .icon{font-size:56px;margin-bottom:20px}
        h1{font-size:1.5rem;font-weight:800;margin-bottom:12px;color:#eeeef6}
        p{color:#7a7a95;line-height:1.7;font-size:.95rem}
        .btn{display:inline-block;margin-top:28px;background:{$color};color:#050508;
          padding:13px 32px;border-radius:100px;text-decoration:none;
          font-weight:700;font-size:.9rem}
        .logo{font-size:1.1rem;font-weight:800;letter-spacing:-.03em;
          margin-bottom:32px;color:#f0f0f8}
        .logo span{color:#00ff88}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">Index<span>Fast</span></div>
        <div class="icon">{$icon}</div>
        <h1>{$title}</h1>
        <p>{$msg}</p>
        <a class="btn" href="https://indexfast.pp.ua">На головну</a>
      </div>
    </body>
    </html>
    HTML;
}

// ── Валідація токена
if (!$token) {
    echo page('🔗', 'Недійсне посилання', 'Посилання для відписки відсутнє або пошкоджене.', true);
    exit;
}

try {
    $row = DB::row(
        "SELECT t.id, t.user_id, t.used_at, t.expires_at, u.email, u.name
         FROM tokens t
         JOIN users u ON u.id = t.user_id
         WHERE t.token = ? AND t.type = 'unsubscribe'",
        [$token]
    );
} catch (Throwable $e) {
    error_log('[unsubscribe] DB error: ' . $e->getMessage());
    echo page('⚠️', 'Помилка сервера', 'Спробуйте пізніше.', true);
    exit;
}

if (!$row) {
    echo page('❌', 'Посилання недійсне', 'Це посилання вже не активне або не існує.', true);
    exit;
}

if ($row['used_at']) {
    echo page('✅', 'Вже відписано', "Адресу <strong><!--email_off-->{$row['email']}<!--/email_off--></strong> вже видалено з маркетингової розсилки.");
    exit;
}

if (strtotime($row['expires_at']) < time()) {
    echo page('⏰', 'Посилання прострочене', 'Щоб відписатись — увійдіть в акаунт і змініть налаштування в профілі.', true);
    exit;
}

// ── Відписуємо
try {
    DB::exec("UPDATE users SET marketing_consent=0 WHERE id=?", [$row['user_id']]);
    DB::exec("UPDATE tokens SET used_at=NOW() WHERE id=?", [$row['id']]);
} catch (Throwable $e) {
    error_log('[unsubscribe] update failed: ' . $e->getMessage());
    echo page('⚠️', 'Помилка', 'Не вдалось зберегти зміни. Спробуйте пізніше.', true);
    exit;
}

$name  = $row['name'] ?: 'Користувач';
$email = $row['email'];

echo page(
    '✅',
    'Відписку підтверджено',
    "Привіт, <strong>{$name}</strong>!<br><br>
     Адресу <strong><!--email_off-->{$email}<!--/email_off--></strong> успішно видалено з маркетингової розсилки.<br><br>
     Ви більше не будете отримувати рекламні листи. Транзакційні повідомлення (підтвердження, сповіщення про помилки) продовжуватимуть надходити."
);
