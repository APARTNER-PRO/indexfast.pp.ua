<?php
require_once __DIR__ . '/auth.php';

$msg = $msgType = '';

// ── Дії
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jobId  = (int)($_POST['job_id'] ?? 0);
    $action = $_POST['action'] ?? '';
    try {
        match($action) {
            'cancel' => DB::exec(
                "UPDATE jobs SET status='failed', last_error='Скасовано адміном', finished_at=NOW() WHERE id=? AND status IN ('pending','processing')",
                [$jobId]
            ),
            'reset_stuck' => DB::exec(
                "UPDATE jobs SET status='pending', started_at=NULL, attempts=0
                 WHERE status='processing' AND started_at < DATE_SUB(NOW(), INTERVAL 10 MINUTE)"
            ),
            'clear_failed' => DB::exec(
                "DELETE FROM jobs WHERE status='failed' AND finished_at < DATE_SUB(NOW(), INTERVAL 7 DAY)"
            ),
            default => null,
        };
        $msg = 'Виконано'; $msgType = 'ok';
    } catch (Throwable $e) { $msg = $e->getMessage(); $msgType = 'err'; }
}

// ── Дані
$statusF = $_GET['s'] ?? '';
$page    = max(1, (int)($_GET['p'] ?? 1));
$limit   = 25; $offset = ($page-1)*$limit;

$where = $statusF ? "WHERE j.status=?" : "WHERE 1=1";
$params = $statusF ? [$statusF] : [];

$total = (int)DB::row("SELECT COUNT(*) c FROM jobs j $where", $params)['c'];
$jobs  = DB::all(
    "SELECT j.id, j.status, j.total, j.sent, j.failed, j.attempts, j.max_attempts,
            j.priority, j.last_error, j.created_at, j.started_at, j.finished_at,
            s.domain, u.email
     FROM jobs j
     JOIN sites s ON s.id=j.site_id
     JOIN users u ON u.id=j.user_id
     $where ORDER BY j.id DESC LIMIT ? OFFSET ?",
    array_merge($params, [$limit, $offset])
);
$pages = ceil($total/$limit);

// Лічильники по статусах
$counts = [];
foreach (DB::all("SELECT status, COUNT(*) c FROM jobs GROUP BY status") as $r)
    $counts[$r['status']] = $r['c'];

$stuck = (int)DB::row(
    "SELECT COUNT(*) c FROM jobs WHERE status='processing' AND started_at < DATE_SUB(NOW(), INTERVAL 10 MINUTE)"
)['c'];
?>
<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8">
<style><?php readfile(__DIR__.'/shared.css'); ?></style></head><body class="sub">

<?php if ($msg): ?>
<div class="alert alert-<?= $msgType==='ok'?'ok':'err' ?>"><?= htmlspecialchars($msg) ?></div>
<?php endif; ?>
<?php if ($stuck): ?>
<div class="alert alert-warn">
  ⚠ <?= $stuck ?> завислих jobs (processing > 10 хв)
  <form method="POST" style="display:inline;margin-left:12px">
    <input type="hidden" name="action" value="reset_stuck">
    <button class="mini-btn" type="submit">Скинути всі</button>
  </form>
</div>
<?php endif; ?>

<!-- Статус фільтри -->
<div class="filters">
  <?php
  $statuses = [''=> 'Всі', 'pending'=>'Pending','processing'=>'Processing','done'=>'Done','failed'=>'Failed'];
  foreach ($statuses as $s=>$l):
    $cnt = $s ? ($counts[$s]??0) : array_sum($counts);
    $active = $statusF===$s ? 'style="color:var(--green);border-color:rgba(0,255,136,.3)"' : '';
  ?>
  <a class="pag-btn <?= $statusF===$s?'active':'' ?>"
     href="?s=<?= urlencode($s) ?>"><?= $l ?> (<?= $cnt ?>)</a>
  <?php endforeach; ?>
  <span class="f-total"><?= $total ?> jobs</span>

  <!-- Bulk actions -->
  <form method="POST" style="margin-left:auto">
    <input type="hidden" name="action" value="clear_failed">
    <button class="action-btn danger" type="submit"
      onclick="return confirm('Видалити failed jobs старші 7 днів?')">
      🗑 Очистити failed
    </button>
  </form>
