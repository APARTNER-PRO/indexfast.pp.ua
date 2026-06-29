<?php
require_once __DIR__ . '/auth.php';
require_once dirname(__DIR__) . '/api/helpers.php';

$msg = $msgType = '';
$sent_count = 0;

// ── Створюємо таблицю шаблонів, якщо її немає
try {
    DB::exec("CREATE TABLE IF NOT EXISTS `email_templates` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `subject` VARCHAR(255) NOT NULL,
        `mode` VARCHAR(10) NOT NULL DEFAULT 'html',
        `body_html` MEDIUMTEXT,
        `body_text` MEDIUMTEXT,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
} catch (Throwable $e) {
    error_log('[admin email templates] create table failed: ' . $e->getMessage());
}

// ── Заповнюємо початковими шаблонами якщо таблиця пуста або додаємо нові
try {
    $templatesToSeed = [
        [
            'name' => 'Акційна пропозиція (PRO за півціни)',
            'subject' => 'Спеціальна пропозиція: тариф PRO за півціни! ⚡',
            'mode' => 'html',
            'body_html' => '<h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#eeeef6;text-align:center">Отримайте PRO доступ за ₴249! ⚡</h2>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Привіт, {{name}}!</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Ми підготували для вас спеціальну пропозицію. Тільки цього тижня ви можете підключити тариф <strong>PRO</strong> зі знижкою 50% на перший місяць!</p>

<div style="text-align:center;padding:24px;background:rgba(255,208,96,0.06);border:1px solid rgba(255,208,96,0.2);border-radius:14px;margin:20px 0">
  <div style="font-size:16px;text-decoration:line-through;color:#888">₴499</div>
  <div style="font-size:42px;font-weight:800;color:#ffd060">₴249</div>
  <div style="font-size:13px;color:#888;margin-top:4px">за перший місяць</div>
</div>

<p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#eeeef6">Що ви отримаєте з PRO-тарифом:</p>
<ul style="padding:0;list-style:none;margin:0 0 20px">
  <li style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#c8c8d8">✅ Індексація до 100 сторінок на день</li>
  <li style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#c8c8d8">✅ Додавання до 10 сайтів одночасно</li>
  <li style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#c8c8d8">✅ Автоматичний моніторинг позицій</li>
  <li style="padding:8px 0;font-size:14px;color:#c8c8d8">✅ Пріоритетна підтримка 24/7</li>
</ul>

<p style="text-align:center;margin:28px 0">
  <a href="https://indexfast.pro" style="background:#00ff88;color:#050508;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-family:sans-serif;font-size:15px;display:inline-block">Активувати знижку →</a>
</p>

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0">
{{unsubscribe}}',
            'body_text' => ''
        ],
        [
            'name' => 'Оновлення функцій (Швидка індексація)',
            'subject' => 'Оновлення IndexFast: пришвидшена індексація 🚀',
            'mode' => 'html',
            'body_html' => '<h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#eeeef6">Оновлення IndexFast: пришвидшена індексація 🚀</h2>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Привіт, {{name}}!</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Ми оновили наші алгоритми взаємодії з Google Search Console API. Тепер відправка сторінок на індексацію відбувається майже миттєво.</p>

<div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.15);border-radius:12px;padding:20px;margin:20px 0">
  <p style="margin:0;font-size:14px;font-weight:700;color:#00ff88;margin-bottom:6px">💡 Що нового:</p>
  <p style="margin:0;font-size:14px;line-height:1.6;color:#c8c8d8">1. Швидкість обробки черги запитів зросла на 40%.<br>2. Додано детальні графіки статусів сторінок у кабінеті.<br>3. Оновлено систему автоматичного оновлення токенів GSC.</p>
</div>

<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Спробуйте відправити ваші нові сторінки на індексацію прямо зараз та оцініть швидкість роботи оновленого сервісу.</p>

<p style="text-align:center;margin:28px 0">
  <a href="https://indexfast.pro" style="background:#00ff88;color:#050508;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-family:sans-serif;font-size:15px;display:inline-block">Перейти до кабінету →</a>
</p>

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0">
{{unsubscribe}}',
            'body_text' => ''
        ],
        [
            'name' => 'Вітальний лист (Швидкий старт)',
            'subject' => 'Ласкаво просимо до IndexFast! 🎉 Швидкий старт за 3 кроки',
            'mode' => 'html',
            'body_html' => '<h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#eeeef6;text-align:center">Ласкаво просимо до IndexFast! 🎉</h2>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Привіт, {{name}}!</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Дякуємо, що обрали IndexFast для прискорення індексації ваших сайтів у Google. Ми розробили цей сервіс, щоб допомогти вашому контенту потрапляти в пошук за лічені години.</p>

<p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#eeeef6">Три простих кроки для запуску індексації:</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0">
  <tr>
    <td style="width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;vertical-align:top;margin-bottom:12px;display:block">
      <strong style="color:#eeeef6">1. Додайте свій перший сайт</strong>
      <p style="margin:4px 0 0;font-size:13px;color:#888">Вкажіть адресу вашого сайту в особистому кабінеті.</p>
    </td>
  </tr>
  <tr>
    <td style="width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;vertical-align:top;margin-bottom:12px;display:block">
      <strong style="color:#eeeef6">2. Підключіть Google Search Console</strong>
      <p style="margin:4px 0 0;font-size:13px;color:#888">Завантажте JSON-ключ сервісного акаунта для безпечного доступу.</p>
    </td>
  </tr>
  <tr>
    <td style="width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;vertical-align:top;display:block">
      <strong style="color:#eeeef6">3. Надішліть сторінки на індексацію</strong>
      <p style="margin:4px 0 0;font-size:13px;color:#888">Додайте посилання вручну або завантажте карту сайту XML.</p>
    </td>
  </tr>
</table>

<p style="text-align:center;margin:28px 0">
  <a href="https://indexfast.pro" style="background:#00ff88;color:#050508;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-family:sans-serif;font-size:15px;display:inline-block">Почати індексацію →</a>
</p>

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0">
{{unsubscribe}}',
            'body_text' => ''
        ],
        [
            'name' => 'Безпека: Новий вхід в кабінет',
            'subject' => 'Безпека акаунта: Новий успішний вхід 🔐',
            'mode' => 'html',
            'body_html' => '<h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#eeeef6;text-align:center">Безпека акаунта: Новий вхід 🔐</h2>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Привіт, {{name}}!</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Ми зафіксували успішний вхід у ваш особистий кабінет IndexFast.</p>

<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin:20px 0">
  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#c8c8d8">
    <tr><td style="padding:4px 0;color:#888" width="100">Час:</td><td style="padding:4px 0;color:#eeeef6"><strong>2026-05-28 17:30 (UTC)</strong></td></tr>
    <tr><td style="padding:4px 0;color:#888">IP-адреса:</td><td style="padding:4px 0;color:#eeeef6"><strong>195.12.34.56</strong></td></tr>
    <tr><td style="padding:4px 0;color:#888">Пристрій:</td><td style="padding:4px 0;color:#eeeef6"><strong>Chrome / Windows</strong></td></tr>
  </table>
</div>

<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#888">⚠ Якщо це були ви, ви можете проігнорувати цей лист. Якщо це були не ви — будь ласка, негайно змініть пароль у налаштуваннях вашого профілю для захисту даних.</p>

<p style="text-align:center;margin:28px 0">
  <a href="https://indexfast.pro" style="background:#ffd060;color:#050508;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-family:sans-serif;font-size:15px;display:inline-block">Перевірити активність →</a>
</p>

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0">
{{unsubscribe}}',
            'body_text' => ''
        ],
        [
            'name' => 'Безпека: Спроба входу (помилка пароля)',
            'subject' => 'Спроба входу в акаунт IndexFast ⚠️',
            'mode' => 'html',
            'body_html' => '<h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#eeeef6;text-align:center">Спроба входу в акаунт ⚠️</h2>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Привіт, {{name}}!</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Ми зафіксували неуспішну спробу входу у ваш акаунт IndexFast (введено неправильний пароль).</p>

<div style="background:rgba(255,77,109,0.05);border:1px solid rgba(255,77,109,0.15);border-radius:12px;padding:20px;margin:20px 0">
  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#c8c8d8">
    <tr><td style="padding:4px 0;color:#888" width="100">Час:</td><td style="padding:4px 0;color:#eeeef6"><strong>2026-05-28 17:35 (UTC)</strong></td></tr>
    <tr><td style="padding:4px 0;color:#888">IP-адреса:</td><td style="padding:4px 0;color:#eeeef6"><strong>195.12.34.56</strong></td></tr>
    <tr><td style="padding:4px 0;color:#888">Дія:</td><td style="padding:4px 0;color:#ff4d6d"><strong>Невірний пароль</strong></td></tr>
  </table>
</div>

<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#888">Ваш акаунт залишається в безпеці. Однак, якщо ви не робили цієї спроби, ми рекомендуємо встановити більш складний пароль або переконатися, що ваша пошта захищена двофакторною автентифікацією.</p>

<p style="text-align:center;margin:28px 0">
  <a href="https://indexfast.pro" style="background:#ff4d6d;color:#fff;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-family:sans-serif;font-size:15px;display:inline-block">Змінити пароль →</a>
</p>

<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0">
{{unsubscribe}}',
            'body_text' => ''
        ]
    ];

    foreach ($templatesToSeed as $tpl) {
        $exists = DB::row("SELECT id FROM email_templates WHERE name = ?", [$tpl['name']]);
        if (!$exists) {
            DB::exec(
                "INSERT INTO email_templates (name, subject, mode, body_html, body_text) VALUES (?, ?, ?, ?, ?)",
                [$tpl['name'], $tpl['subject'], $tpl['mode'], $tpl['body_html'], $tpl['body_text']]
            );
        }
    }
} catch (Throwable $e) {
    error_log('[admin email templates] seeding failed: ' . $e->getMessage());
}

