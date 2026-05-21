<?php
// ══════════════════════════════════════════════
//  IndexFast Admin Panel
//  Захист: IP whitelist + session password
// ══════════════════════════════════════════════
require_once dirname(__DIR__) . '/api/config.php';
require_once dirname(__DIR__) . '/api/db.php';

session_start();

// ── Константи адмінки
define('ADMIN_PASS',   env('ADMIN_PASSWORD', 'change_me_admin'));
define('ADMIN_IPS',    array_filter(array_map('trim',
    explode(',', env('ADMIN_IPS', ''))
)));

// ── IP захист
function checkIP(): void {
    if (empty(ADMIN_IPS)) return; // якщо не задано — пропускаємо
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP']    // Cloudflare
       ?? $_SERVER['HTTP_X_FORWARDED_FOR']
       ?? $_SERVER['REMOTE_ADDR']
       ?? '';
    $ip = trim(explode(',', $ip)[0]);
    if (!in_array($ip, ADMIN_IPS, true)) {
        http_response_code(403);
        die('Access denied.');
    }
}

checkIP();

// ── Авторизація
$error = '';
if (isset($_POST['password'])) {
    if (hash_equals(ADMIN_PASS, $_POST['password'])) {
        $_SESSION['admin_auth'] = true;
        $_SESSION['admin_ip']   = $_SERVER['REMOTE_ADDR'];
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    }
    $error = 'Невірний пароль';
}
if (isset($_POST['logout'])) {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

$authed = !empty($_SESSION['admin_auth']);

// ── Статистика для головної
$stats = [];
if ($authed) {
    try {
        $stats['users_total']   = (int)DB::row("SELECT COUNT(*) c FROM users")['c'];
        $stats['users_active']  = (int)DB::row("SELECT COUNT(*) c FROM users WHERE is_active=1")['c'];
        $stats['users_today']   = (int)DB::row("SELECT COUNT(*) c FROM users WHERE DATE(created_at)=CURDATE()")['c'];
        $stats['users_week']    = (int)DB::row("SELECT COUNT(*) c FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")['c'];
        $stats['sites_total']   = (int)DB::row("SELECT COUNT(*) c FROM sites")['c'];
        $stats['jobs_pending']  = (int)DB::row("SELECT COUNT(*) c FROM jobs WHERE status='pending'")['c'];
        $stats['jobs_today']    = (int)DB::row("SELECT COUNT(*) c FROM jobs WHERE DATE(created_at)=CURDATE()")['c'];
        $stats['urls_today']    = (int)(DB::row("SELECT SUM(sent) s FROM jobs WHERE DATE(created_at)=CURDATE()")['s'] ?? 0);
        $stats['urls_month']    = (int)(DB::row("SELECT SUM(sent) s FROM jobs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")['s'] ?? 0);
        $stats['marketing']     = (int)DB::row("SELECT COUNT(*) c FROM users WHERE marketing_consent=1")['c'];

        // По планах
        $plans = DB::all("SELECT plan, COUNT(*) c FROM users GROUP BY plan ORDER BY c DESC");
        $stats['by_plan'] = $plans;

        // Активність за 7 днів
        $stats['daily'] = DB::all(
            "SELECT DATE(created_at) d, COUNT(*) c FROM users
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 DAY)
             GROUP BY DATE(created_at) ORDER BY d"
        );

        // Останні юзери
        $stats['last_users'] = DB::all(
            "SELECT id, name, email, plan, is_active, created_at FROM users
             ORDER BY id DESC LIMIT 8"
        );

        // Зависші jobs
        $stats['stuck_jobs'] = DB::all(
            "SELECT j.id, j.status, j.attempts, j.started_at, s.domain, u.email
             FROM jobs j
             JOIN sites s ON s.id=j.site_id
             JOIN users u ON u.id=j.user_id
             WHERE j.status='processing'
               AND j.started_at < DATE_SUB(NOW(), INTERVAL 10 MINUTE)
             ORDER BY j.started_at ASC LIMIT 5"
        );
    } catch (Throwable $e) {
        $stats['error'] = $e->getMessage();
    }
}

