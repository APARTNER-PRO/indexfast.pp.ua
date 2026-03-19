// src/components/ui/index.jsx
import { memo, useEffect } from "react";
import { C, PLAN_COLORS }  from "../../constants.js";

// ── Badge плану
export const Badge = memo(function Badge({ plan }) {
  const bg  = plan === "pro" ? "rgba(0,255,136,0.1)" : plan === "agency" ? "rgba(255,208,96,0.1)" : "rgba(255,255,255,0.06)";
  const col = PLAN_COLORS[plan] ?? C.muted;
  return (
    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 100, background: bg, color: col,
      border: `1px solid ${col}22` }}>{plan}</span>
  );
});

// ── Статус сайту
export const StatusDot = memo(function StatusDot({ status }) {
  const colors = { active: C.green, paused: C.gold, error: C.red };
  const labels = { active: "Активний", paused: "Пауза", error: "Помилка" };
  const col = colors[status] ?? C.muted;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11,
      fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: col }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: col, flexShrink: 0,
        boxShadow: status === "active" ? `0 0 6px ${C.green}` : "none",
        animation: status === "active" ? "pulse 2s infinite" : "none" }}/>
      {labels[status] ?? status}
    </span>
  );
});

// ── Toast повідомлення
export const Toast = memo(function Toast({ msg, type, visible }) {
  const isErr = type === "error";
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999,
      background: isErr ? "#2a0a10" : "#0a1a12",
      border: `1px solid ${isErr ? "rgba(255,77,109,0.3)" : "rgba(0,255,136,0.25)"}`,
      borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12,
      fontSize: 14, color: C.white, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      maxWidth: 360, pointerEvents: "none",
      transform: visible ? "translateY(0)" : "translateY(80px)",
      opacity: visible ? 1 : 0, transition: "all 0.3s" }}>
      <span style={{ fontWeight: 800, color: isErr ? C.red : C.green, fontSize: 16 }}>
        {isErr ? "✕" : "✓"}
      </span>
      {msg}
    </div>
  );
});

// ── Spinner
export const Spinner = memo(function Spinner({ size = 18 }) {
  return (
    <span style={{ display: "inline-block", width: size, height: size, flexShrink: 0,
      border: `2px solid rgba(0,255,136,0.2)`, borderTopColor: C.green,
      borderRadius: "50%", animation: "spin 0.7s linear infinite" }}/>
  );
});

// ── Прогрес-бар
export const ProgressBar = memo(function ProgressBar({ value, max, color = C.green }) {
  const pct      = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const barColor = pct >= 90 ? C.red : pct >= 70 ? C.gold : color;
  return (
    <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: barColor,
        borderRadius: 3, transition: "width 0.8s ease" }}/>
    </div>
  );
});

// ── Модалка
export function Modal({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)", zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 24,
        padding: 32, width: 480, maxWidth: "100%", animation: "slideUp 0.2s ease" }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 6 }}>{title}</h2>
        {subtitle && <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

// ── Поле форми
export const Field = memo(function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>{hint}</p>}
    </div>
  );
});

// ── Input
export const Input = memo(function Input({ style: sx, ...props }) {
  return (
    <input {...props} style={{ width: "100%", background: C.dark, border: `1px solid ${C.border2}`,
      borderRadius: 12, padding: "11px 14px", color: C.white, fontFamily: "inherit",
      fontSize: 14, outline: "none", boxSizing: "border-box",
      transition: "border-color 0.2s", ...sx }}
      onFocus={e => { e.target.style.borderColor = "rgba(0,255,136,0.4)"; props.onFocus?.(e); }}
      onBlur={e  => { e.target.style.borderColor = C.border2;              props.onBlur?.(e);  }}
    />
  );
});

// ── Textarea
export const Textarea = memo(function Textarea({ style: sx, ...props }) {
  return (
    <textarea {...props} rows={props.rows ?? 6}
      style={{ width: "100%", background: C.dark, border: `1px solid ${C.border2}`,
        borderRadius: 12, padding: "11px 14px", color: C.white,
        fontFamily: "ui-monospace,monospace", fontSize: 12,
        outline: "none", resize: "vertical", boxSizing: "border-box",
        transition: "border-color 0.2s", ...sx }}
      onFocus={e => { e.target.style.borderColor = "rgba(0,255,136,0.4)"; props.onFocus?.(e); }}
      onBlur={e  => { e.target.style.borderColor = C.border2;              props.onBlur?.(e);  }}
    />
  );
});

// ── Кнопка
export const Btn = memo(function Btn({ children, variant = "primary", loading, disabled, style: sx = {}, ...props }) {
  const styles = {
    primary: { background: C.green,                     color: C.black },
    ghost:   { background: "rgba(255,255,255,0.06)",    color: C.white, border: `1px solid ${C.border}` },
    danger:  { background: "rgba(255,77,109,0.1)",      color: C.red,   border: `1px solid rgba(255,77,109,0.2)` },
    outline: { background: "transparent",               color: C.green, border: `1px solid rgba(0,255,136,0.3)` },
  };
  return (
    <button disabled={disabled || loading} {...props}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 8, borderRadius: 12, fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 14,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        border: "none", transition: "all 0.15s", padding: "11px 20px",
        opacity: disabled ? 0.5 : 1, ...styles[variant], ...sx }}>
      {loading ? <Spinner size={15}/> : children}
    </button>
  );
});

// ── Sparkline SVG (мемо — перемальовується тільки при зміні data)
export const Sparkline = memo(function Sparkline({ data = [] }) {
  if (!data.length) return (
    <div style={{ color: C.muted, fontSize: 12, textAlign: "center", padding: 40 }}>
      Немає даних
    </div>
  );
  const W = 100, H = 50;
  const max = Math.max(...data.map(d => d.sent), 1);
  const pts = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * W;
    const y = H - (d.sent / max) * (H - 8) - 4;
    return [x, y];
  });
  const area = `M${pts.map(p => p.join(",")).join("L")}L${W},${H}L0,${H}Z`;
  const line = `M${pts.map(p => p.join(",")).join("L")}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 80, overflow: "visible" }}
      preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={C.green} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={C.green} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sg)"/>
      <path d={line} fill="none" stroke={C.green} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={C.green} stroke={C.black} strokeWidth="1.5"/>
      ))}
    </svg>
  );
});

// ── JobProgress — прогрес активного job
export const JobProgress = memo(function JobProgress({ job, isPolling }) {
  if (!job) return null;
  const isDone = job.status === "done";
  const isFail = job.status === "failed";
  const color  = isFail ? C.red : isDone ? C.green : C.gold;
  const label  = isDone ? "Завершено" : isFail ? "Помилка" : "Обробляється...";

  return (
    <div style={{ background: `${color}0d`, border: `1px solid ${color}30`,
      borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isPolling && <Spinner size={13}/>}
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 13, color }}>
            {label}
          </span>
          <span style={{ fontSize: 11, color: C.muted }}>job #{job.id}</span>
        </div>
        <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 14, color }}>
          {job.progress ?? 0}%
        </span>
      </div>
      <ProgressBar value={job.progress ?? 0} max={100} color={color}/>
      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: C.muted }}>
        <span>✓ Відправлено: <strong style={{ color: C.green }}>{job.sent}</strong></span>
        <span>✕ Помилки: <strong style={{ color: job.failed > 0 ? C.red : C.muted }}>{job.failed}</strong></span>
        <span>Всього: <strong style={{ color: C.white }}>{job.total}</strong></span>
        {job.last_error && <span style={{ color: C.red }}>⚠ {job.last_error}</span>}
      </div>
    </div>
  );
});
