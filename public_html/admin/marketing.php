<?php
require_once __DIR__ . '/auth.php';

// ── CSV експорт
if (isset($_GET['export'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="indexfast_subscribers_' . date('Y-m-d') . '.csv"');
    $fh = fopen('php://output', 'w');
    fprintf($fh, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM
    fputcsv($fh, ['Email','Ім\'я','Прізвище','План','Дата реєстрації','Дата підписки']);
    $rows = DB::all(
        "SELECT email, name, surname, plan, created_at, updated_at
         FROM users WHERE marketing_consent=1 AND is_active=1
         ORDER BY created_at DESC"
    );
    foreach ($rows as $r)
        fputcsv($fh, [$r['email'],$r['name'],$r['surname'],$r['plan'],$r['created_at'],$r['updated_at']]);
    fclose($fh);
    exit;
}

// ── Дані
$page   = max(1,(int)($_GET['p']??1));
$limit  = 25; $offset = ($page-1)*$limit;
$total  = (int)DB::row("SELECT COUNT(*) c FROM users WHERE marketing_consent=1 AND is_active=1")['c'];
$users  = DB::all(
    "SELECT id, name, surname, email, plan, created_at
     FROM users WHERE marketing_consent=1 AND is_active=1
     ORDER BY id DESC LIMIT ? OFFSET ?",
    [$limit, $offset]
);
$pages = ceil($total/$limit);

// По планах серед підписників
$byPlan = DB::all(
    "SELECT plan, COUNT(*) c FROM users WHERE marketing_consent=1 AND is_active=1 GROUP BY plan"
);
?>
<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8">
<style><?php readfile(__DIR__.'/shared.css'); ?></style></head><body class="sub">

<!-- Заголовок -->
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
  <div>
    <div class="section-title">Маркетингова розсилка</div>
    <div style="font-size:1.4rem;font-weight:800">
      <?= $total ?>
      <span style="font-size:.8rem;color:var(--muted);font-weight:400">підписників</span>
    </div>
  </div>
  <a href="?export=1" style="background:var(--green);color:var(--black);border:none;border-radius:10px;padding:10px 20px;font-weight:700;font-size:.85rem;text-decoration:none;cursor:pointer">
    ⬇ Експорт CSV
  </a>
</div>

<!-- Розподіл по планах -->
<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
  <?php foreach ($byPlan as $p):
    $cls = match($p['plan']){'pro'=>'badge-green','agency'=>'badge-gold','enterprise'=>'badge-purple',default=>'badge-muted'};
  ?>
  <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px 18px">
    <span class="badge <?= $cls ?>"><?= $p['plan'] ?></span>
    <span style="font-weight:700;font-size:1.1rem;margin-left:8px"><?= $p['c'] ?></span>
  </div>
  <?php endforeach; ?>
</div>

<div class="alert alert-warn" style="margin-bottom:16px">
  📋 Для відправки листів — завантажте CSV і використайте зовнішній сервіс (Mailchimp, SendGrid, eSputnik тощо).
  Кожен лист має містити посилання для відписки.
</div>

<!-- Таблиця -->
<div class="table-wrap">
<table>
  <thead><tr><th>ID</th><th>Ім'я</th><th>Email</th><th>План</th><th>Дата реєстрації</th></tr></thead>
  <tbody>
  <?php foreach ($users as $u):
    $cls = match($u['plan']){'pro'=>'badge-green','agency'=>'badge-gold','enterprise'=>'badge-purple',default=>'badge-muted'};
  ?>
  <tr>
    <td style="color:var(--muted)">#<?= $u['id'] ?></td>
    <td><?= htmlspecialchars(trim($u['name'].' '.$u['surname'])) ?: '—' ?></td>
    <td style="font-family:monospace;font-size:.75rem"><?= htmlspecialchars($u['email']) ?></td>
    <td><span class="badge <?= $cls ?>"><?= $u['plan'] ?></span></td>
    <td style="color:var(--muted);font-size:.75rem"><?= date('d.m.Y', strtotime($u['created_at'])) ?></td>
  </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</div>

<?php if ($pages>1): ?>
<div class="pagination">
  <?php for ($i=1;$i<=$pages;$i++): ?>
  <a class="pag-btn <?= $i===$page?'active':'' ?>" href="?p=<?= $i ?>"><?= $i ?></a>
  <?php endfor; ?>
</div>
<?php endif; ?>

</body></html>