// ── Обробка екшнів шаблонів
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    if ($action === 'save_template') {
        $tplName    = trim($_POST['template_name'] ?? '');
        $tplSubject = trim($_POST['subject'] ?? '');
        $tplMode    = $_POST['mode'] ?? 'html';
        $tplHtml    = $_POST['body_html'] ?? '';
        $tplText    = $_POST['body_text'] ?? '';

        if (!$tplName) {
            $msg = 'Вкажіть назву шаблону';
            $msgType = 'err';
        } elseif (!$tplSubject) {
            $msg = 'Вкажіть тему для шаблону';
            $msgType = 'err';
        } else {
            try {
                $exists = DB::row("SELECT id FROM email_templates WHERE name = ?", [$tplName]);
                if ($exists) {
                    DB::exec(
                        "UPDATE email_templates SET subject = ?, mode = ?, body_html = ?, body_text = ? WHERE id = ?",
                        [$tplSubject, $tplMode, $tplHtml, $tplText, $exists['id']]
                    );
                } else {
                    DB::exec(
                        "INSERT INTO email_templates (name, subject, mode, body_html, body_text) VALUES (?, ?, ?, ?, ?)",
                        [$tplName, $tplSubject, $tplMode, $tplHtml, $tplText]
                    );
                }
                $msg = "Шаблон '{$tplName}' збережено!";
                $msgType = 'ok';
            } catch (Throwable $e) {
                $msg = 'Помилка збереження: ' . $e->getMessage();
                $msgType = 'err';
            }
        }
    } elseif ($action === 'delete_template') {
        $tplId = (int)($_POST['template_id'] ?? 0);
        try {
            DB::exec("DELETE FROM email_templates WHERE id = ?", [$tplId]);
            $msg = "Шаблон видалено";
            $msgType = 'ok';
        } catch (Throwable $e) {
            $msg = 'Помилка видалення: ' . $e->getMessage();
            $msgType = 'err';
        }
    }
}

