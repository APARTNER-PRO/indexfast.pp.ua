<?php
require_once __DIR__ . '/auth.php';

// ── Дії
$msg = $msgType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $userId = (int)($_POST['user_id'] ?? 0);
    $action = $_POST['action'];

    try {
        match($action) {
            'block'   => DB::exec("UPDATE users SET is_active=0 WHERE id=?", [$userId]),
            'unblock' => DB::exec("UPDATE users SET is_active=1 WHERE id=?", [$userId]),
            'verify'  => DB::exec("UPDATE users SET email_verified=1 WHERE id=?", [$userId]),
            'plan'    => DB::exec("UPDATE users SET plan=? WHERE id=?",
                            [in_array($_POST['plan'],['start','pro','agency','enterprise']) ? $_POST['plan'] : 'start', $userId]),
            default   => throw new Exception('Невідома дія'),
        };
        $msg = 'Збережено';
        $msgType = 'ok';
    } catch (Throwable $e) {
        $msg = $e->getMessage();
        $msgType = 'err';
    }
}

// ── Фільтри
$search = trim($_GET['q'] ?? '');
$planF  = $_GET['plan'] ?? '';
$page   = max(1, (int)($_GET['p'] ?? 1));
$limit  = 20;
$offset = ($page - 1) * $limit;

$where  = ['1=1'];
$params = [];
if ($search) { $where[] = "(email LIKE ? OR name LIKE ?)"; $params[] = "%$search%"; $params[] = "%$search%"; }
if ($planF)  { $where[] = "plan=?"; $params[] = $planF; }
$whereSQL = implode(' AND ', $where);

$total = (int)DB::row("SELECT COUNT(*) c FROM users WHERE $whereSQL", $params)['c'];
$users = DB::all(
    "SELECT id, name, surname, email, plan, is_active, email_verified,
            marketing_consent, created_at, last_login_at
     FROM users WHERE $whereSQL ORDER BY id DESC LIMIT ? OFFSET ?",
    array_merge($params, [$limit, $offset])
);
$pages = ceil($total / $limit);

function planBadge(string $p): string {
    $cls = match($p) { 'pro'=>'badge-green','agency'=>'badge-gold','enterprise'=>'badge-purple',default=>'badge-muted' };
    return "<span class=\"badge $cls\">$p</span>";
}
?>
<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8">
<style>
<?php readfile(__DIR__ . '/shared.css'); ?>
</style></head><body class="sub">

<?php if ($msg): ?>
<div class="alert <?= $msgType==='ok' ? 'alert-ok' : 'alert-err' ?>"><?= htmlspecialchars($msg) ?></div>
<?php endif; ?>

<!-- Фільтри -->
<form class="filters" method="GET">
  <input class="f-input" type="search" name="q" placeholder="🔍 Email або ім'я..." value="<?= htmlspecialchars($search) ?>">
  <select class="f-select" name="plan">
    <option value="">Всі плани</option>
    <?php foreach (['start','pro','agency','enterprise'] as $pl): ?>
    <option <?= $planF===$pl?'selected':'' ?> value="<?= $pl ?>"><?= ucfirst($pl) ?></option>
    <?php endforeach; ?>
  </select>
  <button class="f-btn" type="submit">Знайти</button>
  <?php if ($search||$planF): ?>
  <a class="f-clear" href="users.php">✕ Очистити</a>
  <?php endif; ?>
  <span class="f-total"><?= $total ?> юзерів</span>
</form>

<!-- Таблиця -->
<div class="table-wrap">
<table>
  <thead>
    <tr>
      <th>ID</th><th>Ім'я</th><th>Email</th><th>План</th>
      <th>Email ✓</th><th>Маркетинг</th><th>Статус</th>
      <th>Реєстрація</th><th>Last login</th><th>Дії</th>
    </tr>
  </thead>
  <tbody>
  <?php foreach ($users as $u): ?>
  <tr>
    <td style="color:var(--muted)">#<?= $u['id'] ?></td>
    <td><?= htmlspecialchars(trim($u['name'].' '.$u['surname'])) ?: '<span style="color:var(--muted)">—</span>' ?></td>
    <td style="font-family:monospace;font-size:.75rem"><?= htmlspecialchars($u['email']) ?></td>
    <td>
      <?= planBadge($u['plan']) ?>
      <!-- Зміна плану -->
      <form method="POST" style="display:inline-block;margin-left:4px">
        <input type="hidden" name="action" value="plan">
        <input type="hidden" name="user_id" value="<?= $u['id'] ?>">
        <select name="plan" class="mini-select" onchange="this.form.submit()">
          <?php foreach (['start','pro','agency','enterprise'] as $pl): ?>
          <option <?= $u['plan']===$pl?'selected':'' ?> value="<?= $pl ?>"><?= ucfirst($pl) ?></option>
          <?php endforeach; ?>
        </select>
      </form>
    </td>
    <td><?= $u['email_verified'] ? '✅' : '❌' ?>
      <?php if (!$u['email_verified']): ?>
      <form method="POST" style="display:inline">
        <input type="hidden" name="action" value="verify">
        <input type="hidden" name="user_id" value="<?= $u['id'] ?>">
        <button class="mini-btn" type="submit">Підтвердити</button>
      </form>
      <?php endif; ?>
    </td>
    <td><?= $u['marketing_consent'] ? '<span style="color:var(--green)">✓</span>' : '<span style="color:var(--muted)">—</span>' ?></td>
    <td><?= $u['is_active'] ? '<span class="badge badge-green">Active</span>' : '<span class="badge badge-red">Blocked</span>' ?></td>
    <td style="font-size:.7rem;color:var(--muted)"><?= $u['created_at'] ? date('d.m.y', strtotime($u['created_at'])) : '—' ?></td>
    <td style="font-size:.7rem;color:var(--muted)"><?= $u['last_login_at'] ? date('d.m.y H:i', strtotime($u['last_login_at'])) : '—' ?></td>
    <td>
      <form method="POST" style="display:inline">
        <input type="hidden" name="user_id" value="<?= $u['id'] ?>">
        <?php if ($u['is_active']): ?>
        <input type="hidden" name="action" value="block">
        <button class="action-btn danger" type="submit" onclick="return confirm('Заблокувати?')">Блок</button>
        <?php else: ?>
        <input type="hidden" name="action" value="unblock">
        <button class="action-btn ok" type="submit">Розблок</button>
        <?php endif; ?>
      </form>
    </td>
  </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</div>

<!-- Пагінація -->
<?php if ($pages > 1): ?>
<div class="pagination">
  <?php for ($i=1; $i<=$pages; $i++): ?>
  <a class="pag-btn <?= $i===$page?'active':'' ?>"
     href="?q=<?= urlencode($search) ?>&plan=<?= urlencode($planF) ?>&p=<?= $i ?>">
    <?= $i ?>
  </a>
  <?php endfor; ?>
</div>
<?php endif; ?>

</body></html>
