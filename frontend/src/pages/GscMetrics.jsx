// src/pages/GscMetrics.jsx
import { memo, useMemo, useState } from "react";
import { Btn } from "../components/ui/index.jsx";
import { useGscMetrics } from "../hooks/useStats.js";
import { C } from "../constants.js";

const PERIODS = [
  { label: "1 місяць", days: 30 },
  { label: "2 місяці", days: 60 },
  { label: "3 місяці", days: 90 },
];

function fmtMetric(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return Number(value).toLocaleString("uk-UA");
}

function fmtCtr(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return `${(Number(value) * 100).toFixed(1)}%`;
}

function fmtPosition(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return Number(value).toFixed(2);
}

function fmtDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sortValue(row, key) {
  const m = row.metric;
  if (key === "domain") return row.site.domain;
  if (key === "gsc_url") return m?.gsc_url || row.site.gsc_url || "";
  if (key === "updated_at") return m?.updated_at || "";
  if (!m) return key === "position" ? Infinity : -Infinity;
  return m[key] ?? 0;
}

export default memo(function GscMetrics({ sites, onImportGsc }) {
  const [period, setPeriod] = useState(30);
  const [sort, setSort] = useState({ key: "clicks", direction: "desc" });
  const siteIds = sites.map(s => s.id);
  const query = useGscMetrics(siteIds, period, siteIds.length > 0);
  const metrics = query.data?.metrics ?? {};
  const missing = query.data?.missing ?? [];

  const rows = useMemo(() => sites.map(site => {
    const metric = metrics[site.id] ?? null;
    const missingRow = missing.find(m => m.site_id === site.id);
    return { site, metric, missingRow };
  }), [sites, metrics, missing]);

  const sortedRows = useMemo(() => {
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = sortValue(a, sort.key);
      const bv = sortValue(b, sort.key);
      if (typeof av === "string" || typeof bv === "string") {
        return String(av).localeCompare(String(bv), "uk") * dir;
      }
      return ((av ?? 0) - (bv ?? 0)) * dir;
    });
  }, [rows, sort]);

  const totals = useMemo(() => sortedRows.reduce((acc, row) => {
    const m = row.metric;
    if (!m) return acc;
    acc.clicks += Number(m.clicks || 0);
    acc.impressions += Number(m.impressions || 0);
    acc.positionSum += Number(m.position || 0);
    acc.counted += 1;
    return acc;
  }, { clicks: 0, impressions: 0, positionSum: 0, counted: 0 }), [sortedRows]);

  const avgPosition = totals.counted ? totals.positionSum / totals.counted : 0;
  const ctr = totals.impressions ? (totals.clicks / totals.impressions) : 0;

  const changeSort = (key) => {
    setSort(prev => prev.key === key
      ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
      : { key, direction: key === "domain" || key === "gsc_url" ? "asc" : "desc" });
  };

  const sortIcon = (key) => sort.key === key ? (sort.direction === "asc" ? "↑" : "↓") : "↕";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 4 }}>
            Google Search Console
          </h2>
          <div style={{ fontSize: 13, color: C.muted }}>
            Покази, кліки, CTR і середня позиція по всіх сайтах
          </div>
        </div>
        {onImportGsc && (
          <Btn variant="outline" onClick={onImportGsc} style={{ padding: "8px 16px", fontSize: 13 }}>
            Підключити / оновити GSC
          </Btn>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {PERIODS.map(p => (
          <button key={p.days} onClick={() => setPeriod(p.days)}
            style={{ border: `1px solid ${period === p.days ? "rgba(0,255,136,0.55)" : C.border}`,
              background: period === p.days ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)",
              color: period === p.days ? C.green : C.muted, borderRadius: 999,
              padding: "7px 14px", fontSize: 12, fontWeight: 700, fontFamily: "Syne,sans-serif",
              cursor: "pointer" }}>
            {p.label}
          </button>
        ))}
      </div>

      {query.error && (
        <div style={{ background: "rgba(255,77,109,0.08)", border: `1px solid rgba(255,77,109,0.22)`,
          borderRadius: 14, padding: "12px 14px", color: C.red, fontSize: 13, marginBottom: 16 }}>
          {query.error.message}
        </div>
      )}

      {query.isLoading && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, color: C.muted }}>
          Завантажуємо дані Google Search Console...
        </div>
      )}

      {!query.isLoading && sites.length === 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", color: C.muted }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🌐</div>
          <div style={{ color: C.white, fontWeight: 700, marginBottom: 6 }}>Сайти ще не додані</div>
          <div>Додайте сайт або імпортуйте список із Google Search Console</div>
        </div>
      )}

      {!query.isLoading && sites.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Покази", value: fmtMetric(totals.impressions), color: C.white },
              { label: "Кліки", value: fmtMetric(totals.clicks), color: C.green },
              { label: "CTR", value: fmtCtr(ctr), color: C.blue },
              { label: "Середня позиція", value: fmtPosition(avgPosition), color: C.gold },
            ].map(card => (
              <div key={card.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 18px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>
                  {card.label}
                </div>
                <div style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: card.color }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)" }}>
                    {[
                      ["domain", "Сайт"],
                      ["gsc_url", "GSC resource"],
                      ["impressions", "Покази"],
                      ["clicks", "Кліки"],
                      ["ctr", "CTR"],
                      ["position", "Позиція"],
                      ["updated_at", "Оновлено"],
                    ].map(([key, label]) => (
                      <th key={key} onClick={() => changeSort(key)}
                        style={{ padding: "12px 16px", textAlign: "left", color: C.muted,
                          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
                          textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>
                        {label} <span style={{ color: sort.key === key ? C.green : C.muted }}>{sortIcon(key)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map(({ site, metric, missingRow }) => (
                    <tr key={site.id} style={{ borderBottom: `1px solid ${C.border}` }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 700, color: C.white }}>{site.domain}</div>
                        {missingRow && (
                          <div style={{ fontSize: 11, color: C.gold, marginTop: 3 }}>
                            Немає даних: {missingRow.reason}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", color: C.muted, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {metric?.gsc_url || site.gsc_url || "—"}
                      </td>
                      <td style={{ padding: "14px 16px", color: C.white, fontWeight: 700 }}>
                        {fmtMetric(metric?.impressions)}
                      </td>
                      <td style={{ padding: "14px 16px", color: C.green, fontWeight: 700 }}>
                        {fmtMetric(metric?.clicks)}
                      </td>
                      <td style={{ padding: "14px 16px", color: C.blue, fontWeight: 700 }}>
                        {fmtCtr(metric?.ctr)}
                      </td>
                      <td style={{ padding: "14px 16px", color: C.gold, fontWeight: 700 }}>
                        {fmtPosition(metric?.position)}
                      </td>
                      <td style={{ padding: "14px 16px", color: C.muted, whiteSpace: "nowrap" }}>
                        {fmtDate(metric?.updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