</div>

<div class="table-wrap">
<table>
  <thead><tr>
    <th>ID</th><th>Сайт</th><th>Юзер</th><th>Статус</th>
    <th>URLs</th><th>Прогрес</th><th>Спроб</th>
    <th>Пріоритет</th><th>Помилка</th><th>Час</th><th>Дія</th>
  </tr></thead>
  <tbody>
  <?php foreach ($jobs as $j):
    $pct = $j['total']>0 ? round(($j['sent']+$j['failed'])/$j['total']*100) : 0;
    $statCls = match($j['status']) {
      'done'=>'badge-green','failed'=>'badge-red',
      'processing'=>'badge-gold','pending'=>'badge-muted', default=>'badge-muted'
    };
    $ts = $j['finished_at'] ?? $j['started_at'] ?? $j['created_at'];
  ?>
  <tr>
    <td style="color:var(--muted)">#<?= $j['id'] ?></td>
    <td style="font-weight:600"><?= htmlspecialchars($j['domain']) ?></td>
    <td style="font-size:.7rem;font-family:monospace"><?= htmlspecialchars($j['email']) ?></td>
    <td><span class="badge <?= $statCls ?>"><?= $j['status'] ?></span></td>
    <td><?= $j['sent'] ?>/<span style="color:var(--muted)"><?= $j['total'] ?></span>
        <?php if ($j['failed']): ?><span style="color:var(--red);font-size:.7rem"> (<?= $j['failed'] ?> err)</span><?php endif; ?>
    </td>
    <td>
      <div style="background:rgba(255,255,255,.06);border-radius:3px;height:6px;width:80px">
        <div style="background:<?= $j['status']==='failed'?'var(--red)':'var(--green)' ?>;height:100%;width:<?= $pct ?>%;border-radius:3px"></div>
      </div>
      <span style="font-size:.65rem;color:var(--muted)"><?= $pct ?>%</span>
    </td>
    <td style="color:<?= $j['attempts']>=$j['max_attempts']?'var(--red)':'var(--white)' ?>">
      <?= $j['attempts'] ?>/<?= $j['max_attempts'] ?>
    </td>
    <td style="color:var(--muted)"><?= $j['priority'] ?></td>
    <td style="font-size:.7rem;color:var(--red);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
        title="<?= htmlspecialchars($j['last_error']??'') ?>">
      <?= htmlspecialchars($j['last_error'] ? mb_substr($j['last_error'],0,40).'…' : '—') ?>
    </td>
    <td style="font-size:.7rem;color:var(--muted);white-space:nowrap"><?= $ts ? date('d.m H:i', strtotime($ts)) : '—' ?></td>
    <td>
      <?php if (in_array($j['status'],['pending','processing'])): ?>
      <form method="POST" style="display:inline">
        <input type="hidden" name="action" value="cancel">
        <input type="hidden" name="job_id" value="<?= $j['id'] ?>">
        <button class="action-btn danger" type="submit" onclick="return confirm('Скасувати?')">✕</button>
      </form>
      <?php else: ?>
      <span style="color:var(--muted)">—</span>
      <?php endif; ?>
    </td>
  </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</div>

<?php if ($pages>1): ?>
<div class="pagination">
  <?php for ($i=1;$i<=$pages;$i++): ?>
  <a class="pag-btn <?= $i===$page?'active':'' ?>" href="?s=<?= urlencode($statusF) ?>&p=<?= $i ?>"><?= $i ?></a>
  <?php endfor; ?>
</div>
<?php endif; ?>

</body></html>
