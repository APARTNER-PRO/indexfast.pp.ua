// src/pages/Overview.jsx  ← окремий chunk
import { memo, useCallback } from "react";
import { Badge, Btn, ProgressBar, Sparkline } from "../components/ui/index.jsx";
import { SitesTable } from "../components/SitesTable.jsx";
import { useGscMetrics } from "../hooks/useStats.js";
import { C } from "../constants.js";

const OVERVIEW_MOBILE = `
  @media (max-width: 640px) {
    .ov-upgrade { flex-direction: column !important; align-items: flex-start !important; padding: 16px !important; gap: 12px !important; }
    .ov-upgrade .ov-upgrade-btn { width: 100%; }
    .ov-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    .ov-stats > div { padding: 14px 16px !important; border-radius: 12px !important; }
    .ov-stats .ov-stat-value { font-size: 22px !important; }
    .ov-mid { grid-template-columns: 1fr !important; gap: 12px !important; }
    .ov-mid > div { padding: 18px !important; }
    .ov-section-header { padding: 14px 16px !important; gap: 8px !important; }
    .ov-section-header .ov-section-btn { padding: 6px 12px !important; font-size: 11px !important; }

    .ov-log-row { gap: 8px !important; padding: 8px 12px !important; flex-wrap: wrap !important; }
    .ov-log-url { font-size: 10px !important; width: calc(100% - 26px) !important; order: 1; }
    .ov-log-icon { order: 0; }
    .ov-log-meta { order: 2; width: 100%; display: flex !important; padding-left: 28px; gap: 8px; align-items: center; }
    .ov-log-domain { display: none !important; }
  }
`;

