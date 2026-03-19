// src/pages/Sites.jsx  ← окремий chunk (lazy)
import { memo, useState } from "react";
import { SitesTable }    from "../components/SitesTable.jsx";
import { Btn, Badge }    from "../components/ui/index.jsx";
import { C }             from "../constants.js";

export default memo(function Sites({
  sites, sitesList, sitesLimit, plan,
  today, onAddSite, onRun, onDelete, onToggle,
}) {
  const [filter, setFilter] = useState("all");  // all | active | paused | error

  const filtered = filter === "all"
    ? sitesList
    : sitesList.filter(s => s.status === filter);

  const counts = {
    all:    sitesList.length,
    active: sitesList.filter(s => s.status === "active").length,
    paused: sitesList.filter(s => s.status === "paused").length,
    error:  sitesList.filter(s => s.status === "error").length,
  };

  const remaining = today.remaining;
  const canAdd    = sitesList.length < sitesLimit;

  return (
    <div>
      {/* Заголовок */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 20,
            marginBottom: 4 }}>Мої сайти</h2>
          <div style={{ fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 8 }}>
            <span>{sitesList.length} з {sitesLimit < 9999 ? sitesLimit : "∞"} сайтів</span>
            <span style={{ color: C.border }}>·</span>
            <Badge plan={plan}/>
          </div>
        </div>
        <Btn variant="primary" onClick={onAddSite}
          disabled={!canAdd}
          title={!canAdd ? `Ліміт плану: ${sitesLimit} сайтів` : "Додати новий сайт"}>
          + Додати сайт
        </Btn>
      </div>

      {/* Ліміт плану */}
      {!canAdd && (
        <div style={{ background: "rgba(255,208,96,0.06)", border: "1px solid rgba(255,208,96,0.2)",
          borderRadius: 14, padding: "14px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, color: C.gold, fontWeight: 600 }}>
              Досягнуто ліміту плану
            </span>
            <span style={{ fontSize: 13, color: C.muted, marginLeft: 8 }}>
              Оновіть план щоб підключити більше сайтів
            </span>
          </div>
          <Btn variant="primary" onClick={() => window.location.href = "/#pricing"}
            style={{ padding: "7px 16px", fontSize: 12, flexShrink: 0 }}>
            Оновити план →
          </Btn>
        </div>
      )}

      {/* Денний ліміт */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
        gap: 12, marginBottom: 24 }}>
        {[
          { label: "URL сьогодні", value: today.sent, max: today.limit,
            note: `${remaining} залишилось`, color: remaining === 0 ? C.red : C.green },
          { label: "Активних сайтів",  value: counts.active,  max: sitesLimit < 9999 ? sitesLimit : counts.active + 1, note: "працюють",        color: C.green },
          { label: "На паузі",         value: counts.paused,  max: sitesList.length || 1,  note: "призупинено",       color: C.gold },
          { label: "Помилки",          value: counts.error,   max: sitesList.length || 1,  note: "потребують уваги",  color: counts.error > 0 ? C.red : C.muted },
        ].map(({ label, value, max, note, color }) => (
          <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 800,
              color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{note}</div>
          </div>
        ))}
      </div>

      {/* Фільтр */}
      {sitesList.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { key: "all",    label: `Всі (${counts.all})` },
            { key: "active", label: `✓ Активні (${counts.active})` },
            { key: "paused", label: `⏸ Пауза (${counts.paused})` },
            { key: "error",  label: `⚠ Помилки (${counts.error})` },
          ].map(({ key, label }) => (
            counts[key] > 0 || key === "all" ? (
              <button key={key} onClick={() => setFilter(key)}
                style={{ padding: "6px 14px", borderRadius: 10, border: "none",
                  cursor: "pointer", fontSize: 12, fontFamily: "Syne,sans-serif", fontWeight: 700,
                  background: filter === key ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)",
                  color: filter === key ? C.green : C.muted, transition: "all 0.15s" }}>
                {label}
              </button>
            ) : null
          ))}
        </div>
      )}

      {/* Таблиця */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 16, overflow: "hidden" }}>

        {filtered.length === 0 && filter !== "all" ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontSize: 13 }}>
            Немає сайтів зі статусом «{filter}»
          </div>
        ) : (
          <SitesTable
            sites={filtered}
            remaining={remaining}
            onRun={onRun}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        )}
      </div>
    </div>
  );
});