// ── Отримуємо список шаблонів
$templates = [];
try {
    $templates = DB::all("SELECT * FROM email_templates ORDER BY name ASC");
} catch (Throwable $e) {
    error_log('[admin email templates] fetch failed: ' . $e->getMessage());
}

// Тестова відправка
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['send_test'])) {
    $testEmail = trim($_POST['test_email'] ?? '');
    $subject   = trim($_POST['subject'] ?? '');
    $body_html = $_POST['body_html'] ?? '';
    $body_text = trim($_POST['body_text'] ?? '');
    $mode      = $_POST['mode'] ?? 'html';

    if (!$testEmail || !filter_var($testEmail, FILTER_VALIDATE_EMAIL)) {
        $msg = 'Вкажіть коректний email для тесту';
        $msgType = 'err';
    } elseif (!$subject) {
        $msg = 'Вкажіть тему листа';
        $msgType = 'err';
    } else {
        $emailWrapper = '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>body { margin:0; padding:12px; background:#0a0a10; }</style>
</head>
<body style="background:#0a0a10; margin:0; padding:12px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#111119; border-radius:12px; border:1px solid rgba(255,255,255,0.08); overflow:hidden; max-width:480px">
        <tr><td style="background:#050508; padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06)">
          <span style="font-size:18px; font-weight:800; color:#eeeef6; font-family:sans-serif;">Index<span style="color:#00ff88">Fast</span></span>
          <span style="font-size:11px; color:#ff4d6d; margin-left:8px; font-family:sans-serif;">[ТЕСТ]</span>
        </td></tr>
        <tr><td style="padding:24px; font-size:14px; line-height:1.7; color:#c8c8d8; font-family:sans-serif;">BODY_PLACEHOLDER</td></tr>
        <tr><td style="padding:12px 24px; border-top:1px solid rgba(255,255,255,0.06); font-size:11px; color:#555570; text-align:center; font-family:sans-serif;">© IndexFast &mdash; Тестовий лист</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>';

        if ($mode === 'text') {
            $html = nl2br(htmlspecialchars($body_text));
        } else {
            $unsubFooter = "<p style='color:#555570;font-size:12px;margin-top:24px;text-align:center'>Ссилка відписки буде в реальному листі</p>";
            $html = str_replace('{{unsubscribe}}', $unsubFooter, $body_html);
            if (!str_contains($html, $unsubFooter)) $html .= $unsubFooter;
            $html = str_replace('BODY_PLACEHOLDER', $html, $emailWrapper);
        }

        // Персоналізація з тестовими даними
        $html = str_replace(['{{name}}', '{{email}}'], ['Тестовий Користувач', $testEmail], $html);

        try {
            Mailer::send($testEmail, '[TECT] ' . $subject, $html);
            $msg = "✅ Тестовий лист надіслано на {$testEmail}";
            $msgType = 'ok';
        } catch (Throwable $e) {
            $msg = 'Помилка відправки: ' . $e->getMessage();
            $msgType = 'err';
        }
    }
}