// ── Кольори і стилі
$G = '#00ff88'; $R = '#ff4d6d'; $Y = '#ffd060'; $M = '#9370db';
?>
<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin — IndexFast</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --black: #050508; --dark: #0a0a10; --card: #0f0f18;
  --card2: #141420; --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.12);
  --green: <?= $G ?>; --red: <?= $R ?>; --gold: <?= $Y ?>; --purple: <?= $M ?>;
  --white: #f0f0f8; --muted: #6a6a85;
  --font: 'system-ui', -apple-system, sans-serif;
}
html { font-size: 14px; }
body { background: var(--black); color: var(--white); font-family: var(--font); line-height: 1.5; }

/* ── Auth */
.auth-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; }
.auth-box { background:var(--card); border:1px solid var(--border2); border-radius:20px; padding:40px; width:360px; }
.auth-logo { font-size:1.5rem; font-weight:800; letter-spacing:-.04em; margin-bottom:32px; text-align:center; }
.auth-logo span { color:var(--green); }
.auth-label { display:block; font-size:.7rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
.auth-input { width:100%; background:var(--dark); border:1px solid var(--border2); border-radius:10px; padding:11px 14px; color:var(--white); font-size:.9rem; outline:none; }
.auth-input:focus { border-color:rgba(0,255,136,.4); }
.auth-btn { width:100%; background:var(--green); color:var(--black); border:none; border-radius:10px; padding:12px; font-weight:700; font-size:.9rem; cursor:pointer; margin-top:20px; }
.auth-err { color:var(--red); font-size:.8rem; margin-top:10px; text-align:center; }

/* ── Layout */
.layout { display:flex; min-height:100vh; }

/* ── Sidebar */
.sidebar { width:220px; flex-shrink:0; background:var(--dark); border-right:1px solid var(--border); position:fixed; top:0; left:0; bottom:0; display:flex; flex-direction:column; z-index:50; }
.sidebar-logo { padding:20px 16px 16px; border-bottom:1px solid var(--border); font-weight:800; font-size:1.1rem; letter-spacing:-.03em; }
.sidebar-logo span { color:var(--green); }
.sidebar-badge { font-size:.55rem; background:rgba(255,77,109,.15); color:var(--red); border:1px solid rgba(255,77,109,.3); border-radius:4px; padding:1px 5px; vertical-align:middle; margin-left:4px; font-weight:700; letter-spacing:.05em; }
nav.sidebar-nav { flex:1; padding:12px 8px; overflow-y:auto; }
.nav-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px; color:var(--muted); text-decoration:none; font-size:.875rem; transition:all .15s; margin-bottom:2px; cursor:pointer; border:none; background:transparent; width:100%; }
.nav-item:hover { background:rgba(255,255,255,.04); color:var(--white); }
.nav-item.active { background:rgba(0,255,136,.08); color:var(--green); }
.nav-item .icon { width:18px; text-align:center; font-size:1rem; }
.sidebar-footer { padding:12px 8px; border-top:1px solid var(--border); }

/* ── Main */
.main { margin-left:220px; flex:1; display:flex; flex-direction:column; }
.topbar { height:56px; padding:0 28px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border); background:rgba(5,5,8,.9); backdrop-filter:blur(12px); position:sticky; top:0; z-index:40; }
.topbar-title { font-weight:700; font-size:1rem; }
.topbar-right { display:flex; align-items:center; gap:12px; font-size:.8rem; color:var(--muted); }
.content { padding:28px; }

/* ── Cards */
.stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; margin-bottom:24px; }
.stat-card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:20px; }
.stat-card .label { font-size:.7rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
.stat-card .value { font-size:2rem; font-weight:800; letter-spacing:-.03em; }
.stat-card .sub { font-size:.75rem; color:var(--muted); margin-top:4px; }

/* ── Table */
.table-wrap { background:var(--card); border:1px solid var(--border); border-radius:14px; overflow:hidden; margin-bottom:24px; }
.table-head { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); }
.table-head h3 { font-weight:700; font-size:.9rem; }
.table-head a { font-size:.75rem; color:var(--green); text-decoration:none; }
table { width:100%; border-collapse:collapse; font-size:.8rem; }
th { padding:10px 16px; text-align:left; color:var(--muted); font-size:.65rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; background:rgba(255,255,255,.02); }
td { padding:11px 16px; border-top:1px solid var(--border); }
tr:hover td { background:rgba(255,255,255,.015); }

