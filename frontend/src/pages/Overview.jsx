// src/pages/Overview.jsx  ← окремий chunk
import { memo, useCallback } from "react";
import { Badge, Btn, ProgressBar, Sparkline } from "../components/ui/index.jsx";
import { SitesTable }  from "../components/SitesTable.jsx";
import { C }           from "../constants.js";

export default memo(function Overview({
  data, onAddSite, onRun, onDelete, onToggle, onGoLogs, onGoBilling,
}) {
  const { user, today, month, sites, sites_limit, logs, chart } = data;
  const plan      = user.plan;
  const remaining = today.remaining;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Upgrade banner */}
      {plan === "start" && (
        <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,0.07),rgba(0,212,255,0.04))",
          border: "1px solid rgba(0,255,136,0.15)", borderRadius: 16,
          padding: "18px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 28 }}>🚀</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, marginBottom: 4 }}>
              Перейдіть на PRO — 100 URL/день замість 20
            </div>
            <div style={{ fontSize: 13, color: C.muted }}>
              До 10 сайтів, автоматичний розклад, пріоритетна підтримка
            </div>
          </div>
          <Btn variant="primary" onClick={onGoBilling}>Upgrade → ₴999/міс</Btn>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
        {[
          { label: "Сьогодні відправлено", value: today.sent,
            sub: `${today.delta >= 0 ? "+" : ""}${today.delta} vs вчора`,
            subColor: today.delta >= 0 ? C.green : C.red, accent: C.green },
          { label: "Ліміт сьогодні", value: `${today.sent}/${today.limit}`,
            sub: `${remaining} URL залишилось`,
            subColor: remaining === 0 ? C.red : C.muted, accent: remaining === 0 ? C.red : C.gold },
          { label: "За цей місяць", value: month,
            sub: "URL відправлено", subColor: C.muted, accent: C.blue },
          { label: "Активних сайтів", value: `${sites.length}/${sites_limit}`,
            sub: plan === "start" ? "Ліміт плану" : "Підключено",
            subColor: C.muted, accent: C.green },
        ].map(({ label, value, sub, subColor, accent }) => (
          <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg,${accent},transparent)` }}/>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>{label}</div>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 28, fontWeight: 800,
              letterSpacing: "-0.04em", marginBottom: 6 }}>{value}</div>
            <div style={{ fontSize: 11, color: subColor }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Графік + Ліміти */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, marginBottom: 4 }}>Активність за 30 днів</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
            URL відправлених у Google Indexing API
          </div>
          <Sparkline data={chart}/>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, marginBottom: 4 }}>Ліміти плану</div>
            <div style={{ fontSize: 12, color: C.muted }}><Badge plan={plan}/> {user.plan_label}</div>
          </div>
          {[
            { label: "URL сьогодні", value: today.sent, max: today.limit,
              note: `${remaining} залишилось` },
            { label: "Сайти", value: sites.length, max: sites_limit,
              note: sites_limit < 9999 ? `з ${sites_limit}` : "необмежено" },
          ].map(({ label, value, max, note }) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between",
                fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: C.muted }}>{label}</span>
                <span style={{ fontWeight: 700 }}>{value}/{max < 9999 ? max : "∞"}</span>
              </div>
              <ProgressBar value={value} max={max < 9999 ? max : value + 1}/>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{note}</div>
            </div>
          ))}
          {plan === "start" && (
            <Btn variant="primary" onClick={onGoBilling} style={{ width: "100%", marginTop: "auto" }}>
              ✦ Оновити план
            </Btn>
          )}
        </div>
      </div>

      {/* Сайти */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700 }}>Мої сайти</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sites.length} підключено</div>
          </div>
          <Btn variant="outline" onClick={onAddSite} style={{ padding: "7px 16px", fontSize: 13 }}>
            + Додати сайт
          </Btn>
        </div>
        <SitesTable sites={sites} remaining={remaining} onRun={onRun} onDelete={onDelete} onToggle={onToggle}/>
      </div>

      {/* Логи — preview */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700 }}>Останні операції</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              Лог відправок у Google Indexing API
            </div>
          </div>
          <Btn variant="ghost" onClick={onGoLogs} style={{ padding: "7px 14px", fontSize: 12 }}>
            Всі логи →
          </Btn>
        </div>
        <LogPreview logs={logs}/>
      </div>
    </div>
  );
});

// Превью логів (показує 10 записів з stats)
const LogPreview = memo(function LogPreview({ logs }) {
  if (!logs?.length) return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontSize: 13 }}>
      Логи з'являться після першого запуску індексації
    </div>
  );
  const icons  = { ok: "✓", error: "✕", pending: "⏳" };
  const colors = { ok: C.green, error: C.red, pending: C.gold };
  return (
    <div>
      {logs.slice(0, 10).map((l, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12,
          padding: "10px 20px", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.015)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <span style={{ color: colors[l.status], fontWeight: 800, width: 16, textAlign: "center" }}>
            {icons[l.status]}
          </span>
          <span style={{ flex: 1, fontFamily: "ui-monospace,monospace", fontSize: 11,
            color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {l.url}
          </span>
          {l.domain && <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{l.domain}</span>}
          <span style={{ fontWeight: 700, fontSize: 10, color: colors[l.status], flexShrink: 0,
            fontFamily: "Syne,sans-serif", letterSpacing: "0.05em" }}>
            {l.status === "ok" ? "OK 200" : l.http_status ? `ERR ${l.http_status}` : l.status.toUpperCase()}
          </span>
          <span style={{ color: C.muted, fontSize: 10, whiteSpace: "nowrap", flexShrink: 0 }}>
            {new Date(l.created_at).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      ))}
    </div>
  );
});