// ── Відправка
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['send'])) {
    $subject   = trim($_POST['subject'] ?? '');
    $body_html = $_POST['body_html'] ?? '';
    $body_text = trim($_POST['body_text'] ?? '');
    $mode      = $_POST['mode'] ?? 'html'; // html | text
    $segment   = $_POST['segment'] ?? 'all'; // all | marketing | pro | agency

    if (!$subject) { $msg = 'Вкажіть тему листа'; $msgType = 'err'; goto render; }
    if ($mode === 'html' && !$body_html) { $msg = 'Вкажіть HTML контент'; $msgType = 'err'; goto render; }
    if ($mode === 'text' && !$body_text) { $msg = 'Вкажіть текст листа'; $msgType = 'err'; goto render; }

    // Вибираємо отримувачів
    $where = "is_active=1 AND email_verified=1";
    $params = [];
    // match($segment) {
    //     'marketing' => ($where .= " AND marketing_consent=1"),
    //     'pro'       => ($where .= " AND plan='pro'"),
    //     'agency'    => ($where .= " AND plan IN ('agency','enterprise')"),
    //     default     => null,
    // };
    switch ($segment) {
    case 'marketing':
        $where .= " AND marketing_consent=1";
        break;

    case 'no_marketing':
        $where .= " AND (marketing_consent=0 OR marketing_consent IS NULL)";
        break;

    case 'start':
        $where .= " AND plan='start'";
        break;

    case 'pro':
        $where .= " AND plan='pro'";
        break;

    case 'agency':
        $where .= " AND plan IN ('agency','enterprise')";
        break;

    case 'marketing_start':
        $where .= " AND marketing_consent=1 AND plan='start'";
        break;

    case 'marketing_pro':
        $where .= " AND marketing_consent=1 AND plan='pro'";
        break;

    case 'marketing_agency':
        $where .= " AND marketing_consent=1 AND plan IN ('agency','enterprise')";
        break;
}
    $recipients = DB::all("SELECT id, email, name FROM users WHERE $where ORDER BY id ASC", $params);

    if (empty($recipients)) {
        $msg = 'Немає отримувачів за вибраним сегментом';
        $msgType = 'err';
        goto render;
    }

    // Додаємо unsubscribe footer
    $unsubBase = FRONTEND_URL . '/app/profile'; // fallback

    // Красивий темний шаблон для HTML-листів (такий самий як у Preview)
    $emailWrapper = '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin:0; padding:12px; background:#0a0a10; }
  </style>
</head>
<body style="background:#0a0a10; margin:0; padding:12px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#111119; border-radius:12px; border:1px solid rgba(255,255,255,0.08); overflow:hidden; max-width:480px">
          <tr>
            <td style="background:#050508; padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06)">
              <span style="font-size:18px; font-weight:800; color:#eeeef6; font-family:sans-serif;">Index<span style="color:#00ff88">Fast</span></span>
            </td>
          </tr>
          <tr>
            <td style="padding:24px; font-size:14px; line-height:1.7; color:#c8c8d8; font-family:sans-serif;">
              BODY_PLACEHOLDER
            </td>
          </tr>
          <tr>
            <td style="padding:12px 24px; border-top:1px solid rgba(255,255,255,0.06); font-size:11px; color:#555570; text-align:center; font-family:sans-serif;">
              © IndexFast
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

    foreach ($recipients as $r) {
        // Генеруємо або отримуємо unsubscribe токен для юзера
        try {
            $unsubUrl = Token::unsubscribeUrl((int)$r['id']);
        } catch (Throwable $e) {
            $unsubUrl = $unsubBase; // fallback на профіль
        }

        if ($mode === 'text') {
            // Простий текстовий лист
            $html = nl2br(htmlspecialchars($body_text));
            $html .= "\n\n<p style='color:#666;font-size:12px'>---<br>Відписатись від розсилки: <a href='$unsubUrl'>$unsubUrl</a></p>";
        } else {
            // HTML — вставляємо unsubscribe footer
            $unsubFooter = "<p style='color:#555570;font-size:12px;margin-top:24px;text-align:center'>
                Ви отримали цей лист тому що підписались на розсилку IndexFast.<br>
                <a href='$unsubUrl' style='color:#555570'>Відписатись від розсилки</a>
            </p>";
            $html = str_replace('{{unsubscribe}}', $unsubFooter, $body_html);
            if (!str_contains($html, $unsubFooter)) $html .= $unsubFooter;

            // Огортаємо тіло листа у темний фірмовий шаблон
            $html = str_replace('BODY_PLACEHOLDER', $html, $emailWrapper);
        }

        // Персоналізація
        $name = $r['name'] ?: 'Привіт';
        $html = str_replace(['{{name}}', '{{email}}'], [$name, $r['email']], $html);

        try {
            Mailer::send($r['email'], $subject, $html);
            $sent_count++;
            // Пауза між листами (не спамимо SMTP)
            if ($sent_count % 10 === 0) usleep(500_000); // 0.5s кожні 10
        } catch (Throwable $e) {
            error_log('[admin mailer] ' . $r['email'] . ': ' . $e->getMessage());
        }
    }

    $msg = "✅ Надіслано {$sent_count} листів з " . count($recipients);
    $msgType = 'ok';
}

render:

