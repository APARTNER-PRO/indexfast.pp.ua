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
const PERIOD_LABELS = { month: 'місяць', year: 'рік', '3_years': '3 роки' };

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

  // Promo code states
  const [promoInput,   setPromoInput]   = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [manualAmount, setManualAmount] = useState(null);

  // Reset promo code when plan or period changes
  useEffect(() => {
    setAppliedPromo(null);
    setPromoInput('');
  }, [selPlan, selPeriod]);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiFetch('/billing/validate_promo.php', {
        method: 'POST',
        body: {
          plan_id: selPlan,
          period: selPeriod,
          promo_code: promoInput
        }
      });
      setAppliedPromo({
        code: promoInput.toUpperCase().trim(),
        ...res
      });
    } catch (e) {
      setError(e.message || 'Невірний промокод');
      setAppliedPromo(null);
    } finally {
      setBusy(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setSuccess('');
    setError('');
  };

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
      setSelMethod(pm.methods[0].id);
    }
    setStep('method');
  };

  const startPayment = async (methodId) => {
    const meth = methodId || selMethod;
    if (!meth) return;
    setBusy(true);
    setError('');
    try {
      const res = await apiFetch('/billing/checkout.php', {
        method: 'POST',
        body:   {
          plan_id: selPlan,
          period: selPeriod,
          payment_method: meth,
          promo_code: appliedPromo ? appliedPromo.code : ''
        },
      });

      if (meth === 'manual') {
        setManualSubId(res.sub_id);
        setManualAmount(res.amount);
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
    <div style={{ width: '100%', maxWidth: 1400, padding: '32px 16px' }} className="space-y-6">

      {/* Поточна підписка */}
      <div style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)',
                    background: '#0d0d17', padding: '24px 28px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#4a4a68', letterSpacing: '0.1em',
                    textTransform: 'uppercase', marginBottom: 14 }}>Поточна підписка</p>
        {data?.current_plan && data.current_plan !== 'free' && data.current_plan !== 'start' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)',
                            borderRadius: 12, padding: '10px 20px' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20,
                               color: '#00ff88' }}>
                  {PLAN_LABELS[data.current_plan] || data.current_plan}
                </span>
              </div>
              {data.plan_expires_at && (
                <div>
                  <p style={{ fontSize: 11, color: '#4a4a68', marginBottom: 2 }}>Дійсний до</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#d0d0e8' }}>
                    {new Date(data.plan_expires_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              )}
              {sub && (
                <span style={{ fontSize: 11, fontWeight: 700,
                               padding: '4px 10px', borderRadius: 100,
                               background: sub.status === 'paid' ? 'rgba(0,255,136,0.1)' : 'rgba(255,200,0,0.1)',
                               color: sub.status === 'paid' ? '#00ff88' : '#ffd060',
                               border: sub.status === 'paid' ? '1px solid rgba(0,255,136,0.2)' : '1px solid rgba(255,208,96,0.2)' }}>
                  {sub.status === 'paid' ? '● Активна' : '○ ' + sub.status}
                </span>
              )}
            </div>
            {sub && sub.status === 'paid' && (
              <button
                onClick={() => cancelSub(sub.id)}
                disabled={busy}
                style={{ padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                         cursor: busy ? 'not-allowed' : 'pointer', transition: 'all .15s',
                         background: 'transparent', color: '#f87171',
                         border: '1px solid rgba(248,113,113,0.25)' }}>
                Скасувати
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10,
                          padding: '8px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700,
                             fontSize: 15, color: '#5a5a78' }}>Старт</span>
            </div>
            <p style={{ fontSize: 13, color: '#4a4a68' }}>Безкоштовний план — оберіть тариф для розширення можливостей</p>
          </div>
        )}
      </div>

      {error   && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      {/* КРОК 1: Вибір тарифу */}
      {step === 'plan' && (
        <div style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)',
                      background: '#0d0d17', padding: '28px', marginTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16,
                        color: '#eeeef6' }}>Оберіть тариф</p>
            {/* Перемикач місяць/рік/3 роки */}
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.05)',
                          borderRadius: 12, padding: 4 }}>
              {['month', 'year', '3_years'].map(per => {
                let label = per === 'month' ? 'Місяць' : per === 'year' ? 'Рік' : '3 роки';
                let discountText = '';
                
                if (per === 'year') {
                  const m = plans['pro']?.month;
                  const y = plans['pro']?.year;
                  if (m > 0 && y > 0) {
                    const d = Math.round((1 - y / (m * 12)) * 100);
                    if (d > 0) discountText = ` −${d}%`;
                  } else {
                    discountText = ' −17%'; // fallback
                  }
                } else if (per === '3_years') {
                  const m = plans['pro']?.month;
                  const y3 = plans['pro']?.['3_years'];
                  if (m > 0 && y3 > 0) {
                    const d = Math.round((1 - y3 / (m * 36)) * 100);
                    if (d > 0) discountText = ` −${d}%`;
                  }
                }

                return (
                  <button
                    key={per}
                    onClick={() => setSelPeriod(per)}
                    style={{ padding: '7px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                             cursor: 'pointer', transition: 'all .15s', border: 'none',
                             ...(selPeriod === per
                               ? { background: '#00ff88', color: '#050508' }
                               : { background: 'transparent', color: '#6a6a85' }) }}>
                    {label}{discountText}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Картки — всі в одному ряду, горизонтальний скрол на мобільному */}
          <div style={{ display: 'flex', gap: 16, paddingTop: 20, overflowX: 'auto', paddingBottom: 16 }}>
            {Object.entries(plans).map(([id, p]) => {
              const priceVal   = p[selPeriod] || 0;
              const isEnterprise = !!p.enterprise;
              const priceNum  = isEnterprise ? '' : (priceVal > 0 ? priceVal.toLocaleString('uk-UA') : '0');
              const desc      = isEnterprise ? 'під ваші потреби' : (priceVal > 0 ? '/ ' + PERIOD_LABELS[selPeriod] : 'назавжди безкоштовно');
              return (
                <div key={id} style={{ flex: '1 1 0', minWidth: 260 }}>
                  <PlanCard
                    plan={{ id, name: p.label, priceNum, desc,
                            popular: !!p.popular, enterprise: isEnterprise,
                            features: p.features || [] }}
                    isCurrent={data?.current_plan === id}
                    isSelected={selPlan === id}
                    onSelect={() => setSelPlan(id)}
                    onBuy={() => { setSelPlan(id); goNext(); }}
                    busy={busy}
                    methodsOk={(methods?.count || 0) > 0}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* КРОК 2: Вибір методу */}
      {step === 'method' && (
        <div style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)',
                      background: '#0d0d17', padding: '28px', marginTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button
              onClick={() => setStep('plan')}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none',
                       borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
                       color: '#a0a0c0', fontSize: 13, fontWeight: 600, transition: 'background .15s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              ← Назад
            </button>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#eeeef6', margin: 0 }}>
              Метод оплати
            </h2>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 18, padding: '24px 28px', marginBottom: 24 }}>
            <span style={{ color: '#6a6a85', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Обраний тариф
            </span>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', margin: '6px 0 16px' }}>
              {PLAN_LABELS[selPlan] || selPlan}
            </h3>

            {plans[selPlan] && plans[selPlan][selPeriod] > 0 && (
              <div className="flex items-end gap-3 flex-wrap">
                {appliedPromo ? (
                  <>
                    <span className="text-zinc-500 line-through text-sm mb-0.5">
                      ₴{plans[selPlan][selPeriod].toLocaleString('uk-UA')}
                    </span>

                    <span className="text-3xl font-black text-emerald-400 leading-none">
                      ₴{appliedPromo.final_amount.toLocaleString('uk-UA')}
                    </span>

                    <span className="text-zinc-400 text-sm mb-0.5">
                      / {PERIOD_LABELS[selPeriod]}
                    </span>

                    <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      -{appliedPromo.discount_type === 'percentage' ? `${appliedPromo.discount_value}%` : `₴${appliedPromo.discount_value}`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-black text-white leading-none">
                      ₴{plans[selPlan][selPeriod].toLocaleString('uk-UA')}
                    </span>

                    <span className="text-zinc-400 text-sm mb-0.5">
                      / {PERIOD_LABELS[selPeriod]}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Промокод */}
          <div style={{ marginBottom: 24 }}>
            {!appliedPromo ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Введіть промокод"
                  value={promoInput}
                  onChange={e => setPromoInput(e.target.value)}
                  style={{ flex: 1, boxSizing: 'border-box',
                           background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                           borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#eeeef6',
                           outline: 'none', fontFamily: 'inherit',
                           transition: 'border-color .15s' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={busy || !promoInput.trim()}
                  style={{ padding: '12px 20px', borderRadius: 12, border: 'none',
                           cursor: busy || !promoInput.trim() ? 'not-allowed' : 'pointer',
                           fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
                           background: !promoInput.trim() ? 'rgba(0,255,136,0.3)' : '#00ff88',
                           color: '#050508', transition: 'all .15s',
                           opacity: busy ? 0.7 : 1 }}
                >
                  Застосувати
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3.5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-sm text-emerald-400 tracking-wide">{appliedPromo.code}</span>
                    <span className="text-xs text-zinc-400 ml-2">активовано</span>
                  </div>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10"
                >
                  Видалити
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
            {(methods?.methods || []).map(m => {
              const isSelected = selMethod === m.id;
              // Some icons are just styled text, some are svgs
              const iconNeedsLabel = ['manual', 'bank'].includes(m.icon);
              return (
                <button
                  key={m.id}
                  onClick={() => setSelMethod(m.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%',
                           padding: '16px 20px', borderRadius: 16, cursor: 'pointer',
                           transition: 'all .15s', textAlign: 'left',
                           border: isSelected ? '1px solid rgba(0,255,136,0.4)' : '1px solid rgba(255,255,255,0.08)',
                           background: isSelected ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>
                    <PaymentIcon id={m.icon} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 15, color: isSelected ? '#fff' : '#d0d0e8' }}>
                    {iconNeedsLabel ? m.label : (m.label.includes('Monobank') ? 'Monobank' : m.label)}
                  </span>
                  {isSelected && (
                    <span style={{ marginLeft: 'auto', color: '#00ff88', fontWeight: 800, fontSize: 16 }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => startPayment()}
            disabled={!selMethod || busy}
            style={{ width: '100%', padding: '16px', borderRadius: 14, cursor: !selMethod || busy ? 'not-allowed' : 'pointer',
                     fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15,
                     transition: 'all .15s', border: 'none',
                     background: !selMethod ? 'rgba(0,255,136,0.3)' : '#00ff88',
                     color: '#050508', opacity: busy ? 0.7 : 1 }}
          >
            {busy ? 'Зачекайте…' : 'Продовжити →'}
          </button>
        </div>
      )}

      {/* КРОК 3: Ручний переказ */}
      {step === 'manual' && !manualDone && (
        <div style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)',
                      background: '#0d0d17', padding: 28, marginTop: 40 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <button
              onClick={() => setStep(methods?.count > 1 ? 'method' : 'plan')}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none',
                       borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
                       color: '#a0a0c0', fontSize: 13, fontWeight: 600, transition: 'background .15s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              ← Назад
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10,
                            background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }} fill="none" stroke="#00ff88" strokeWidth="1.5">
                  <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16,
                           color: '#eeeef6', margin: 0 }}>
                Банківський переказ
              </h2>
            </div>
          </div>

          {/* Обраний тариф — pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                        background: 'rgba(255,255,255,0.03)', borderRadius: 14,
                        padding: '12px 20px', marginBottom: 24,
                        border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: '#00ff88', fontWeight: 700, fontSize: 14 }}>
              {PLAN_LABELS[selPlan] || selPlan}
            </span>
            <span style={{ color: '#4a4a68' }}>·</span>
            <span style={{ color: '#d0d0e8', fontSize: 14 }}>{PERIOD_LABELS[selPeriod]}</span>
            {plans[selPlan] && plans[selPlan][selPeriod] > 0 && (
              <>
                <span style={{ color: '#4a4a68' }}>·</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', fontSize: 16 }}>
                  ₴{manualAmount !== null ? manualAmount.toLocaleString('uk-UA') : plans[selPlan][selPeriod].toLocaleString('uk-UA')}
                </span>
              </>
            )}
          </div>

          {/* Реквізити — premium card */}
          {manual && (
            <div style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.03) 0%, rgba(0,180,255,0.02) 100%)',
                          border: '1px solid rgba(0,255,136,0.12)', borderRadius: 18,
                          padding: 0, marginBottom: 24, overflow: 'hidden' }}>

              {/* Card header */}
              <div style={{ padding: '14px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#00ff88', letterSpacing: '0.12em',
                               textTransform: 'uppercase' }}>Реквізити для оплати</span>
              </div>

              {/* Card body — grid rows */}
              <div style={{ padding: '6px 0' }}>
                {manual.card_number && (
                  <ManualReqRow
                    icon="💳" label="Картка" value={manual.card_number}
                    mono bold copyable />
                )}
                {manual.iban && (
                  <ManualReqRow
                    icon="🏛" label="IBAN" value={manual.iban}
                    mono small copyable />
                )}
                {manual.recipient && (
                  <ManualReqRow icon="👤" label="Отримувач" value={manual.recipient} />
                )}
                {manual.bank && (
                  <ManualReqRow icon="🏦" label="Банк" value={manual.bank} />
                )}
              </div>

              {/* Сума — виділена секція */}
              {plans[selPlan] && plans[selPlan][selPeriod] > 0 && (
                <div style={{ padding: '16px 22px', borderTop: '1px solid rgba(255,255,255,0.06)',
                              background: 'rgba(0,255,136,0.04)',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#6a6a85', fontWeight: 600 }}>Сума до сплати</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {manualAmount !== null && manualAmount < plans[selPlan][selPeriod] && (
                      <span style={{ textDecoration: 'line-through', color: '#6a6a85', fontSize: 13, marginBottom: 2 }}>
                        ₴{plans[selPlan][selPeriod].toLocaleString('uk-UA')}
                      </span>
                    )}
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24,
                                   color: '#00ff88', letterSpacing: '-0.02em' }}>
                      ₴{manualAmount !== null ? manualAmount.toLocaleString('uk-UA') : plans[selPlan][selPeriod].toLocaleString('uk-UA')}
                    </span>
                  </div>
                </div>
              )}

              {/* Призначення платежу */}
              <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#6a6a85', fontWeight: 600, flexShrink: 0 }}>Призначення:</span>
                <span style={{ fontSize: 13, color: '#d0d0e8', fontWeight: 500, textAlign: 'right' }}>
                  Підписка IndexFast {PLAN_LABELS[selPlan]} ({PERIOD_LABELS[selPeriod]})
                </span>
              </div>
            </div>
          )}

          {/* Інструкції — numbered stepper */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 28 }}>
            {[
              'Здійсніть переказ на вказані реквізити',
              'Збережіть квитанцію або скріншот підтвердження',
              'Завантажте квитанцію нижче та натисніть «Надіслати»',
              'Підписка активується після перевірки (1–24 год)',
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                {/* Vertical line + circle */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%',
                                background: 'rgba(0,255,136,0.08)',
                                border: '1px solid rgba(0,255,136,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                                fontSize: 12, color: '#00ff88' }}>
                    {i + 1}
                  </div>
                  {i < 3 && (
                    <div style={{ width: 1, height: 18,
                                  background: 'rgba(0,255,136,0.12)' }} />
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#a0a0c0', lineHeight: 1.5,
                            paddingTop: 4 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* Завантаження квитанції — dropzone */}
          <div style={{ marginBottom: 16 }}>
            <div
              onClick={() => document.getElementById('receipt-file').click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(0,255,136,0.5)'; e.currentTarget.style.background = 'rgba(0,255,136,0.04)'; }}
              onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'transparent'; }}
              onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'transparent'; if (e.dataTransfer.files[0]) setReceipt(e.dataTransfer.files[0]); }}
              style={{ border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 16,
                       padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
                       transition: 'all .2s', background: 'transparent' }}
              onMouseOver={e => { if (!receipt) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}}
              onMouseOut={e => { if (!receipt) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'transparent'; }}}
            >
              {receipt ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10,
                                background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 18 }}>✓</span>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#00ff88', margin: 0 }}>{receipt.name}</p>
                    <p style={{ fontSize: 11, color: '#6a6a85', margin: '2px 0 0' }}>
                      {(receipt.size / 1024 / 1024).toFixed(2)} МБ
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setReceipt(null); }}
                    style={{ marginLeft: 8, background: 'rgba(248,113,113,0.1)',
                             border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8,
                             padding: '4px 10px', cursor: 'pointer',
                             fontSize: 11, fontWeight: 600, color: '#f87171',
                             transition: 'all .15s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(248,113,113,0.2)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" style={{ width: 32, height: 32, margin: '0 auto 10px',
                       opacity: 0.35 }} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 16V4m0 0L8 8m4-4l4 4M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"
                          strokeLinecap="round" strokeLinejoin="round" stroke="#a0a0c0"/>
                  </svg>
                  <p style={{ fontSize: 14, color: '#8a8aa0', margin: 0, fontWeight: 500 }}>
                    Перетягніть файл або <span style={{ color: '#00ff88', fontWeight: 600 }}>оберіть</span>
                  </p>
                  <p style={{ fontSize: 11, color: '#4a4a68', margin: '6px 0 0' }}>
                    JPG, PNG, PDF або WebP · макс 10 МБ
                  </p>
                </>
              )}
            </div>
            <input
              id="receipt-file"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.webp"
              style={{ display: 'none' }}
              onChange={e => setReceipt(e.target.files[0])}
            />
          </div>

          {/* Примітка */}
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="Примітка (необов'язково)"
            style={{ width: '100%', boxSizing: 'border-box',
                     background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                     borderRadius: 14, padding: '14px 18px', fontSize: 14, color: '#eeeef6',
                     resize: 'none', outline: 'none', fontFamily: 'inherit',
                     transition: 'border-color .15s', marginBottom: 20 }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          />

          {/* Submit */}
          <button
            onClick={sendReceipt}
            disabled={busy || (!receipt && !notes)}
            style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                     cursor: busy || (!receipt && !notes) ? 'not-allowed' : 'pointer',
                     fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15,
                     transition: 'all .15s',
                     background: (!receipt && !notes) ? 'rgba(0,255,136,0.3)' : '#00ff88',
                     color: '#050508', opacity: busy ? 0.7 : 1,
                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {busy ? 'Надсилаємо…' : (
              <>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" stroke="#050508"/>
                </svg>
                Надіслати квитанцію
              </>
            )}
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
        <div style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)',
                      background: '#0d0d17', padding: '28px', marginTop: 40 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16,
                       color: '#eeeef6', marginBottom: 20 }}>
            Історія підписок
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.history.map(h => {
              const isManual = h.payment_method === 'manual';
              const methodName = isManual ? 'Банківський переказ' : (h.payment_method || '—');
              const dateStr = h.created_at ? new Date(h.created_at.replace(' ', 'T')).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
              
              return (
                <div
                  key={h.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', borderRadius: 16,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexWrap: 'wrap', gap: 16,
                    transition: 'background .2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 42, height: 42, borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, opacity: 0.7, color: '#a0a0c0' }} fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>
                          {PLAN_LABELS[h.plan_id] || h.plan_id}
                        </span>
                        <span style={{ color: '#4a4a68' }}>·</span>
                        <span style={{ fontSize: 14, color: '#d0d0e8' }}>
                          {PERIOD_LABELS[h.period] || h.period}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: '#8a8aa0', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>
                          {methodName}
                        </span>
                        {dateStr && (
                          <>
                            <span style={{ color: '#4a4a68' }}>·</span>
                            <span style={{ fontSize: 12, color: '#6a6a85' }}>{dateStr}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
                    {h.amount > 0 && (
                      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '0.02em' }}>
                        ₴{Number(h.amount).toLocaleString('uk-UA')}
                      </span>
                    )}
                    <StatusBadge status={h.status} />
                  </div>
                </div>
              );
            })}
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

function ManualReqRow({ icon, label, value, mono, bold, small, copyable }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(typeof value === 'string' ? value : '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 22px', transition: 'background .15s' }}
         onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
         onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
      <span style={{ fontSize: 16, flexShrink: 0, width: 24, textAlign: 'center' }}>{icon}</span>
      <span style={{ fontSize: 12, color: '#6a6a85', fontWeight: 600, flexShrink: 0, minWidth: 90 }}>{label}</span>
      <span style={{ flex: 1, fontSize: small ? 12 : 14, color: '#eeeef6',
                     fontFamily: mono ? "'JetBrains Mono', 'Fira Code', monospace" : 'inherit',
                     fontWeight: bold ? 700 : 500, letterSpacing: mono ? '0.04em' : 'normal',
                     overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </span>
      {copyable && (
        <button
          onClick={handleCopy}
          style={{ flexShrink: 0, background: copied ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.05)',
                   border: copied ? '1px solid rgba(0,255,136,0.25)' : '1px solid rgba(255,255,255,0.08)',
                   borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
                   fontSize: 11, fontWeight: 600, transition: 'all .2s',
                   color: copied ? '#00ff88' : '#8a8aa0',
                   display: 'flex', alignItems: 'center', gap: 4 }}
          onMouseOver={e => { if (!copied) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}}
          onMouseOut={e => { if (!copied) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}}
        >
          {copied ? '✓' : (
            <svg viewBox="0 0 24 24" style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {copied ? 'Скопійовано' : 'Копіювати'}
        </button>
      )}
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
    paid:                         'bg-green-500/10 text-green-400 border border-green-500/20',
    pending:                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    failed:                       'bg-red-500/10 text-red-400 border border-red-500/20',
    expired:                      'bg-white/5 text-gray-500 border border-white/10',
    cancelled:                    'bg-white/5 text-gray-500 border border-white/10',
    refunded:                     'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    awaiting_manual_confirmation: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
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
  const cls   = cfg[status]    || 'bg-white/5 text-gray-400 border border-white/10';
  const label = labels[status] || status;
  return <span className={'text-[11px] font-semibold px-2.5 py-1 rounded-full ' + cls}>{label}</span>;
}

// ── PlanCard — дизайн як на головній сторінці, дані з API (plans.php → subscription.php)

const PlanCard = ({ plan: p, isCurrent, isSelected, onSelect, onBuy, busy, methodsOk }) => {
  const isEnterprise = p.enterprise || p.id === 'enterprise';
  const isStart      = p.id === 'start';
  const purple = '#9370db';
  const green  = '#00ff88';

  // Border & background
  const borderColor = isEnterprise
    ? (isSelected ? 'rgba(147,112,219,0.6)' : 'rgba(147,112,219,0.25)')
    : p.popular
      ? (isSelected ? green : 'rgba(0,255,136,0.35)')
      : isSelected
        ? 'rgba(0,255,136,0.4)'
        : 'rgba(255,255,255,0.07)';

  const bg = isEnterprise
    ? 'rgba(147,112,219,0.04)'
    : p.popular
      ? 'rgba(0,255,136,0.04)'
      : '#0d0d17';

  const boxShadow = p.popular
    ? '0 0 40px rgba(0,255,136,0.1)'
    : isEnterprise
      ? '0 0 40px rgba(147,112,219,0.07)'
      : 'none';

  return (
    <div
      onClick={() => { if (!isEnterprise) onSelect(); }}
      style={{ background: bg, border: `1px solid ${borderColor}`, boxShadow,
               borderRadius: 20, padding: '32px 24px 24px', position: 'relative',
               display: 'flex', flexDirection: 'column', height: '100%',
               cursor: isEnterprise ? 'default' : 'pointer',
               transition: 'border-color .2s, box-shadow .2s' }}
    >
      {/* "Популярний" centered pill at top — як на скриншоті */}
      {p.popular && (
        <div style={{ position: 'absolute', top: -14, left: 0, right: 0,
                      display: 'flex', justifyContent: 'center' }}>
          <span style={{ background: green, color: '#050508', fontSize: 11,
                         fontWeight: 800, padding: '4px 14px', borderRadius: 100,
                         fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em' }}>
            Популярний
          </span>
        </div>
      )}
      {isEnterprise && (
        <div style={{ position: 'absolute', top: -14, left: 0, right: 0,
                      display: 'flex', justifyContent: 'center' }}>
          <span style={{ background: 'rgba(147,112,219,0.15)', color: purple, fontSize: 11,
                         fontWeight: 800, padding: '4px 14px', borderRadius: 100,
                         border: '1px solid rgba(147,112,219,0.4)',
                         fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em' }}>
            Enterprise
          </span>
        </div>
      )}

      {/* ✓ Активний */}
      {isCurrent && (
        <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10,
                      fontWeight: 800, background: 'rgba(0,255,136,0.1)', color: green,
                      padding: '3px 9px', borderRadius: 100,
                      border: '1px solid rgba(0,255,136,0.2)' }}>
          ✓ Активний
        </div>
      )}

      {/* Tier name */}
      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13,
                  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18,
                  color: isEnterprise ? purple : p.popular ? green : '#5a5a78' }}>
        {p.name}
      </p>

      {/* Price — ₴ маленька + велике число */}
      <div style={{ display: 'flex', alignItems: 'flex-start', lineHeight: 1, marginBottom: 6 }}>
        {!isEnterprise && (
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700,
                         fontSize: 22, color: '#fff', marginTop: 6, marginRight: 1,
                         lineHeight: 1 }}>₴</span>
        )}
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800,
                       fontSize: isEnterprise ? 26 : 52, lineHeight: 1,
                       color: isEnterprise ? purple : '#fff' }}>
          {isEnterprise ? 'Індивідуально' : p.priceNum}
        </span>
      </div>

      {/* Period */}
      <p style={{ fontSize: 13, color: '#4a4a68', marginBottom: 24 }}>{p.desc}</p>

      {/* Feature list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', flex: 1 }}>
        {(p.features || []).map(f => {
          const disabled = typeof f === 'object' && f.disabled;
          const label    = typeof f === 'object' ? f.label : f;
          return (
            <li key={label}
                style={{ display: 'flex', alignItems: 'center', gap: 10,
                         padding: '8px 0',
                         borderBottom: '1px solid rgba(255,255,255,0.04)',
                         fontSize: 13.5,
                         color: disabled ? '#28283e' : '#a0a0c0' }}>
              <span style={{ flexShrink: 0, fontSize: 13,
                             color: disabled ? '#28283e' : green }}>
                {disabled ? '✕' : '✓'}
              </span>
              <span style={{ textDecoration: disabled ? 'line-through' : 'none' }}>
                {label}
              </span>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      {isCurrent ? (
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700,
                      padding: '14px', borderRadius: 12,
                      color: isEnterprise ? purple : green,
                      background: isEnterprise ? 'rgba(147,112,219,0.08)' : 'rgba(0,255,136,0.06)' }}>
          Поточний план
        </div>
      ) : isEnterprise ? (
        <button
          onClick={e => { e.stopPropagation(); window.open('https://t.me/indexfastgoogle?text=Хочу%20дізнатись%20про%20Enterprise%20план', '_blank'); }}
          style={{ width: '100%', padding: '14px', borderRadius: 12, cursor: 'pointer',
                   fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
                   transition: 'all .15s', background: 'rgba(147,112,219,0.1)',
                   border: '2px solid rgba(147,112,219,0.35)', color: purple }}>
          Зв'язатись →
        </button>
      ) : isStart ? (
        <button
          onClick={e => { e.stopPropagation(); onSelect(); }}
          style={{ width: '100%', padding: '14px', borderRadius: 12, cursor: 'pointer',
                   fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
                   transition: 'all .15s',
                   ...(isSelected
                     ? { background: green, color: '#050508', border: 'none' }
                     : { background: 'transparent', color: '#d0d0e8',
                         border: '1px solid rgba(255,255,255,0.14)' }) }}>
          {isSelected ? '✓ Обрано' : 'Обрати'}
        </button>
      ) : (
        <button
          onClick={e => { e.stopPropagation(); if (methodsOk && !busy) onBuy(); }}
          disabled={busy || !methodsOk}
          style={{ width: '100%', padding: '14px', borderRadius: 12, cursor: busy || !methodsOk ? 'not-allowed' : 'pointer',
                   fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14,
                   transition: 'all .15s', border: 'none',
                   background: methodsOk ? green : 'rgba(0,255,136,0.3)',
                   color: '#050508', opacity: busy ? 0.7 : 1 }}>
          {busy ? 'Зачекайте…'
            : !methodsOk ? 'Оплата недоступна'
            : p.popular ? `Придбати ${p.name} →`
            : `Придбати →`}
        </button>
      )}
    </div>
  );
};

