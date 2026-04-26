<?php
require_once __DIR__ . '/auth.php';

$msg = $msgType = '';
$sent_count = 0;

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

    case 'pro':
        $where .= " AND plan='pro'";
        break;

    case 'agency':
        $where .= " AND plan IN ('agency','enterprise')";
        break;
}
    $recipients = DB::all("SELECT id, email, name FROM users WHERE $where ORDER BY id ASC", $params);

    if (empty($recipients)) {
        $msg = 'Немає отримувачів за вибраним сегментом';
        $msgType = 'err';
        goto render;
    }

    // Додаємо unsubscribe footer
    $unsubBase = APP_URL . '/app/profile'; // fallback

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
    'all'       => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1")['c'],
    'marketing' => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND marketing_consent=1")['c'],
    'pro'       => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND plan='pro'")['c'],
    'agency'    => (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1 AND email_verified=1 AND plan IN ('agency','enterprise')")['c'],
];
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

    <!-- Сегмент -->
    <h2>Отримувачі</h2>
    <div class="segments">
      <?php
      $segs = [
        'all'       => ['Всі юзери',     '📬'],
        'marketing' => ['Підписники',    '✅'],
        'pro'       => ['PRO план',      '⚡'],
        'agency'    => ['Agency/Ent.',   '🏢'],
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
        ['🟢 Кнопка CTA',       '<p style="text-align:center;margin:28px 0"><a href="https://indexfast.pp.ua" style="background:#00ff88;color:#050508;padding:13px 28px;border-radius:100px;text-decoration:none;font-weight:700;font-family:sans-serif;font-size:15px">Спробувати →</a></p>'],
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
</script>

</body></html>