// Рахуємо сегменти для UI
$counts = [
    'all'              => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1")['c'],
    'marketing'        => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND marketing_consent=1")['c'],
    'no_marketing'     => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND (marketing_consent=0 OR marketing_consent IS NULL)")['c'],
    'start'            => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND plan='start'")['c'],
    'pro'              => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND plan='pro'")['c'],
    'agency'           => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND plan IN ('agency','enterprise')")['c'],
    'marketing_start'  => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND marketing_consent=1 AND plan='start'")['c'],
    'marketing_pro'    => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND marketing_consent=1 AND plan='pro'")['c'],
    'marketing_agency' => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND marketing_consent=1 AND plan IN ('agency','enterprise')")['c'],
];

// Безпечне зчитування APP_EMAIL
$appEmail = defined('APP_EMAIL') ? APP_EMAIL : (defined('SMTP_USER') ? SMTP_USER : '');
?>
<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Email розсилка — Admin</title>
<style>
<?php readfile(__DIR__ . '/shared.css'); ?>

/* Extra */
body.sub { padding: 0; }
.layout { display: grid; grid-template-columns: 1fr 420px; gap: 0; height: 100vh; }
.left-panel { padding: 24px; overflow-y: auto; border-right: 1px solid var(--border); }
.right-panel { padding: 24px; overflow-y: auto; background: var(--dark); }

h1 { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; }
h2 { font-size: .8rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 20px 0 10px; }

/* Сегменти */
.segments { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 0; }
.seg-btn { background: var(--card); border: 2px solid var(--border); color: var(--muted); border-radius: 10px; padding: 10px 16px; cursor: pointer; font-size: .8rem; transition: all .15s; }
.seg-btn:hover { border-color: var(--border2); color: var(--white); }
.seg-btn.active { border-color: var(--green); color: var(--green); background: rgba(0,255,136,.06); }
.seg-count { font-weight: 800; font-size: 1.1rem; display: block; }

/* Mode tabs */
.mode-tabs { display: flex; gap: 4px; background: var(--card); border-radius: 10px; padding: 4px; margin-bottom: 16px; border: 1px solid var(--border); }
.mode-tab { flex: 1; padding: 8px; border-radius: 8px; border: none; cursor: pointer; font-size: .8rem; font-weight: 600; background: transparent; color: var(--muted); transition: all .15s; }
.mode-tab.active { background: rgba(0,255,136,.1); color: var(--green); }

