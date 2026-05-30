<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IndexFast — Платежі</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--bg:#050508;--s:#111119;--b:rgba(255,255,255,.08);--t:#eeeef6;--m:#888898;--a:#00ff88;--d:#ff4455;--w:#ffd060;--r:14px}
    body{background:var(--bg);color:var(--t);font-family:Inter,system-ui,sans-serif;font-size:13px;min-height:100vh}
    a{color:inherit;text-decoration:none}

    /* Layout */
    .wrap{padding:24px 20px}
    .page-title{font-size:20px;font-weight:800;margin-bottom:24px;display:flex;align-items:center;gap:10px}
    .page-title a{color:var(--m);font-size:13px;font-weight:400}

    /* Tabs */
    .tabs{display:flex;gap:3px;background:rgba(255,255,255,.04);border-radius:12px;padding:4px;margin-bottom:20px;width:fit-content}
    .tab{padding:7px 16px;border-radius:9px;font-size:13px;font-weight:500;border:none;background:none;color:var(--m);cursor:pointer;transition:.15s}
    .tab.on{background:var(--a);color:#050508;font-weight:700}

    /* Stats */
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:20px}
    .stat{background:var(--s);border:1px solid var(--b);border-radius:var(--r);padding:16px}
    .stat-v{font-size:26px;font-weight:800}
    .stat-l{font-size:11px;color:var(--m);margin-top:3px}

    /* Card */
    .card{background:var(--s);border:1px solid var(--b);border-radius:var(--r);padding:20px;margin-bottom:16px}
    .card-title{font-size:14px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px}

    /* Table */
    .tbl-wrap{overflow-x:auto;margin:0 -20px}
    table{width:100%;border-collapse:collapse;min-width:600px}
    th{padding:9px 16px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--m);border-bottom:1px solid var(--b)}
    td{padding:11px 16px;border-bottom:1px solid var(--b);vertical-align:middle}
    tr:last-child td{border-bottom:none}
    tr:hover td{background:rgba(255,255,255,.015)}

    /* Buttons */
    .btn{display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:9px;font-size:12px;font-weight:600;border:none;cursor:pointer;transition:.15s}
    .btn-ok{background:var(--a);color:#050508}.btn-ok:hover{background:#00e07a}
    .btn-no{background:rgba(255,68,85,.12);color:var(--d);border:1px solid rgba(255,68,85,.25)}.btn-no:hover{background:rgba(255,68,85,.2)}
    .btn-ghost{background:rgba(255,255,255,.06);color:var(--t)}.btn-ghost:hover{background:rgba(255,255,255,.1)}
    .btn:disabled{opacity:.45;pointer-events:none}

    /* Badge */
    .badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:100px;font-size:11px;font-weight:600}
    .b-ok{background:rgba(0,255,136,.1);color:var(--a)}
    .b-warn{background:rgba(255,208,96,.1);color:var(--w)}
    .b-err{background:rgba(255,68,85,.1);color:var(--d)}
    .b-muted{background:rgba(255,255,255,.05);color:var(--m)}

    /* Filter */
    .filters{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
    .filters input,.filters select{background:rgba(255,255,255,.05);border:1px solid var(--b);border-radius:9px;padding:7px 12px;color:var(--t);font-size:12px;outline:none;flex:1;min-width:140px}
    .filters input:focus,.filters select:focus{border-color:rgba(0,255,136,.35)}

    /* Modal */
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:50;display:flex;align-items:center;justify-content:center;padding:16px}
    .modal{background:var(--s);border:1px solid var(--b);border-radius:var(--r);padding:24px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto}
    .modal-title{font-size:15px;font-weight:700;margin-bottom:16px}
    label{display:block;font-size:11px;color:var(--m);margin-bottom:4px}
    textarea,input[type=text]{width:100%;background:rgba(255,255,255,.05);border:1px solid var(--b);border-radius:9px;padding:8px 12px;color:var(--t);font-size:13px;outline:none;resize:vertical}
    textarea:focus,input[type=text]:focus{border-color:rgba(0,255,136,.35)}
    .form-gap{margin-bottom:12px}

    /* Alert */
    .alert{padding:10px 14px;border-radius:10px;font-size:12px;margin-bottom:14px}
    .alert-ok{background:rgba(0,255,136,.08);border:1px solid rgba(0,255,136,.25);color:#4fffaa}
    .alert-err{background:rgba(255,68,85,.08);border:1px solid rgba(255,68,85,.25);color:#ff8899}

    /* Receipt thumb */
    .thumb{width:40px;height:40px;object-fit:cover;border-radius:6px;border:1px solid var(--b);cursor:pointer;vertical-align:middle}

    /* Lightbox */
    #lb{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:100;display:none;align-items:center;justify-content:center;cursor:zoom-out}
    #lb img{max-width:90vw;max-height:90vh;border-radius:10px}

    /* Empty */
    .empty{text-align:center;padding:40px;color:var(--m)}

    /* Responsive */
    @media(max-width:600px){.stats{grid-template-columns:1fr 1fr}.tab{padding:6px 10px;font-size:12px}}
  </style>
</head>
<body>
<div class="wrap">
  <div class="page-title">
    💳 Платежі
    <a href="/admin/">← Адмінка</a>
  </div>

  <!-- Tabs -->
  <div class="tabs">
    <button class="tab on"  onclick="switchTab('manual',this)">Ручні платежі</button>
    <button class="tab"     onclick="switchTab('subs',this)">Підписки</button>
    <button class="tab"     onclick="switchTab('hooks',this)">Webhook логи</button>
    <button class="tab"     onclick="switchTab('settings',this)">Налаштування методів</button>
  </div>

  <div id="alert-global"></div>

  <!-- Panels -->
  <div id="panel-manual"></div>
  <div id="panel-subs"     style="display:none"></div>
  <div id="panel-hooks"    style="display:none"></div>
  <div id="panel-settings" style="display:none"></div>
</div>

<!-- Confirm modal -->
<div class="overlay" id="modal" style="display:none">
  <div class="modal">
    <div class="modal-title" id="modal-title"></div>
    <div class="form-gap" id="modal-info"></div>
    <div class="form-gap">
      <label>Примітка адміністратора</label>
      <textarea id="modal-notes" rows="3" placeholder="Причина, коментар…"></textarea>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ok"    id="modal-ok"  onclick="doConfirm()">Підтвердити</button>
      <button class="btn btn-ghost"               onclick="closeModal()">Скасувати</button>
    </div>
  </div>
</div>

<!-- Lightbox -->
<div id="lb" onclick="this.style.display='none'"><img id="lb-img" src=""></div>

<script>
// ── current tab state
let currentTab  = 'manual';
let pendingAct  = null;

// ── API helper (uses existing admin session cookie)
async function api(url) {
  const r = await fetch(url, { credentials: 'same-origin' });
  if (r.status === 401) { location.href = '/admin/'; return null; }
  return r.json().catch(() => null);
}

async function apiPost(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (r.status === 401) { location.href = '/admin/'; return null; }
  return r.json().catch(() => null);
}

// ── Tab switch
function switchTab(name, btn) {
  currentTab = name;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
  ['manual','subs','hooks','settings'].forEach(n => {
    document.getElementById('panel-'+n).style.display = n===name ? '' : 'none';
  });
  if (name==='manual') loadManual();
  if (name==='subs')   loadSubs();
  if (name==='hooks')  loadHooks();
  if (name==='settings') loadSettings();
}

// ════════════════════════════════════════
//  PANEL: Ручні платежі
// ════════════════════════════════════════
async function loadManual() {
  const el = document.getElementById('panel-manual');
  el.innerHTML = '<div style="color:var(--m);padding:20px">Завантаження…</div>';

  const data = await api('/admin/api/manual_payments.php');
  if (!data) return;

  const all       = data.requests || [];
  const pending   = all.filter(r => r.status === 'pending');
  const processed = all.filter(r => r.status !== 'pending');

  el.innerHTML = `
    <div class="stats">
      <div class="stat"><div class="stat-v" style="color:var(--w)">${pending.length}</div><div class="stat-l">Очікують</div></div>
      <div class="stat"><div class="stat-v" style="color:var(--a)">${all.filter(r=>r.status==='confirmed').length}</div><div class="stat-l">Підтверджено</div></div>
      <div class="stat"><div class="stat-v" style="color:var(--d)">${all.filter(r=>r.status==='rejected').length}</div><div class="stat-l">Відхилено</div></div>
      <div class="stat"><div class="stat-v">${all.length}</div><div class="stat-l">Всього</div></div>
    </div>
    <div id="manual-alert"></div>
    ${manualCard('⏳ Очікують підтвердження', pending, true)}
    ${processed.length ? manualCard('Оброблені', processed, false) : ''}
  `;
}

function manualCard(title, rows, actions) {
  if (!rows.length && actions) return `<div class="card"><div class="card-title">${title} <span class="badge b-ok">0</span></div><div class="empty">✅ Немає нових заявок</div></div>`;
  if (!rows.length) return '';
  return `
    <div class="card">
      <div class="card-title">${title} <span class="badge ${actions?'b-warn':'b-muted'}">${rows.length}</span></div>
      <div class="tbl-wrap"><table>
        <thead><tr>
          <th>#</th><th>Email</th><th>Тариф</th><th>Сума</th><th>Квитанція</th><th>Примітка</th><th>Дата</th><th>Статус</th>
          ${actions ? '<th>Дії</th>' : '<th>Підтвердив</th>'}
        </tr></thead>
        <tbody>${rows.map(r => `
          <tr>
            <td style="color:var(--m)">#${r.id}</td>
            <td><strong>${r.user_email}</strong></td>
            <td><span style="color:var(--a);font-weight:700">${(r.plan_id||'').toUpperCase()}</span> · ${r.period==='year'?'рік':'міс'}</td>
            <td>${r.amount ? '₴'+Number(r.amount).toLocaleString('uk-UA') : '—'}</td>
            <td>${(() => {
              if (!r.receipt_url) return '<span style="color:var(--m)">—</span>';
              const isPdf = r.receipt_url.toLowerCase().endsWith('.pdf');
              if (isPdf) {
                return `<a href="${r.receipt_url}" target="_blank" class="badge b-warn" style="padding:4px 8px;border-radius:6px;" title="Відкрити PDF в новій вкладці">📄 PDF</a>`;
              }
              return `<img src="${r.receipt_url}" class="thumb" onclick="openLb('${r.receipt_url}')" title="Переглянути">`;
            })()}</td>
            <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--m)">${r.notes||'—'}</td>
            <td style="color:var(--m)">${fmtDate(r.created_at)}</td>
            <td>${badge(r.status)}</td>
            <td>${actions
              ? `<div style="display:flex;gap:6px">
                   <button class="btn btn-ok" onclick="openModal('confirm',${r.id},'${r.user_email}','${r.plan_id}')">✓</button>
                   <button class="btn btn-no" onclick="openModal('reject',${r.id},'${r.user_email}','${r.plan_id}')">✗</button>
                 </div>`
              : `<span style="color:var(--m);font-size:11px">${r.confirmed_by||'—'}</span>`
            }</td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </div>`;
}

// ════════════════════════════════════════
//  PANEL: Підписки
// ════════════════════════════════════════
async function loadSubs() {
  const el = document.getElementById('panel-subs');
  el.innerHTML = '<div style="color:var(--m);padding:20px">Завантаження…</div>';

  const data = await api('/admin/api/subscriptions.php');
  if (!data) return;

  const subs  = data.subscriptions || [];
  const st    = data.stats || {};

  el.innerHTML = `
    <div class="stats">
      <div class="stat"><div class="stat-v" style="color:var(--a)">${st.active||0}</div><div class="stat-l">Активні</div></div>
      <div class="stat"><div class="stat-v" style="color:var(--w)">${st.pending||0}</div><div class="stat-l">Очікують</div></div>
      <div class="stat"><div class="stat-v" style="color:var(--m)">${st.expired||0}</div><div class="stat-l">Завершені</div></div>
      <div class="stat"><div class="stat-v">${st.total||0}</div><div class="stat-l">Всього</div></div>
      <div class="stat"><div class="stat-v" style="color:var(--a)">₴${Number(st.month_revenue||0).toLocaleString('uk-UA')}</div><div class="stat-l">Дохід (міс)</div></div>
    </div>
    <div class="card">
      <div class="card-title">Підписки</div>
      <div class="filters">
        <input type="text" placeholder="Пошук за email…" oninput="filterRows('subs-body',this.value,0)" style="max-width:220px">
        <select onchange="filterByStatus('subs-body',this.value)">
          <option value="">Всі статуси</option>
          <option value="paid">✅ Активні</option>
          <option value="pending">⏳ Очікують</option>
          <option value="expired">🔴 Завершені</option>
          <option value="cancelled">⚪ Скасовані</option>
          <option value="awaiting_manual_confirmation">💳 Ручна оплата</option>
        </select>
      </div>
      <div class="tbl-wrap"><table>
        <thead><tr>
          <th>#</th><th>Email</th><th>Тариф</th><th>Метод</th><th>Period</th><th>Початок</th><th>Кінець</th><th>Статус</th><th>Сума</th>
        </tr></thead>
        <tbody id="subs-body">
          ${subs.map(s=>`
            <tr data-email="${(s.email||'').toLowerCase()}" data-status="${s.status}">
              <td style="color:var(--m)">#${s.id}</td>
              <td>${s.email||'—'}</td>
              <td><span style="color:var(--a);font-weight:700">${(s.plan_id||'').toUpperCase()}</span></td>
              <td><span style="font-size:11px;background:rgba(255,255,255,.06);padding:2px 6px;border-radius:5px">${s.payment_method}</span></td>
              <td>${s.period==='year'?'Рік':'Місяць'}</td>
              <td style="color:var(--m)">${fmtDate(s.start_at)}</td>
              <td style="color:${expiringSoon(s.end_at)?'var(--w)':'var(--m)'}">${s.end_at?fmtDate(s.end_at):'∞'}</td>
              <td>${badge(s.status)}</td>
              <td>${s.amount?'₴'+Number(s.amount).toLocaleString('uk-UA'):'—'}</td>
            </tr>`).join('')}
        </tbody>
      </table></div>
    </div>`;
}

// ════════════════════════════════════════
//  PANEL: Webhook logs
// ════════════════════════════════════════
async function loadHooks() {
  const el = document.getElementById('panel-hooks');
  el.innerHTML = '<div style="color:var(--m);padding:20px">Завантаження…</div>';

  const data = await api('/admin/api/webhook_logs.php');
  if (!data) return;

  const logs = data.logs || [];
  el.innerHTML = `
    <div class="card">
      <div class="card-title">🔔 Webhook логи <span class="badge b-muted">${logs.length}</span></div>
      <div class="filters">
        <select onchange="filterByAttr('hooks-body','provider',this.value)">
          <option value="">Всі провайдери</option>
          <option>stripe</option><option>paddle</option><option>paypal</option><option>liqpay</option><option>monobank</option>
        </select>
        <select onchange="filterByStatus('hooks-body',this.value)">
          <option value="">Всі статуси</option>
          <option>received</option><option>processed</option><option>failed</option><option>ignored</option>
        </select>
      </div>
      <div class="tbl-wrap"><table>
        <thead><tr><th>#</th><th>Провайдер</th><th>Подія</th><th>External ID</th><th>Статус</th><th>IP</th><th>Час</th><th>Помилка</th></tr></thead>
        <tbody id="hooks-body">
          ${logs.map(l=>`
            <tr data-status="${l.status}" data-provider="${l.provider}">
              <td style="color:var(--m)">#${l.id}</td>
              <td><span style="font-size:11px;background:rgba(255,255,255,.06);padding:2px 6px;border-radius:5px">${l.provider}</span></td>
              <td style="font-size:11px;color:var(--m)">${l.event_type||'—'}</td>
              <td style="font-family:monospace;font-size:10px;color:var(--m)">${(l.external_id||'—').substring(0,22)}</td>
              <td>${badge(l.status)}</td>
              <td style="font-size:11px;color:var(--m)">${l.ip||'—'}</td>
              <td style="font-size:11px;color:var(--m)">${fmtDateTime(l.created_at)}</td>
              <td style="color:var(--d);font-size:11px;max-width:160px;overflow:hidden;text-overflow:ellipsis">${l.error||''}</td>
            </tr>`).join('')}
        </tbody>
      </table></div>
    </div>`;
}

// ════════════════════════════════════════
//  Modal
// ════════════════════════════════════════
function openModal(action, id, email, plan) {
  pendingAct = { action, id };
  document.getElementById('modal-title').textContent = action==='confirm' ? '✅ Підтвердити платіж' : '✗ Відхилити платіж';
  document.getElementById('modal-info').innerHTML    = `<p style="color:var(--m)">Заявка <strong style="color:var(--t)">#${id}</strong> — ${email} (${(plan||'').toUpperCase()})</p>`;
  document.getElementById('modal-notes').value       = '';
  document.getElementById('modal').style.display     = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  pendingAct = null;
}

async function doConfirm() {
  if (!pendingAct) return;
  const btn = document.getElementById('modal-ok');
  btn.disabled = true; btn.textContent = '…';

  const res = await apiPost('/api/billing/admin/confirm_manual.php', {
    request_id:  pendingAct.id,
    action:      pendingAct.action,
    admin_notes: document.getElementById('modal-notes').value,
  });

  closeModal();
  const el = document.getElementById('manual-alert');
  if (el) {
    el.innerHTML = (res?.status==='ok')
      ? `<div class="alert alert-ok">${res.message||'Виконано'}</div>`
      : `<div class="alert alert-err">${res?.error||'Помилка'}</div>`;
  }
  await loadManual();
}

// ════════════════════════════════════════
//  Filter helpers
// ════════════════════════════════════════
function filterRows(tbodyId, q, colIdx) {
  q = q.toLowerCase();
  document.querySelectorAll('#'+tbodyId+' tr').forEach(tr => {
    const cells = tr.querySelectorAll('td');
    const match = !q || (cells[colIdx]?.textContent||'').toLowerCase().includes(q);
    tr.style.display = match ? '' : 'none';
  });
}

function filterByStatus(tbodyId, val) {
  document.querySelectorAll('#'+tbodyId+' tr').forEach(tr => {
    tr.style.display = (!val || tr.dataset.status===val) ? '' : 'none';
  });
}

function filterByAttr(tbodyId, attr, val) {
  document.querySelectorAll('#'+tbodyId+' tr').forEach(tr => {
    tr.style.display = (!val || tr.dataset[attr]===val) ? '' : 'none';
  });
}

// ════════════════════════════════════════
//  Helpers
// ════════════════════════════════════════
function badge(s) {
  const map = {
    paid:                         ['b-ok',   '✅ Активна'],
    confirmed:                    ['b-ok',   '✅ Підтверджено'],
    pending:                      ['b-warn', '⏳ Очікує'],
    awaiting_manual_confirmation: ['b-warn', '⏳ Очікує підтв.'],
    failed:                       ['b-err',  '❌ Відхилено'],
    rejected:                     ['b-err',  '✗ Відхилено'],
    expired:                      ['b-muted','🔴 Завершено'],
    cancelled:                    ['b-muted','⚪ Скасовано'],
    refunded:                     ['b-warn', '↩ Повернено'],
    processed:                    ['b-ok',   '✓ Оброблено'],
    received:                     ['b-muted','📥 Отримано'],
    ignored:                      ['b-muted','— Ігнор'],
  };
  const [cls,label] = map[s] || ['b-muted', s];
  return `<span class="badge ${cls}">${label}</span>`;
}

function fmtDate(d)     { return d ? new Date(d).toLocaleDateString('uk-UA') : '—'; }
function fmtDateTime(d) { return d ? new Date(d).toLocaleString('uk-UA',{dateStyle:'short',timeStyle:'short'}) : '—'; }
function expiringSoon(d){ return d && (new Date(d)-new Date()) < 7*86400*1000; }

function openLb(url) {
  document.getElementById('lb-img').src = url;
  document.getElementById('lb').style.display = 'flex';
}

// ════════════════════════════════════════
//  PANEL: Налаштування методів
// ════════════════════════════════════════
async function loadSettings() {
  const el = document.getElementById('panel-settings');
  el.innerHTML = '<div style="color:var(--m);padding:20px">Завантаження…</div>';

  const data = await api('/admin/api/payment_methods.php');
  if (!data) return;

  const methods = data.methods || [];

  el.innerHTML = `
    <div class="card">
      <div class="card-title">⚙️ Управління платіжними методами</div>
      <p style="color:var(--m);margin-bottom:16px;font-size:12px;line-height:1.5">
        Тут ви можете вмикати або вимикати платіжні системи для клієнтів на сайті. 
        Платіжні системи, які не налаштовані у файлі конфігурації <code style="background:rgba(255,255,255,0.06);padding:2px 5px;border-radius:4px;color:var(--t)">.env</code>, не можуть бути активовані, щоб уникнути помилок при оплаті.
      </p>
      <div class="tbl-wrap"><table>
        <thead><tr>
          <th>Метод оплати</th><th>ID</th><th>Конфігурація (.env)</th><th>Статус</th><th>Дія</th>
        </tr></thead>
        <tbody>${methods.map(m => {
          let confBadge = m.configured 
            ? '<span class="badge b-ok">Налаштовано ✓</span>' 
            : '<span class="badge b-err">Не налаштовано —</span>';
            
          let statusBadge = m.enabled && m.configured
            ? '<span class="badge b-ok" style="font-weight:700">АКТИВНИЙ</span>'
            : '<span class="badge b-muted">ВИМКНЕНИЙ</span>';

          let btnText = m.enabled ? 'Вимкнути' : 'Увімкнути';
          let btnClass = m.enabled ? 'btn-no' : 'btn-ok';
          let isBtnDisabled = !m.configured ? 'disabled' : '';

          return `
            <tr>
              <td><strong>${m.label}</strong></td>
              <td style="font-family:monospace;color:var(--m)">${m.id}</td>
              <td>${confBadge}</td>
              <td>${statusBadge}</td>
              <td>
                <button class="btn ${btnClass}" ${isBtnDisabled} onclick="toggleMethod('${m.id}', ${m.enabled ? 0 : 1})">
                  ${btnText}
                </button>
              </td>
            </tr>`;
        }).join('')}</tbody>
      </table></div>
    </div>`;
}

async function toggleMethod(providerId, enabled) {
  const res = await apiPost('/admin/api/payment_methods.php', {
    provider_id: providerId,
    enabled: enabled
  });
  if (res && res.status === 'ok') {
    loadSettings();
  } else {
    alert('Помилка при зміні статусу платіжного методу');
  }
}

// ── Init
loadManual();
</script>
</body>
</html>