export default memo(function Overview({
  data, onAddSite, onRun, onDelete, onToggle, onGoLogs, onGoBilling, onImportGsc,
}) {
  const { user, today, month, sites, sites_limit, logs, chart } = data;
  const plan = user.plan;
  const remaining = today.remaining;
  const siteIds = sites.map(s => s.id);
  const gscMetrics = useGscMetrics(siteIds, 28, siteIds.length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{OVERVIEW_MOBILE}</style>

      {/* Upgrade banner */}
      {plan === "start" && (
        <div className="ov-upgrade" style={{
          background: "linear-gradient(135deg,rgba(0,255,136,0.08),rgba(0,212,255,0.05))",
          border: "1px solid rgba(0,255,136,0.2)", borderRadius: 16,
          padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          position: "relative", overflow: "hidden"
        }}>
          {/* Glow effect */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg,#00ff88,#00d4ff,transparent)"
          }} />
          <span style={{ fontSize: 28 }}>🚀</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15 }}>
                Перейдіть на PRO — 100 сторінок/день
              </div>
              <span style={{
                background: "#00ff88", color: "#050508",
                fontSize: 10, fontWeight: 800, padding: "2px 8px",
                borderRadius: 100, fontFamily: "Syne,sans-serif", letterSpacing: "0.05em"
              }}>−50%</span>
            </div>
            <div style={{ fontSize: 13, color: C.muted }}>
              До 10 сайтів · Автоматичний запуск · Email-сповіщення
              <span style={{ marginLeft: 8, color: "#6a6a85", textDecoration: "line-through" }}>₴499</span>
              <span style={{ marginLeft: 6, color: "#00ff88", fontWeight: 700 }}>₴249/перший місяць</span>
            </div>
          </div>
          <Btn className="ov-upgrade-btn" variant="primary" onClick={onGoBilling}>Хочу PRO за ₴249 →</Btn>
        </div>
      )}

      {/* Stat cards */}
      <div className="ov-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
        {[
          {
            label: "Сьогодні відправлено", value: today.sent,
            sub: `${today.delta >= 0 ? "+" : ""}${today.delta} vs вчора`,
            subColor: today.delta >= 0 ? C.green : C.red, accent: C.green
          },
          {
            label: "Ліміт сьогодні", value: `${today.sent}/${today.limit}`,
            sub: `${remaining} URL залишилось`,
            subColor: remaining === 0 ? C.red : C.muted, accent: remaining === 0 ? C.red : C.gold
          },
          {
            label: "За цей місяць", value: month,
            sub: "URL відправлено", subColor: C.muted, accent: C.blue
          },
          {
            label: "Активних сайтів", value: `${sites.length}/${sites_limit}`,
            sub: plan === "start" ? "Ліміт плану" : "Підключено",
            subColor: C.muted, accent: C.green
          },
        ].map(({ label, value, sub, subColor, accent }) => (
          <div key={label} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg,${accent},transparent)`
            }} />
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: C.muted, marginBottom: 10
            }}>{label}</div>
            <div className="ov-stat-value" style={{
              fontFamily: "Syne,sans-serif", fontSize: 28, fontWeight: 800,
              letterSpacing: "-0.04em", marginBottom: 6
            }}>{value}</div>
            <div style={{ fontSize: 11, color: subColor }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Графік + Ліміти */}
      <div className="ov-mid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, marginBottom: 4 }}>Активність за 30 днів</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
            URL відправлених у Google Indexing API
          </div>
          <Sparkline data={chart} />
        </div>

        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 24, display: "flex", flexDirection: "column", gap: 20
        }}>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, marginBottom: 4 }}>Ліміти плану</div>
            <div style={{ fontSize: 12, color: C.muted }}><Badge plan={plan} /> {user.plan_label}</div>
          </div>
          {[
            {
              label: "URL сьогодні", value: today.sent, max: today.limit,
              note: `${remaining} залишилось`
            },
            {
              label: "Сайти", value: sites.length, max: sites_limit,
              note: sites_limit < 9999 ? `з ${sites_limit}` : "необмежено"
            },
          ].map(({ label, value, max, note }) => (
            <div key={label}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 13, marginBottom: 8
              }}>
                <span style={{ color: C.muted }}>{label}</span>
                <span style={{ fontWeight: 700 }}>{value}/{max < 9999 ? max : "∞"}</span>
              </div>
              <ProgressBar value={value} max={max < 9999 ? max : value + 1} />
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
        <div className="ov-section-header" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px", borderBottom: `1px solid ${C.border}`
        }}>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700 }}>Мої сайти</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sites.length} підключено</div>
          </div>
          <Btn className="ov-section-btn" variant="outline" onClick={onAddSite} style={{ padding: "7px 16px", fontSize: 13 }}>
            + Додати сайт
          </Btn>
        </div>
        <SitesTable
          sites={sites}
          remaining={remaining}
          onRun={onRun}
          onDelete={onDelete}
          onToggle={onToggle}
          gscMetrics={gscMetrics.data?.metrics ?? {}}
          gscLoading={gscMetrics.isLoading}
          gscError={gscMetrics.error}
          onImportGsc={onImportGsc}
        />
      </div>

      {/* Логи — preview */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        <div className="ov-section-header" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px", borderBottom: `1px solid ${C.border}`
        }}>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700 }}>Останні операції</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              Лог відправок у Google Indexing API
            </div>
          </div>
          <Btn className="ov-section-btn" variant="ghost" onClick={onGoLogs} style={{ padding: "7px 14px", fontSize: 12 }}>
            Всі логи →
          </Btn>
        </div>
        <LogPreview logs={logs} />
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
  const icons = { ok: "✓", error: "✕", pending: "⏳" };
  const colors = { ok: C.green, error: C.red, pending: C.gold };
  return (
    <div>
      {logs.slice(0, 10).map((l, i) => (
        <div key={i} className="ov-log-row" style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 20px", borderBottom: `1px solid ${C.border}`, fontSize: 12
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.015)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <span className="ov-log-icon" style={{ color: colors[l.status], fontWeight: 800, width: 16,
            textAlign: "center", flexShrink: 0 }}>
            {icons[l.status]}
          </span>
          <span className="ov-log-url" style={{
            flex: 1, fontFamily: "ui-monospace,monospace", fontSize: 11,
            color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            minWidth: 0
          }}>
            {l.url}
          </span>

          <span className="ov-log-meta" style={{ display: "contents" }}>
            {l.domain && <span className="ov-log-domain" style={{ fontSize: 11, color: C.muted,
              flexShrink: 0 }}>{l.domain}</span>}
            <span style={{
              fontWeight: 700, fontSize: 10, color: colors[l.status], flexShrink: 0,
              fontFamily: "Syne,sans-serif", letterSpacing: "0.05em"
            }}>
              {l.status === "ok" ? "OK 200" : l.http_status ? `ERR ${l.http_status}` : l.status.toUpperCase()}
            </span>
            <span style={{ color: C.muted, fontSize: 10, whiteSpace: "nowrap", flexShrink: 0,
              marginLeft: "auto" }}>
              {new Date(l.created_at).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
});