/* Inputs */
.f-label { display: block; font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.f-field { margin-bottom: 16px; }
.f-text { width: 100%; background: var(--dark); border: 1px solid var(--border2); border-radius: 10px; padding: 10px 14px; color: var(--white); font-size: .875rem; outline: none; font-family: inherit; }
.f-text:focus { border-color: rgba(0,255,136,.4); }
.f-textarea { width: 100%; background: var(--dark); border: 1px solid var(--border2); border-radius: 10px; padding: 10px 14px; color: var(--white); font-size: .8rem; outline: none; font-family: 'ui-monospace', monospace; resize: vertical; min-height: 160px; }
.f-textarea:focus { border-color: rgba(0,255,136,.4); }

/* Builder blocks */
.builder { display: flex; flex-direction: column; gap: 8px; }
.block-btn { background: var(--card2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; color: var(--white); font-size: .8rem; cursor: pointer; text-align: left; transition: all .15s; display: flex; align-items: center; gap: 10px; }
.block-btn:hover { border-color: var(--green); color: var(--green); }

/* Preview */
.preview-frame { width: 100%; border: none; border-radius: 10px; min-height: 400px; background: #0a0a10; }

/* Send btn */
.send-btn { width: 100%; background: var(--green); color: var(--black); border: none; border-radius: 12px; padding: 14px; font-weight: 800; font-size: .95rem; cursor: pointer; margin-top: 8px; transition: opacity .2s; }
.send-btn:hover { opacity: .9; }
.send-btn:disabled { opacity: .5; cursor: not-allowed; }

.hint { font-size: .75rem; color: var(--muted); margin-top: 6px; line-height: 1.5; }
.vars { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.var-tag { background: rgba(0,255,136,.08); border: 1px solid rgba(0,255,136,.2); color: var(--green); border-radius: 6px; padding: 2px 8px; font-size: .7rem; font-family: monospace; cursor: pointer; }
.var-tag:hover { background: rgba(0,255,136,.15); }

@media(max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .right-panel { display: none; }
}
</style>
</head>
<body class="sub">

<?php if ($msg): ?>
<div style="position:fixed;top:16px;right:16px;z-index:999;padding:12px 20px;border-radius:12px;font-size:.875rem;
  background:<?= $msgType==='ok'?'rgba(0,255,136,.12)':'rgba(255,77,109,.12)' ?>;
  border:1px solid <?= $msgType==='ok'?'rgba(0,255,136,.3)':'rgba(255,77,109,.3)' ?>;
  color:<?= $msgType==='ok'?'var(--green)':'var(--red)' ?>">
  <?= htmlspecialchars($msg) ?>
</div>
<?php endif; ?>

<form method="POST" id="mailForm">
<div class="layout">

  <!-- ══ ЛІВА ПАНЕЛЬ — Редактор ══ -->
  <div class="left-panel">
    <h1>📧 Email розсилка</h1>

    <!-- ══ Шаблони ══ -->
    <h2>Шаблони повідомлень</h2>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:20px">
      <div class="f-field" style="margin-bottom:12px">
        <label class="f-label" style="margin-bottom:4px">Обрати готовий шаблон</label>
        <div style="display:flex;gap:8px">
          <select id="tplSelect" class="f-text" style="margin-bottom:0;flex:1;padding:8px 12px;font-size:.8rem" onchange="loadTemplate(this.value)">
            <option value="">-- Оберіть шаблон --</option>
            <?php foreach ($templates as $tpl): ?>
              <option value="<?= $tpl['id'] ?>"><?= htmlspecialchars($tpl['name']) ?></option>
            <?php endforeach; ?>
          </select>
          <button type="button" class="seg-btn" style="padding:0 12px;border-width:1px;color:var(--red);border-color:rgba(255,77,109,.2)" onclick="deleteTemplate()">Видалити</button>
        </div>
      </div>
      <div class="f-field" style="margin-bottom:0">
        <label class="f-label" style="margin-bottom:4px">Зберегти поточний як новий шаблон або оновити</label>
        <div style="display:flex;gap:8px">
          <input type="text" id="tplNameInput" placeholder="Назва шаблону..." class="f-text" style="margin-bottom:0;flex:1;padding:8px 12px;font-size:.8rem">
          <button type="button" class="seg-btn" style="padding:0 16px;border-width:1px" onclick="saveAsTemplate()">Зберегти</button>
        </div>
      </div>
    </div>

    <!-- Сегмент -->
    <h2>Отримувачі</h2>
    <div class="segments">
      <?php
      $segs = [
        'all'              => ['Всі юзери',          '📬'],
        'marketing'        => ['Підписники (всі)',    '✅'],
        'no_marketing'     => ['Не підписники',       '🚫'],
        'start'            => ['Start план',          '🌱'],
        'pro'              => ['PRO план',            '⚡'],
        'agency'           => ['Agency/Ent.',         '🏢'],
        'marketing_start'  => ['Підп. Start',         '✅🌱'],
        'marketing_pro'    => ['Підп. PRO',           '✅⚡'],
        'marketing_agency' => ['Підп. Agency',        '✅🏢'],
      ];
      foreach ($segs as $key => [$label, $icon]):
      ?>
      <label class="seg-btn <?= (!isset($_POST['segment']) && $key==='marketing') || ($_POST['segment']??'')===$key ? 'active' : '' ?>" onclick="selectSeg(this)">
        <input type="radio" name="segment" value="<?= $key ?>" style="display:none"
          <?= (!isset($_POST['segment']) && $key==='marketing') || ($_POST['segment']??'')===$key ? 'checked' : '' ?>>
        <?= $icon ?> <?= $label ?>
        <span class="seg-count"><?= $counts[$key] ?></span>
      </label>
      <?php endforeach; ?>
    </div>
    <p class="hint" style="margin-top:8px">⚠ "Всі юзери" — включає тих, хто не давав маркетингової згоди. Рекомендуємо "Підписники".</p>

    <!-- Режим -->
    <h2>Формат</h2>
    <div class="mode-tabs">
      <button type="button" class="mode-tab active" id="tab-html" onclick="setMode('html')">🎨 HTML Builder</button>
      <button type="button" class="mode-tab" id="tab-text" onclick="setMode('text')">📄 Простий текст</button>
    </div>
    <input type="hidden" name="mode" id="modeInput" value="html">

    <!-- Тема -->
    <div class="f-field">
      <label class="f-label">Тема листа</label>
      <input class="f-text" type="text" name="subject" placeholder="Наприклад: Нові можливості IndexFast — PRO за знижкою"
        value="<?= htmlspecialchars($_POST['subject'] ?? '') ?>">
    </div>

    <!-- HTML режим -->
    <div id="htmlMode">
      <div class="f-field">
        <label class="f-label">Контент листа (HTML)</label>
        <p class="hint" style="margin-bottom:8px">Змінні для персоналізації (клікніть щоб вставити):</p>
        <div class="vars">
          <span class="var-tag" onclick="insertVar('{{name}}')">{{name}}</span>
          <span class="var-tag" onclick="insertVar('{{email}}')">{{email}}</span>
          <span class="var-tag" onclick="insertVar('{{unsubscribe}}')">{{unsubscribe}}</span>
        </div>
        <textarea class="f-textarea" name="body_html" id="htmlEditor" style="margin-top:8px;min-height:280px"
          oninput="updatePreview()" placeholder="Вставте HTML або використайте блоки →"><?= htmlspecialchars($_POST['body_html'] ?? '') ?></textarea>
      </div>
    </div>

    <!-- Text режим -->
    <div id="textMode" style="display:none">
      <div class="f-field">
        <label class="f-label">Текст листа</label>
        <p class="hint" style="margin-bottom:8px">Підтримуються змінні: {{name}}, {{email}}</p>
        <textarea class="f-textarea" name="body_text" id="textEditor" style="min-height:280px"
          placeholder="Привіт, {{name}}!

Хочемо повідомити про...

З повагою,
Команда IndexFast"><?= htmlspecialchars($_POST['body_text'] ?? '') ?></textarea>
      </div>
    </div>

    <!-- Надіслати -->
    <!-- Тестова відправка -->
    <h2>Тестова відправка</h2>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px">
      <label class="f-label" style="margin-bottom:6px">Адреса для тесту</label>
      <div style="display:flex;gap:8px">
        <input type="email" name="test_email" id="testEmailInput" class="f-text"
          style="margin-bottom:0;flex:1;padding:8px 12px;font-size:.85rem"
          value="<?= htmlspecialchars($appEmail) ?>"
          placeholder="test@example.com">
        <button type="button" class="seg-btn"
          style="padding:0 16px;border-width:1px;color:var(--green);border-color:rgba(0,255,136,.3);white-space:nowrap"
          onclick="sendTest()">&#9993; Надіслати тест</button>
      </div>
      <p class="hint" style="margin-top:6px">Персоналізація: {{name}} → «Тестовий Користувач»</p>
    </div>

    <button class="send-btn" type="submit" name="send" value="1"
      onclick="return confirm('Надіслати листи ' + getRecipientCount() + ' отримувачам?')">
      ✉ Надіслати розсилку
    </button>
    <p class="hint" style="text-align:center">Відправка синхронна — для великих списків може зайняти час</p>
  </div>

  <!-- ══ ПРАВА ПАНЕЛЬ — Builder + Preview ══ -->
  <div class="right-panel">
    <h2>Блоки (клік — вставити)</h2>
    <div class="builder" style="margin-bottom:20px">

      <?php
      $blocks = [
        ['🎯 Заголовок',         '<h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#eeeef6">Ваш заголовок тут</h2>'],
        ['📝 Текст',             '<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#c8c8d8">Ваш текст тут. Привіт, {{name}}!</p>'],
        ['🟢 Кнопка CTA',       '<p style="text-align:center;margin:28px 0"><a href="https://indexfast.pro" style="background:#00ff88;color:#050508;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-family:sans-serif;font-size:15px">Спробувати →</a></p>'],
        ['📦 Блок з рамкою',    '<div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.15);border-radius:12px;padding:20px;margin:20px 0"><p style="margin:0;font-size:14px;color:#c8c8d8">Важлива інформація тут</p></div>'],
        ['⭐ Список переваг',   '<ul style="padding:0;list-style:none;margin:0 0 16px"><li style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#c8c8d8">✅ Перевага одна</li><li style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#c8c8d8">✅ Перевага два</li><li style="padding:8px 0;font-size:14px;color:#c8c8d8">✅ Перевага три</li></ul>'],
        ['💰 Ціна / Оффер',     '<div style="text-align:center;padding:24px;background:rgba(255,208,96,0.06);border:1px solid rgba(255,208,96,0.2);border-radius:14px;margin:20px 0"><div style="font-size:36px;font-weight:800;color:#ffd060">₴990</div><div style="font-size:13px;color:#888;margin-top:4px">на місяць</div></div>'],
        ['📊 Два стовпці',      '<table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td style="width:48%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;vertical-align:top"><strong style="color:#eeeef6">Колонка 1</strong><p style="margin:8px 0 0;font-size:13px;color:#888">Текст</p></td><td width="4%"></td><td style="width:48%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;vertical-align:top"><strong style="color:#eeeef6">Колонка 2</strong><p style="margin:8px 0 0;font-size:13px;color:#888">Текст</p></td></tr></table>'],
        ['🔗 Відписка',         '{{unsubscribe}}'],
        ['➖ Роздільник',       '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0">'],
      ];
      foreach ($blocks as [$label, $html]):
      ?>
      <button type="button" class="block-btn"
        onclick="insertBlock(<?= htmlspecialchars(json_encode($html), ENT_QUOTES, 'UTF-8') ?>)">
        <?= $label ?>
      </button>
      <?php endforeach; ?>
    </div>

    <h2>Попередній перегляд</h2>
    <iframe class="preview-frame" id="previewFrame" srcdoc=""></iframe>
  </div>

</div>
</form>

<script>
// ── Режими
function setMode(mode) {
  document.getElementById('modeInput').value = mode;
  document.getElementById('htmlMode').style.display = mode === 'html' ? 'block' : 'none';
  document.getElementById('textMode').style.display = mode === 'text' ? 'block' : 'none';
  document.getElementById('tab-html').classList.toggle('active', mode === 'html');
  document.getElementById('tab-text').classList.toggle('active', mode === 'text');
  if (mode === 'html') updatePreview();
}

// ── Сегменти
function selectSeg(el) {
  document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  el.querySelector('input').checked = true;
}

function getRecipientCount() {
  const active = document.querySelector('.seg-btn.active');
  return active ? active.querySelector('.seg-count').textContent : '?';
}

// ── Builder
function insertBlock(html) {
  const ta = document.getElementById('htmlEditor');
  const pos = ta.selectionEnd;
  ta.value = ta.value.slice(0, pos) + '\n' + html + '\n' + ta.value.slice(pos);
  updatePreview();
  ta.focus();
  ta.selectionEnd = pos + html.length + 2;
}

function insertVar(v) {
  const ta = document.getElementById('htmlEditor');
  const pos = ta.selectionEnd;
  ta.value = ta.value.slice(0, pos) + v + ta.value.slice(pos);
  updatePreview();
  ta.focus();
}

// ── Preview
// ── Preview

const previewTemplate = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:0;padding:12px;background:#0a0a10}</style></head><body style="background:#0a0a10"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="background:#111119;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;max-width:480px"><tr><td style="background:#050508;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.06)"><span style="font-size:18px;font-weight:800;color:#eeeef6">Index<span style="color:#00ff88">Fast</span></span></td></tr><tr><td style="padding:24px;font-size:14px;line-height:1.7;color:#c8c8d8">BODY_PLACEHOLDER</td></tr><tr><td style="padding:12px 24px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:#555570;text-align:center">© IndexFast</td></tr></table></td></tr></table></body></html>`;

function updatePreview() {
  const body = document.getElementById('htmlEditor').value
    .replace(/\{\{name\}\}/g, 'Іван')
    .replace(/\{\{email\}\}/g, 'ivan@example.com')
    .replace(/\{\{unsubscribe\}\}/g, '<p style="color:#555;font-size:11px;text-align:center"><a href="#" style="color:#555">Відписатись</a></p>');
  const html = previewTemplate.replace('BODY_PLACEHOLDER', body);
  document.getElementById('previewFrame').srcdoc = html;
}

// Ініціалізація
updatePreview();
document.getElementById('htmlEditor').addEventListener('input', updatePreview);

// ── Робота з шаблонами
const emailTemplates = <?= json_encode($templates) ?>;

function loadTemplate(id) {
  if (!id) return;
  const tpl = emailTemplates.find(t => t.id == id);
  if (!tpl) return;
  
  document.getElementsByName('subject')[0].value = tpl.subject;
  setMode(tpl.mode);
  
  if (tpl.mode === 'html') {
    document.getElementById('htmlEditor').value = tpl.body_html || '';
  } else {
    document.getElementById('textEditor').value = tpl.body_text || '';
  }
  
  // Також підставляємо назву в інпут для швидкого оновлення шаблону
  document.getElementById('tplNameInput').value = tpl.name;
  
  updatePreview();
}

function saveAsTemplate() {
  const name = document.getElementById('tplNameInput').value.trim();
  if (!name) {
    alert('Будь ласка, введіть назву шаблону');
    return;
  }
  
  const form = document.getElementById('mailForm');
  
  // Створюємо або оновлюємо приховані поля
  let actionInput = document.getElementById('formAction');
  if (!actionInput) {
    actionInput = document.createElement('input');
    actionInput.type = 'hidden';
    actionInput.name = 'action';
    actionInput.id = 'formAction';
    form.appendChild(actionInput);
  }
  actionInput.value = 'save_template';
  
  let nameInput = document.getElementById('formTemplateName');
  if (!nameInput) {
    nameInput = document.createElement('input');
    nameInput.type = 'hidden';
    nameInput.name = 'template_name';
    nameInput.id = 'formTemplateName';
    form.appendChild(nameInput);
  }
  nameInput.value = name;
  
  form.submit();
}

function deleteTemplate() {
  const select = document.getElementById('tplSelect');
  const id = select.value;
  if (!id) {
    alert('Оберіть шаблон для видалення');
    return;
  }
  const name = select.options[select.selectedIndex].text;
  if (!confirm('Ви впевнені, що хочете видалити шаблон "' + name + '"?')) {
    return;
  }
  
  const form = document.getElementById('mailForm');
  let actionInput = document.getElementById('formAction');
  if (!actionInput) {
    actionInput = document.createElement('input');
    actionInput.type = 'hidden';
    actionInput.name = 'action';
    actionInput.id = 'formAction';
    form.appendChild(actionInput);
  }
  actionInput.value = 'delete_template';
  
  let idInput = document.getElementById('formTemplateId');
  if (!idInput) {
    idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.name = 'template_id';
    idInput.id = 'formTemplateId';
    form.appendChild(idInput);
  }
  idInput.value = id;
  
  form.submit();
}

function sendTest() {
  const email = document.getElementById('testEmailInput').value.trim();
  if (!email) {
    alert('Вкажіть адресу для тестової відправки');
    return;
  }

  const form = document.getElementById('mailForm');

  // Додаємо прихований input send_test
  let testInput = document.getElementById('formSendTest');
  if (!testInput) {
    testInput = document.createElement('input');
    testInput.type = 'hidden';
    testInput.name = 'send_test';
    testInput.id = 'formSendTest';
    form.appendChild(testInput);
  }
  testInput.value = '1';

  // Переконуємося що test_email правильно потрапить у POST
  document.getElementById('testEmailInput').name = 'test_email';

  // Прибираємо send_test після submit, щоб повторний submit не плутав
  form.submit();
}
</script>

</body></html>
