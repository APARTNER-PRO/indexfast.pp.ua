<?php
require_once __DIR__ . '/auth.php';

$msg = $msgType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    try {
        match($action) {
            'clear_rate_limits' => DB::exec("DELETE FROM rate_limits"),
            'clear_old_tokens'  => DB::exec("DELETE FROM tokens WHERE (used_at IS NOT NULL OR expires_at < NOW()) AND type != 'refresh'"),
            'clear_old_logs'    => DB::exec("DELETE FROM indexing_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)"),
            default => null,
        };
        $msg = 'Виконано'; $msgType = 'ok';
    } catch (Throwable $e) { $msg = $e->getMessage(); $msgType = 'err'; }
}

// ── Системна інфо
$info = [
    'PHP версія'             => PHP_VERSION,
    'APP_ENV'                => APP_ENV,
    'APP_URL'                => APP_URL,
    'DB_HOST'                => DB_HOST,
    'DB_NAME'                => DB_NAME,
    'JWT_SECRET задано'      => JWT_SECRET !== 'CHANGE_ME_USE_STRONG_RANDOM_STRING_32+' ? '✅ Так' : '❌ НІ — змініть!',
    'SMTP_HOST'              => env('SMTP_HOST', '—'),
    'GOOGLE_CLIENT_ID'       => GOOGLE_CLIENT_ID ? '✅ Є' : '❌ Не задано',
];

// ── Таблиці
$tables = DB::all(
    "SELECT TABLE_NAME t,
            TABLE_ROWS r,
            ROUND((DATA_LENGTH+INDEX_LENGTH)/1024/1024,2) mb
     FROM information_schema.TABLES
     WHERE TABLE_SCHEMA=DATABASE()
     ORDER BY DATA_LENGTH+INDEX_LENGTH DESC"
);

// ── Lock файл
$lockFile = sys_get_temp_dir() . '/indexfast_worker.lock';
$lockInfo = file_exists($lockFile)
    ? 'Є, вік: ' . round((time()-filemtime($lockFile))) . 'с'
    : 'Немає (нормально)';
$lockStale = file_exists($lockFile) && (time()-filemtime($lockFile)) > 70;

// ── Rate limits
$rateLimits = (int)DB::row("SELECT COUNT(*) c FROM rate_limits")['c'];
$tokens     = (int)DB::row("SELECT COUNT(*) c FROM tokens WHERE used_at IS NULL AND expires_at > NOW()")['c'];
$oldLogs    = (int)(DB::row("SELECT COUNT(*) c FROM indexing_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)")['c'] ?? 0);
?>
<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8">
<style><?php readfile(__DIR__.'/shared.css'); ?></style></head><body class="sub">

<?php if ($msg): ?>
<div class="alert alert-<?= $msgType==='ok'?'ok':'err' ?>"><?= htmlspecialchars($msg) ?></div>
<?php endif; ?>
<?php if ($lockStale): ?>
<div class="alert alert-warn">⚠ Worker lock файл старий (<?= round((time()-filemtime($lockFile))) ?>с) — можливо worker завис.<br>
  <code style="font-size:.75rem">rm <?= htmlspecialchars($lockFile) ?></code>
</div>
<?php endif; ?>
<?php if (JWT_SECRET === 'CHANGE_ME_USE_STRONG_RANDOM_STRING_32+'): ?>
<div class="alert" style="background:rgba(255,77,109,.12);border:1px solid rgba(255,77,109,.3);color:var(--red)">
  🚨 <strong>КРИТИЧНО:</strong> JWT_SECRET не змінено! Встановіть унікальний секрет в .env
</div>
<?php endif; ?>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">

  <!-- Конфіг -->
  <div>
    <div class="section-title">Конфігурація</div>
    <div class="table-wrap">
    <table>
      <tbody>
      <?php foreach ($info as $k=>$v): ?>
      <tr>
        <td style="color:var(--muted);width:50%"><?= htmlspecialchars($k) ?></td>
        <td style="font-family:monospace;font-size:.75rem"><?= htmlspecialchars($v) ?></td>
      </tr>
      <?php endforeach; ?>
      <tr>
        <td style="color:var(--muted)">Worker lock</td>
        <td style="font-size:.75rem;color:<?= $lockStale?'var(--red)':'var(--muted)' ?>"><?= $lockInfo ?></td>
      </tr>
      </tbody>
    </table>
    </div>
  </div>

  <!-- Таблиці -->
  <div>
    <div class="section-title">Таблиці БД</div>
    <div class="table-wrap">
    <table>
      <thead><tr><th>Таблиця</th><th>Рядків</th><th>MB</th></tr></thead>
      <tbody>
      <?php foreach ($tables as $t): ?>
      <tr>
        <td style="font-family:monospace;font-size:.75rem"><?= $t['t'] ?></td>
        <td><?= number_format($t['r']) ?></td>
        <td style="color:var(--muted)"><?= $t['mb'] ?></td>
      </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
    </div>
  </div>
</div>

<!-- Обслуговування -->
<div class="section-title">Обслуговування</div>
<div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px">

  <div class="table-wrap" style="flex:1;min-width:200px">
    <table><tbody>
    <tr><td style="color:var(--muted)">Rate limit записів</td>
        <td style="font-weight:700"><?= $rateLimits ?></td></tr>
    <tr><td style="color:var(--muted)">Активних токенів</td>
        <td><?= $tokens ?></td></tr>
    <tr><td style="color:var(--muted)">Старих логів (90+ днів)</td>
        <td style="color:<?= $oldLogs>0?'var(--gold)':'var(--muted)' ?>"><?= number_format($oldLogs) ?></td></tr>
    </tbody></table>
  </div>

  <div style="display:flex;flex-direction:column;gap:10px">
    <form method="POST">
      <input type="hidden" name="action" value="clear_rate_limits">
      <button class="action-btn warn" type="submit">🔄 Очистити rate limits (<?= $rateLimits ?>)</button>
    </form>
    <form method="POST">
      <input type="hidden" name="action" value="clear_old_tokens">
      <button class="action-btn warn" type="submit">🗑 Очистити прострочені токени</button>
    </form>
    <?php if ($oldLogs > 0): ?>
    <form method="POST">
      <input type="hidden" name="action" value="clear_old_logs">
      <button class="action-btn danger" type="submit"
        onclick="return confirm('Видалити <?= number_format($oldLogs) ?> старих логів?')">
        🗑 Очистити логи 90+ днів
      </button>
    </form>
    <?php endif; ?>
  </div>
</div>

</body></html>
