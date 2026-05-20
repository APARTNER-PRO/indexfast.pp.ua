// frontend/src/pages/Billing.jsx
// Крос-доменна підтримка: всі запити ідуть через BASE = VITE_API_URL ?? "/api"
// FormData (квитанція) теж використовує BASE, не хардкодений "/api"
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api/client';

// BASE — той самий що в client.js, щоб FormData запит теж йшов на правильний домен
const BASE = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : '/api';

const PLAN_LABELS   = { pro: 'PRO', agency: 'Агенція', enterprise: 'Enterprise', start: 'Старт' };
const PERIOD_LABELS = { month: 'місяць', year: 'рік' };

const PaymentIcon = ({ id }) => {
  if (id === 'stripe')   return <span className="font-bold text-[#635BFF] text-sm">Stripe</span>;
  if (id === 'paddle')   return <span className="font-bold text-[#00D4FF] text-sm">Paddle</span>;
  if (id === 'paypal')   return <span className="font-bold text-[#009CDE] text-sm">PayPal</span>;
  if (id === 'liqpay')   return <span className="font-bold text-[#00AAFF] text-sm">LiqPay</span>;
  if (id === 'monobank') return <span className="font-bold text-sm">🏦 Monobank</span>;
  // bank / manual
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"
            strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default function Billing() {
  const [data,        setData]       = useState(null);
  const [loading,     setLoading]    = useState(true);
  const [error,       setError]      = useState('');
  const [success,     setSuccess]    = useState('');
  const [busy,        setBusy]       = useState(false);

  // Крок: 'plan' | 'method' | 'manual' | 'done'
  const [step,        setStep]       = useState('plan');
  const [selPlan,     setSelPlan]    = useState('pro');
  const [selPeriod,   setSelPeriod]  = useState('month');
  const [selMethod,   setSelMethod]  = useState('');

  // Manual transfer
  const [manualSubId, setManualSubId] = useState(null);
  const [receipt,     setReceipt]     = useState(null);
  const [notes,       setNotes]       = useState('');
  const [manualDone,  setManualDone]  = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/billing/subscription.php');
      setData(res);
      if (res?.payment_methods?.count === 1) {
        setSelMethod(res.payment_methods.methods[0].id);
      }
    } catch (e) {
      setError(e.message || 'Помилка завантаження');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const goNext = () => {
    setError('');
    const pm = data?.payment_methods;
    if (!pm || pm.count === 0) { setError('Методи оплати недоступні'); return; }
    if (pm.count === 1) {
      startPayment(pm.methods[0].id);
    } else {
      setStep('method');
    }
  };

  const startPayment = async (methodId) => {
    const meth = methodId || selMethod;
    if (!meth) return;
    setBusy(true);
    setError('');
    try {
      const res = await apiFetch('/billing/checkout.php', {
        method: 'POST',
        body:   { plan_id: selPlan, period: selPeriod, payment_method: meth },
      });

      if (meth === 'manual') {
        setManualSubId(res.sub_id);
        setStep('manual');
      } else if (res.redirect_url) {
        window.location.href = res.redirect_url;
      } else if (res.extra && res.extra.method === 'form_post') {
        // LiqPay — POST форма
        const f = document.createElement('form');
        f.method = 'POST';
        f.action = res.extra.form_action;
        f.target = '_blank';
        ['data', 'signature'].forEach(k => {
          const inp   = document.createElement('input');
          inp.type    = 'hidden';
          inp.name    = k;
          inp.value   = res.extra[k];
          f.appendChild(inp);
        });
        document.body.appendChild(f);
        f.submit();
        document.body.removeChild(f);
      } else {
        setError('Непідтримуваний метод');
      }
    } catch (e) {
      setError(e.message || 'Помилка оплати');
    } finally {
      setBusy(false);
    }
  };

  // FormData запит — використовує BASE (VITE_API_URL) для крос-доменної підтримки
  const sendReceipt = async () => {
    if (!receipt && !notes) {
      setError('Прикріпіть квитанцію або вкажіть примітку');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('sub_id', manualSubId);
      formData.append('notes',  notes);
      if (receipt) formData.append('receipt', receipt);

      const token = localStorage.getItem('access_token');
      const headers = {};
      if (token) headers['Authorization'] = 'Bearer ' + token;

      // BASE замість хардкоду '/api' — підтримка різних доменів
      const res = await fetch(BASE + '/billing/manual_receipt.php', {
        method:  'POST',
        headers: headers,
        // НЕ додаємо Content-Type — браузер сам виставить multipart/form-data з boundary
        body:    formData,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || 'HTTP ' + res.status);
      setManualDone(true);
    } catch (e) {
      setError(e.message || 'Помилка надсилання');
    } finally {
      setBusy(false);
    }
  };

  const cancelSub = async (subId) => {
    if (!confirm('Скасувати підписку? Доступ залишається до кінця оплаченого periodу.')) return;
    setBusy(true);
    try {
      await apiFetch('/billing/cancel.php', { method: 'POST', body: { sub_id: subId } });
      setSuccess('Підписку скасовано');
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 text-gray-400 text-sm">
        Завантаження…
      </div>
    );
  }

  const plans   = data?.plans            || {};
  const sub     = data?.subscription;
  const methods = data?.payment_methods;
  const manual  = data?.manual_requisites;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* Поточна підписка */}
      <div className="rounded-2xl border border-white/10 bg-[#111119] p-6">
        <h2 className="text-base font-bold text-white mb-3">Поточна підписка</h2>
        {data?.current_plan && data.current_plan !== 'free' && data.current_plan !== 'start' ? (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xl font-bold text-[#00ff88]">
                {PLAN_LABELS[data.current_plan] || data.current_plan}
              </span>
              {data.plan_expires_at && (
                <p className="text-sm text-gray-400 mt-1">
                  До: {new Date(data.plan_expires_at).toLocaleDateString('uk-UA')}
                </p>
              )}
            </div>
            {sub && sub.status === 'paid' && (
              <button
                onClick={() => cancelSub(sub.id)}
                disabled={busy}
                className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition disabled:opacity-50"
              >
                Скасувати
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Безкоштовний план (Старт)</p>
        )}
      </div>

      {error   && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      {/* КРОК 1: Вибір тарифу */}
      {step === 'plan' && (
        <div className="rounded-2xl border border-white/10 bg-[#111119] p-6 space-y-5">
          <h2 className="text-base font-bold text-white">Оберіть тариф</h2>

          <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
            {['month', 'year'].map(p => (
              <button
                key={p}
                onClick={() => setSelPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                  selPeriod === p ? 'bg-[#00ff88] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {p === 'month' ? 'Місяць' : 'Рік (-17%)'}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(plans).map(([id, plan]) => {
              const price = plan[selPeriod] || 0;
              const sel   = selPlan === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelPlan(id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    sel ? 'border-[#00ff88] bg-[#00ff88]/5' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">{plan.label}</span>
                    {sel && <span className="text-[#00ff88] text-xs font-bold">✓</span>}
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {price > 0 ? '₴' + price.toLocaleString('uk-UA') : '—'}
                    {price > 0 && (
                      <span className="text-sm font-normal text-gray-400">
                        {' /'}{PERIOD_LABELS[selPeriod]}
                      </span>
                    )}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            onClick={goNext}
            disabled={busy || (methods?.count || 0) === 0}
            className="w-full py-3 rounded-2xl bg-[#00ff88] text-black font-bold hover:bg-[#00e07a] transition disabled:opacity-50"
          >
            {busy ? 'Зачекайте…'
              : (methods?.count || 0) === 0 ? 'Методи оплати недоступні'
              : methods?.count === 1 ? 'Оплатити через ' + methods.methods[0].label
              : 'Обрати метод оплати →'}
          </button>
        </div>
      )}

      {/* КРОК 2: Вибір методу */}
      {step === 'method' && (
        <div className="rounded-2xl border border-white/10 bg-[#111119] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('plan')} className="text-gray-400 hover:text-white text-sm">
              ← Назад
            </button>
            <h2 className="text-base font-bold text-white">Метод оплати</h2>
          </div>

          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-300">
            <span className="text-[#00ff88] font-bold">{PLAN_LABELS[selPlan] || selPlan}</span>
            <span className="text-gray-600">·</span>
            <span>{PERIOD_LABELS[selPeriod]}</span>
            {plans[selPlan] && plans[selPlan][selPeriod] > 0 && (
              <>
                <span className="text-gray-600">·</span>
                <span className="font-bold text-white">
                  ₴{plans[selPlan][selPeriod].toLocaleString('uk-UA')}
                </span>
              </>
            )}
          </div>

          <div className="space-y-2">
            {(methods?.methods || []).map(m => (
              <button
                key={m.id}
                onClick={() => setSelMethod(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition ${
                  selMethod === m.id
                    ? 'border-[#00ff88] bg-[#00ff88]/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-gray-300"><PaymentIcon id={m.icon} /></span>
                <span className="font-medium text-white">{m.label}</span>
                {selMethod === m.id && (
                  <span className="ml-auto text-[#00ff88] text-sm font-bold">✓</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => startPayment()}
            disabled={!selMethod || busy}
            className="w-full py-3 rounded-2xl bg-[#00ff88] text-black font-bold hover:bg-[#00e07a] transition disabled:opacity-50"
          >
            {busy ? 'Зачекайте…' : 'Продовжити →'}
          </button>
        </div>
      )}

      {/* КРОК 3: Ручний переказ */}
      {step === 'manual' && !manualDone && (
        <div className="rounded-2xl border border-white/10 bg-[#111119] p-6 space-y-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep(methods?.count > 1 ? 'method' : 'plan')}
              className="text-gray-400 hover:text-white text-sm"
            >
              ← Назад
            </button>
            <h2 className="text-base font-bold text-white">Банківський переказ</h2>
          </div>

          {/* Реквізити */}
          {manual && (
            <div className="bg-white/5 rounded-2xl p-5 space-y-3 text-sm">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Реквізити</p>
              {manual.card_number && (
                <ReqRow label="Картка" value={
                  <span className="font-mono font-bold text-white">{manual.card_number}</span>
                } />
              )}
              {manual.iban && (
                <ReqRow label="IBAN" value={
                  <span className="font-mono text-white text-xs">{manual.iban}</span>
                } />
              )}
              {manual.recipient && <ReqRow label="Отримувач" value={manual.recipient} />}
              {manual.bank      && <ReqRow label="Банк"      value={manual.bank} />}
              {plans[selPlan] && plans[selPlan][selPeriod] > 0 && (
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-gray-400">Сума:</span>
                  <span className="font-bold text-[#00ff88] text-lg">
                    ₴{plans[selPlan][selPeriod].toLocaleString('uk-UA')}
                  </span>
                </div>
              )}
              <div className="border-t border-white/10 pt-3">
                <p className="text-gray-400">Призначення платежу:</p>
                <p className="text-white mt-1">
                  Підписка IndexFast {PLAN_LABELS[selPlan]} ({PERIOD_LABELS[selPeriod]})
                </p>
              </div>
            </div>
          )}

          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
            <li>Здійсніть переказ на вказані реквізити</li>
            <li>Збережіть квитанцію або скріншот підтвердження</li>
            <li>Завантажте квитанцію нижче та натисніть «Надіслати»</li>
            <li>Підписка активується після перевірки адміністратором (1–24 год)</li>
          </ol>

          <div>
            <div
              onClick={() => document.getElementById('receipt-file').click()}
              className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:border-white/40 transition"
            >
              {receipt
                ? <p className="text-[#00ff88] text-sm">✓ {receipt.name}</p>
                : <p className="text-gray-500 text-sm">Клацніть для вибору файлу (JPG, PNG, PDF, макс 10 МБ)</p>
              }
            </div>
            <input
              id="receipt-file"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.webp"
              className="hidden"
              onChange={e => setReceipt(e.target.files[0])}
            />
          </div>

          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="Примітка (необов'язково)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:border-[#00ff88]/50 outline-none"
          />

          <button
            onClick={sendReceipt}
            disabled={busy || (!receipt && !notes)}
            className="w-full py-3 rounded-2xl bg-[#00ff88] text-black font-bold hover:bg-[#00e07a] transition disabled:opacity-50"
          >
            {busy ? 'Надсилаємо…' : '📨 Надіслати квитанцію'}
          </button>
        </div>
      )}

      {step === 'manual' && manualDone && (
        <Alert type="success" large>
          <p className="font-bold text-base mb-1">✅ Квитанцію отримано!</p>
          <p>Адміністратор перевірить оплату та активує підписку протягом 1–24 год.</p>
          <p className="mt-1">Ви отримаєте email після підтвердження.</p>
        </Alert>
      )}

      {/* Історія підписок */}
      {data?.history && data.history.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#111119] p-6">
          <h2 className="text-base font-bold text-white mb-4">Історія підписок</h2>
          <div className="space-y-1">
            {data.history.map(h => (
              <div
                key={h.id}
                className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 text-sm flex-wrap gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{PLAN_LABELS[h.plan_id] || h.plan_id}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-400">{PERIOD_LABELS[h.period] || h.period}</span>
                  <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                    {h.payment_method}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {h.amount > 0 && (
                    <span className="text-gray-300">₴{Number(h.amount).toLocaleString('uk-UA')}</span>
                  )}
                  <StatusBadge status={h.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReqRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-400 shrink-0">{label}:</span>
      <span className="text-gray-200 text-right">{value}</span>
    </div>
  );
}

function Alert({ type, children, large }) {
  const cls = type === 'success'
    ? 'border-green-500/30 bg-green-500/10 text-green-300'
    : 'border-red-500/30 bg-red-500/10 text-red-300';
  return (
    <div className={`border rounded-2xl ${large ? 'p-6' : 'px-4 py-3'} text-sm ${cls}`}>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    paid:                         'bg-green-500/10 text-green-400',
    pending:                      'bg-yellow-500/10 text-yellow-400',
    failed:                       'bg-red-500/10 text-red-400',
    expired:                      'bg-white/5 text-gray-500',
    cancelled:                    'bg-white/5 text-gray-500',
    refunded:                     'bg-yellow-500/10 text-yellow-400',
    awaiting_manual_confirmation: 'bg-yellow-500/10 text-yellow-400',
  };
  const labels = {
    paid:                         '✅ Активна',
    pending:                      '⏳ Очікує',
    failed:                       '❌ Відхилено',
    expired:                      '🔴 Завершена',
    cancelled:                    '⚪ Скасована',
    refunded:                     '↩ Повернено',
    awaiting_manual_confirmation: '⏳ Підтвердження',
  };
  const cls   = cfg[status]    || 'bg-white/5 text-gray-400';
  const label = labels[status] || status;
  return <span className={'text-xs px-2 py-0.5 rounded-full ' + cls}>{label}</span>;
}