/* ── Badges */
.badge { display:inline-block; font-size:.65rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; padding:2px 8px; border-radius:100px; }
.badge-green { background:rgba(0,255,136,.1); color:var(--green); border:1px solid rgba(0,255,136,.2); }
.badge-red { background:rgba(255,77,109,.1); color:var(--red); border:1px solid rgba(255,77,109,.2); }
.badge-gold { background:rgba(255,208,96,.1); color:var(--gold); border:1px solid rgba(255,208,96,.2); }
.badge-purple { background:rgba(147,112,219,.1); color:var(--purple); border:1px solid rgba(147,112,219,.2); }
.badge-muted { background:rgba(255,255,255,.06); color:var(--muted); border:1px solid rgba(255,255,255,.08); }

/* ── Plan colors */
.plan-start { color:var(--muted); }
.plan-pro { color:var(--green); }
.plan-agency { color:var(--gold); }
.plan-enterprise { color:var(--purple); }

/* ── Sections */
.page { display:none; }
.page.active { display:block; }

/* ── Chart */
.bar-chart { display:flex; align-items:flex-end; gap:8px; height:80px; padding:0 4px; }
.bar-item { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
.bar { background:rgba(0,255,136,.3); border-radius:3px 3px 0 0; width:100%; min-height:4px; transition:background .2s; }
.bar:hover { background:var(--green); }
.bar-label { font-size:.6rem; color:var(--muted); }

/* ── Two columns */
.two-col { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
@media(max-width:1100px) { .two-col { grid-template-columns:1fr; } }

/* ── Alert */
.alert { padding:12px 16px; border-radius:10px; font-size:.8rem; margin-bottom:16px; }
.alert-warn { background:rgba(255,208,96,.08); border:1px solid rgba(255,208,96,.2); color:var(--gold); }
.alert-err  { background:rgba(255,77,109,.08);  border:1px solid rgba(255,77,109,.2);  color:var(--red); }
</style>
</head>
<body>

<?php if (!$authed): ?>
<!-- ══ LOGIN ══ -->
<div class="auth-screen">
  <div class="auth-box">
    <div class="auth-logo">Index<span>Fast</span> <span style="font-size:.6rem;color:var(--muted)">Admin</span></div>
    <form method="POST">
      <label class="auth-label">Пароль адміністратора</label>
      <input class="auth-input" type="password" name="password" autofocus placeholder="••••••••">
      <button class="auth-btn" type="submit">Увійти</button>
      <?php if ($error): ?><p class="auth-err"><?= htmlspecialchars($error) ?></p><?php endif; ?>
    </form>
  </div>
</div>

<?php else: ?>
<!-- ══ ADMIN PANEL ══ -->
<div class="layout">

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-logo">
      Index<span>Fast</span>
      <span class="sidebar-badge">ADMIN</span>
    </div>
    <nav class="sidebar-nav">
      <a class="nav-item active" onclick="showPage('dashboard',this)">
        <span class="icon">◈</span> Огляд
      </a>
      <a class="nav-item" onclick="showPage('users',this)">
        <span class="icon">👥</span> Користувачі
      </a>
      <a class="nav-item" onclick="showPage('jobs',this)">
        <span class="icon">⚙️</span> Черга / Jobs
      </a>
      <a class="nav-item" onclick="showPage('marketing',this)">
        <span class="icon">📧</span> Підписники
      </a>
      <a class="nav-item" onclick="showPage('payments',this)">
        <span class="icon">💳</span> Платежі
      </a>
      <a class="nav-item" href="send_email.php" target="_blank"
        style="color:var(--green);border:1px solid rgba(0,255,136,0.2)">
        <span class="icon">✉</span> Відправити лист
      </a>
      <a class="nav-item" onclick="showPage('system',this)">
        <span class="icon">🛡</span> Система
      </a>
    </nav>
    <div class="sidebar-footer">
      <form method="POST">
        <button class="nav-item" type="submit" name="logout" value="1"
          style="color:var(--red)">
          <span class="icon">↩</span> Вийти
        </button>
      </form>
    </div>
  </aside>

  <!-- Main -->
  <div class="main">
    <div class="topbar">
      <span class="topbar-title" id="page-title">Огляд</span>
      <div class="topbar-right">
        <span><?= date('d.m.Y H:i') ?></span>
        <span style="color:var(--green)">● Online</span>
      </div>
    </div>

    <div class="content">

      <?php if (!empty($stats['error'])): ?>
      <div class="alert alert-err">⚠ DB помилка: <?= htmlspecialchars($stats['error']) ?></div>
      <?php endif; ?>

      <!-- ══ DASHBOARD ══ -->
      <div class="page active" id="page-dashboard">

        <!-- Stat cards -->
        <div class="stat-grid">
          <div class="stat-card">
            <div class="label">Всього юзерів</div>
            <div class="value"><?= number_format($stats['users_total']) ?></div>
            <div class="sub">+<?= $stats['users_week'] ?> за тиждень</div>
          </div>
          <div class="stat-card">
            <div class="label">Активних сьогодні</div>
            <div class="value" style="color:var(--green)"><?= $stats['users_today'] ?></div>
            <div class="sub">нових реєстрацій</div>
          </div>
          <div class="stat-card">
            <div class="label">URL сьогодні</div>
            <div class="value" style="color:var(--gold)"><?= number_format($stats['urls_today']) ?></div>
            <div class="sub"><?= number_format($stats['urls_month']) ?> за місяць</div>
          </div>
          <div class="stat-card">
            <div class="label">Сайтів</div>
            <div class="value"><?= $stats['sites_total'] ?></div>
            <div class="sub"><?= $stats['jobs_pending'] ?> jobs в черзі</div>
          </div>
          <div class="stat-card">
            <div class="label">Маркетинг згода</div>
            <div class="value" style="color:var(--purple)"><?= $stats['marketing'] ?></div>
            <div class="sub">підписників</div>
          </div>
        </div>

        <div class="two-col">
          <!-- По планах -->
          <div class="table-wrap">
            <div class="table-head"><h3>Розподіл по планах</h3></div>
            <table>
              <thead><tr><th>План</th><th>Юзерів</th><th>%</th></tr></thead>
              <tbody>
              <?php foreach ($stats['by_plan'] as $p):
                $pct = $stats['users_total'] > 0 ? round($p['c']/$stats['users_total']*100) : 0;
                $cls = match($p['plan']) { 'pro'=>'badge-green','agency'=>'badge-gold','enterprise'=>'badge-purple', default=>'badge-muted' };
              ?>
              <tr>
                <td><span class="badge <?= $cls ?>"><?= $p['plan'] ?></span></td>
                <td style="font-weight:700"><?= $p['c'] ?></td>
                <td style="color:var(--muted)"><?= $pct ?>%</td>
              </tr>
              <?php endforeach; ?>
              </tbody>
            </table>
          </div>

          <!-- Реєстрації за 7 днів -->
          <div class="table-wrap">
            <div class="table-head"><h3>Реєстрації за 7 днів</h3></div>
            <?php
            $days = []; $today = new DateTime();
            for ($i=6;$i>=0;$i--) {
                $d = (clone $today)->modify("-{$i} days")->format('Y-m-d');
                $days[$d] = 0;
            }
            foreach ($stats['daily'] as $r) $days[$r['d']] = (int)$r['c'];
            $maxDay = max(array_values($days)) ?: 1;
            ?>
            <div style="padding:16px 20px">
              <div class="bar-chart">
                <?php foreach ($days as $d=>$c):
                  $h = max(4, round($c/$maxDay*70));
                  $label = date('d.m', strtotime($d));
                ?>
                <div class="bar-item">
                  <div title="<?= $c ?> юзерів" class="bar" style="height:<?= $h ?>px"></div>
                  <div class="bar-label"><?= $label ?></div>
                </div>
                <?php endforeach; ?>
              </div>
            </div>
          </div>
        </div>

        <!-- Останні юзери -->
        <div class="table-wrap">
          <div class="table-head">
            <h3>Останні реєстрації</h3>
            <a onclick="showPage('users',document.querySelectorAll('.nav-item')[1])">Всі →</a>
          </div>
          <table>
            <thead><tr><th>ID</th><th>Ім'я</th><th>Email</th><th>План</th><th>Статус</th><th>Дата</th></tr></thead>
            <tbody>
            <?php foreach ($stats['last_users'] as $u): ?>
            <tr>
              <td style="color:var(--muted)">#<?= $u['id'] ?></td>
              <td><?= htmlspecialchars($u['name'] ?: '—') ?></td>
              <td style="font-family:monospace;font-size:.75rem"><?= htmlspecialchars($u['email']) ?></td>
              <td><span class="badge <?= match($u['plan']){ 'pro'=>'badge-green','agency'=>'badge-gold','enterprise'=>'badge-purple',default=>'badge-muted' } ?>"><?= $u['plan'] ?></span></td>
              <td><?= $u['is_active'] ? '<span class="badge badge-green">Active</span>' : '<span class="badge badge-red">Blocked</span>' ?></td>
              <td style="color:var(--muted);font-size:.75rem"><?= date('d.m.Y H:i', strtotime($u['created_at'])) ?></td>
            </tr>
            <?php endforeach; ?>
            </tbody>
          </table>
        </div>

        <!-- Зависші jobs -->
        <?php if (!empty($stats['stuck_jobs'])): ?>
        <div class="alert alert-warn">⚠ Є зависші jobs (processing > 10 хв)</div>
        <div class="table-wrap">
          <div class="table-head"><h3>🔴 Зависші Jobs</h3></div>
          <table>
            <thead><tr><th>Job</th><th>Сайт</th><th>Юзер</th><th>Спроб</th><th>Почато</th></tr></thead>
            <tbody>
            <?php foreach ($stats['stuck_jobs'] as $j): ?>
            <tr>
              <td>#<?= $j['id'] ?></td>
              <td><?= htmlspecialchars($j['domain']) ?></td>
              <td style="font-size:.75rem;font-family:monospace"><?= htmlspecialchars($j['email']) ?></td>
              <td><?= $j['attempts'] ?></td>
              <td style="color:var(--red);font-size:.75rem"><?= $j['started_at'] ?></td>
            </tr>
            <?php endforeach; ?>
            </tbody>
          </table>
        </div>
        <?php endif; ?>

      </div><!-- /dashboard -->


      <!-- ══ USERS ══ -->
      <div class="page" id="page-users">
        <iframe src="users.php" style="width:100%;height:calc(100vh - 100px);border:none;background:transparent" id="users-frame"></iframe>
      </div>

      <!-- ══ JOBS ══ -->
      <div class="page" id="page-jobs">
        <iframe src="jobs.php" style="width:100%;height:calc(100vh - 100px);border:none;background:transparent" id="jobs-frame"></iframe>
      </div>

      <!-- ══ MARKETING ══ -->
      <div class="page" id="page-marketing">
        <iframe src="marketing.php" style="width:100%;height:calc(100vh - 100px);border:none;background:transparent" id="marketing-frame"></iframe>
      </div>

      <!-- ══ PAYMENTS ══ -->
      <div class="page" id="page-payments">
        <iframe src="payments.php" style="width:100%;height:calc(100vh - 100px);border:none;background:transparent" id="payments-frame"></iframe>
      </div>

      <!-- ══ SYSTEM ══ -->
      <div class="page" id="page-system">
        <iframe src="system.php" style="width:100%;height:calc(100vh - 100px);border:none;background:transparent" id="system-frame"></iframe>
      </div>

    </div><!-- /content -->
  </div><!-- /main -->
</div><!-- /layout -->

<script>
const titles = { dashboard:'Огляд', users:'Користувачі', jobs:'Черга / Jobs', marketing:'Розсилка', payments:'Платежі', system:'Система' };

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');
  document.getElementById('page-title').textContent = titles[id] || id;
}
</script>

<?php endif; ?>
</body>
</html>
