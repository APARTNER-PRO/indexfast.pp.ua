// src/pages/GscMetrics.jsx
import { memo, useMemo, useState } from "react";
import { Btn } from "../components/ui/index.jsx";
import { useGscMetrics, useGscChart, useGscQueries, useGscPages, useGscDevices, useGscCountries } from "../hooks/useStats.js";
import { C } from "../constants.js";
import i18n from "../i18n/index.js";

const t = i18n.t.bind(i18n);

/* ─── Constants ─────────────────────────────────────── */
const PERIODS = [
  { label: "7 days",    days: 7  },
  { label: "1 month",   days: 30 },
  { label: "2 months",  days: 60 },
  { label: "3 months",  days: 90 },
];

const METRICS = [
  { key: "clicks",      label: t("gsc.clicks"),       color: "#00ff88", fmt: fmtMetric  },
  { key: "impressions", label: t("gsc.impressions"),  color: "#5b8cff", fmt: fmtMetric  },
  { key: "ctr",         label: t("gsc.ctr"),         color: "#ffd060", fmt: fmtCtr     },
  { key: "position",    label: t("gsc.position"),     color: "#ff6b9d", fmt: fmtPos     },
];

const COUNTRY_FLAGS = {
  "UKR": "🇺🇦", "USA": "🇺🇸", "POL": "🇵🇱", "DEU": "🇩🇪", "GBR": "🇬🇧",
  "FRA": "🇫🇷", "ITA": "🇮🇹", "ESP": "🇪🇸", "CAN": "🇨🇦", "AUS": "🇦🇺",
  "IND": "🇮🇳", "BRA": "🇧🇷", "JPN": "🇯🇵", "CHN": "🇨🇳", "KOR": "🇰🇷",
  "TUR": "🇹🇷", "NLD": "🇳🇱", "SWE": "🇸🇪", "CHE": "🇨🇭", "AUT": "🇦🇹",
  "KAZ": "🇰🇿", "BLR": "🇧🇾", "RUS": "🇷🇺", "ROU": "🇷🇴", "CZE": "🇨🇿",
  "SVK": "🇸🇰", "HUN": "🇭🇺", "BGR": "🇧🇬", "GRC": "🇬🇷", "PRT": "🇵🇹",
  "MEX": "🇲🇽", "ARG": "🇦🇷", "COL": "🇨🇴", "ZAF": "🇿🇦", "EGY": "🇪🇬",
  "SAU": "🇸🇦", "ARE": "🇦🇪", "ISR": "🇮🇱", "VNM": "🇻🇳", "THA": "🇹🇭",
  "IDN": "🇮🇩", "MYS": "🇲🇾", "SGP": "🇸🇬", "PHL": "🇵🇭", "NZL": "🇳🇿",
  "IRL": "🇮🇪", "NOR": "🇳🇴", "DNK": "🇩🇰", "FIN": "🇫🇮", "BEL": "🇧🇪",
  "ZZZ": "🏳️"
};
const getFlag = (code) => COUNTRY_FLAGS[code] || "🏳️";

/* ─── Formatters ─────────────────────────────────────── */
function fmtMetric(v) {
  if (v == null || isNaN(v)) return "—";
  return Number(v).toLocaleString("uk-UA");
}
function fmtCtr(v) {
  if (v == null || isNaN(v)) return "—";
  return `${(Number(v) * 100).toFixed(1)}%`;
}
function fmtPos(v) {
  if (v == null || isNaN(v)) return "—";
  return Number(v).toFixed(1);
}
function fmtDate(v) {
  if (!v) return "—";
  return new Date(v).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function fmtShortDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("uk-UA", { day: "2-digit", month: "2-digit" });
}

/* ─── Trend badge ────────────────────────────────────── */
function TrendBadge({ current, previous, metricKey }) {
  if (!previous || previous === 0) return null;
  const delta = current - previous;
  const pct   = Math.abs(Math.round((delta / previous) * 100));
  if (pct === 0) return null;
  // For position: lower number = better ranking → invert both color and arrow
  const isPos  = metricKey === "position";
  const isGood = isPos ? delta < 0 : delta > 0;
  const color  = isGood ? C.green : "#ff4d6d";
  // Arrow shows ranking direction, not numeric direction
  const arrow  = isPos
    ? (delta < 0 ? "↑" : "↓")   // number down = rank up ↑
    : (delta > 0 ? "↑" : "↓");
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, marginLeft: 6 }}>
      {arrow}{pct}%
    </span>
  );
}


/* ─── SVG Line Chart ─────────────────────────────────── */
const CHART_H = 200;
const CHART_PAD = { top: 16, bottom: 32, left: 48, right: 16 };

function LineChart({ currentData, previousData, metricKey, color }) {
  const [tooltip, setTooltip] = useState(null);

  const allVals = [
    ...currentData.map(d => d[metricKey]),
    ...previousData.map(d => d[metricKey]),
  ].filter(v => v != null && !isNaN(v));

  const minV = Math.min(0, ...allVals);
  const maxV = Math.max(1, ...allVals);
  const range = maxV - minV || 1;

  const fmt   = METRICS.find(m => m.key === metricKey)?.fmt ?? fmtMetric;
  const n     = Math.max(currentData.length, 1);

  // Responsive width via viewBox
  const VW = 800;
  const innerW = VW - CHART_PAD.left - CHART_PAD.right;
  const innerH = CHART_H - CHART_PAD.top - CHART_PAD.bottom;

  const xOf = (i, total) => CHART_PAD.left + (total <= 1 ? innerW / 2 : (i / (total - 1)) * innerW);
  const yOf = (v) => CHART_PAD.top + innerH - ((v - minV) / range) * innerH;

  const toPath = (data) => {
    if (!data.length) return "";
    return data.map((d, i) => {
      const x = xOf(i, data.length);
      const y = yOf(d[metricKey] ?? 0);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
  };

  const toArea = (data) => {
    if (!data.length) return "";
    const base = yOf(minV);
    const pts  = data.map((d, i) => `${xOf(i, data.length).toFixed(1)},${yOf(d[metricKey] ?? 0).toFixed(1)}`);
    return `M ${xOf(0, data.length).toFixed(1)},${base} ` +
           `L ${pts.join(" L ")} ` +
           `L ${xOf(data.length - 1, data.length).toFixed(1)},${base} Z`;
  };

  // Y-axis ticks
  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => minV + (range / ticks) * i);

  // X-axis labels — show ~6 evenly spaced
  const xLabelCount = Math.min(6, currentData.length);
  const xLabelIdxs  = xLabelCount <= 1
    ? [0]
    : Array.from({ length: xLabelCount }, (_, i) =>
        Math.round(i * (currentData.length - 1) / (xLabelCount - 1)));

  const gradId = `g-${metricKey}`;
  const prevGradId = `gp-${metricKey}`;

  return (
    <div style={{ position: "relative", userSelect: "none" }}
      onMouseLeave={() => setTooltip(null)}>
      <svg
        viewBox={`0 0 ${VW} ${CHART_H}`}
        style={{ width: "100%", height: CHART_H, display: "block", overflow: "visible" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const svgX = ((e.clientX - rect.left) / rect.width) * VW;
          const relX = svgX - CHART_PAD.left;
          if (relX < 0 || relX > innerW || !currentData.length) return;
          const idx = Math.round((relX / innerW) * (currentData.length - 1));
          const clamped = Math.max(0, Math.min(currentData.length - 1, idx));
          setTooltip({
            idx: clamped,
            x: xOf(clamped, currentData.length),
            cur: currentData[clamped],
            prev: previousData[clamped] ?? null,
          });
        }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={prevGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={CHART_PAD.left} y1={yOf(tick)}
              x2={VW - CHART_PAD.right} y2={yOf(tick)}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1"
            />
            <text
              x={CHART_PAD.left - 6} y={yOf(tick) + 4}
              textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.35)">
              {fmt(tick)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabelIdxs.map(i => (
          <text key={i}
            x={xOf(i, currentData.length)}
            y={CHART_H - 4}
            textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)">
            {currentData[i] ? fmtShortDate(currentData[i].date) : ""}
          </text>
        ))}

        {/* Previous period area + line */}
        {previousData.length > 0 && (
          <>
            <path d={toArea(previousData)} fill={`url(#${prevGradId})`} />
            <path d={toPath(previousData)}
              fill="none" stroke={color} strokeWidth="1.5"
              strokeDasharray="4 3" strokeOpacity="0.4" />
          </>
        )}

        {/* Current period area + line */}
        {currentData.length > 0 && (
          <>
            <path d={toArea(currentData)} fill={`url(#${gradId})`} />
            <path d={toPath(currentData)}
              fill="none" stroke={color} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {/* Tooltip vertical line & dots */}
        {tooltip && (
          <g>
            <line
              x1={tooltip.x} y1={CHART_PAD.top}
              x2={tooltip.x} y2={CHART_H - CHART_PAD.bottom}
              stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" />
            {tooltip.cur && (
              <circle
                cx={tooltip.x}
                cy={yOf(tooltip.cur[metricKey] ?? 0)}
                r="5" fill={color} stroke="#1a1d2e" strokeWidth="2" />
            )}
            {tooltip.prev && (
              <circle
                cx={tooltip.x}
                cy={yOf(tooltip.prev[metricKey] ?? 0)}
                r="4" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
            )}
          </g>
        )}
      </svg>

      {/* Tooltip popup */}
      {tooltip?.cur && (
        <div style={{
          position: "absolute", top: 8,
          left: tooltip.x / 800 * 100 + "%",
          transform: tooltip.x > 600 ? "translateX(-110%)" : "translateX(8px)",
          background: "rgba(20,22,35,0.97)",
          border: `1px solid ${color}40`,
          borderRadius: 10, padding: "8px 12px",
          fontSize: 12, pointerEvents: "none", whiteSpace: "nowrap",
          boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
          zIndex: 10,
        }}>
          <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 4, fontSize: 10 }}>
            {fmtShortDate(tooltip.cur.date)}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, marginBottom: 2 }}>Поточний</div>
              <div style={{ color, fontWeight: 800 }}>{fmt(tooltip.cur[metricKey])}</div>
            </div>
            {tooltip.prev && (
              <div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, marginBottom: 2 }}>Попередній</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>
                  {fmt(tooltip.prev[metricKey])}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Chart legend ───────────────────────────────────── */
function ChartLegend({ color }) {
  return (
    <div style={{ display: "flex", gap: 16, fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke={color} strokeWidth="2"/></svg>
         {t("gsc.currentPeriod")}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="20" height="2">
          <line x1="0" y1="1" x2="20" y2="1" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.5"/>
        </svg>
         {t("gsc.previousPeriod")}
      </div>
    </div>
  );
}

/* ─── Sort helper ────────────────────────────────────── */
function sortValue(row, key) {
  const m = row.metric;
  if (key === "domain") return row.site.domain;
  if (key === "gsc_url") return m?.gsc_url || row.site.gsc_url || "";
  if (key === "updated_at") return m?.updated_at || "";
  if (!m) return key === "position" ? Infinity : -Infinity;
  return m[key] ?? 0;
}

/* ─── Main component ─────────────────────────────────── */
export default memo(function GscMetrics({ sites, onImportGsc }) {
  const [period, setPeriod]     = useState(30);
  const [activeMetric, setActiveMetric] = useState("clicks");
  const [sort, setSort]         = useState({ key: "clicks", direction: "desc" });
  const [querySort, setQuerySort] = useState({ key: "clicks", direction: "desc" });
  const [pageSort, setPageSort]   = useState({ key: "clicks", direction: "desc" });
  const [chartSiteId, setChartSiteId] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchDomain, setSearchDomain] = useState("");

  const siteIds = useMemo(() => sites.map(s => s.id), [sites]);
  const enabled = siteIds.length > 0;

  // Table query uses ALL sites
  const tableQ = useGscMetrics(siteIds, period, enabled);
  
  // Chart & Queries query uses ONLY selected site(s)
  const chartQueryIds = useMemo(() => {
    if (chartSiteId === "all") return siteIds;
    return [Number(chartSiteId)];
  }, [chartSiteId, siteIds]);
  
  const chartQ = useGscChart(chartQueryIds, period, enabled && chartQueryIds.length > 0);
  const queriesQ = useGscQueries(chartQueryIds, period, 100, enabled && activeTab === "queries" && chartQueryIds.length > 0);
  const pagesQ = useGscPages(chartQueryIds, period, 100, enabled && activeTab === "pages" && chartQueryIds.length > 0);
  const devicesQ = useGscDevices(chartQueryIds, period, enabled && activeTab === "overview" && chartQueryIds.length > 0);
  const countriesQ = useGscCountries(chartQueryIds, period, 20, enabled && activeTab === "countries" && chartQueryIds.length > 0);

  const metrics = tableQ.data?.metrics ?? {};
  const missing = tableQ.data?.missing ?? [];

  const currentData  = chartQ.data?.current  ?? [];
  const previousData = chartQ.data?.previous ?? [];

  const metricCfg = METRICS.find(m => m.key === activeMetric);

  // ── Table rows
  const rows = useMemo(() => sites.map(site => ({
    site,
    metric:     metrics[site.id] ?? null,
    missingRow: missing.find(m => m.site_id === site.id),
  })), [sites, metrics, missing]);

  const filteredRows = useMemo(() => {
    if (!searchDomain.trim()) return rows;
    const lower = searchDomain.toLowerCase();
    return rows.filter(r => r.site.domain.toLowerCase().includes(lower));
  }, [rows, searchDomain]);

  const sortedRows = useMemo(() => {
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...filteredRows].sort((a, b) => {
      const av = sortValue(a, sort.key);
      const bv = sortValue(b, sort.key);
      if (typeof av === "string" || typeof bv === "string")
        return String(av).localeCompare(String(bv), "uk") * dir;
      return ((av ?? 0) - (bv ?? 0)) * dir;
    });
  }, [filteredRows, sort]);

  // ── Summary totals
  const totals = useMemo(() => sortedRows.reduce((acc, row) => {
    const m = row.metric;
    if (!m) return acc;
    acc.clicks      += Number(m.clicks      || 0);
    acc.impressions += Number(m.impressions || 0);
    acc.positionSum += Number(m.position    || 0);
    acc.counted     += 1;
    return acc;
  }, { clicks: 0, impressions: 0, positionSum: 0, counted: 0 }), [sortedRows]);

  const avgPosition = totals.counted ? totals.positionSum / totals.counted : 0;
  const ctr         = totals.impressions ? totals.clicks / totals.impressions : 0;

  // ── Previous period totals from chart data
  const prevTotals = useMemo(() => {
    if (!previousData.length) return null;
    return previousData.reduce((acc, d) => ({
      clicks:      acc.clicks      + (d.clicks      ?? 0),
      impressions: acc.impressions + (d.impressions  ?? 0),
      posSum:      acc.posSum      + (d.position     ?? 0),
      count:       acc.count       + 1,
    }), { clicks: 0, impressions: 0, posSum: 0, count: 0 });
  }, [previousData]);
  const prevAvgPos = prevTotals?.count ? prevTotals.posSum / prevTotals.count : 0;
  const prevCtr    = prevTotals?.impressions ? prevTotals.clicks / prevTotals.impressions : 0;

  const changeSort = (key) => setSort(prev =>
    prev.key === key
      ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
      : { key, direction: key === "domain" || key === "gsc_url" ? "asc" : "desc" }
  );
  const sortIcon = (key) => sort.key === key ? (sort.direction === "asc" ? "↑" : "↓") : "↕";

  return (
    <div>
      {/* ── Header ── */}
      <div className="gsc-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 4 }}>
            Google Search Console
          </h2>
          <div style={{ fontSize: 13, color: C.muted }}>
            {t("gsc.subtitle")}
          </div>
        </div>
        {onImportGsc && (
          <Btn variant="outline" onClick={onImportGsc} style={{ padding: "8px 16px", fontSize: 13 }}>
            {t("gsc.connectOrUpdate")}
          </Btn>
        )}
      </div>

      {/* ── Filters & Tabs ── */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 16 }}>
        {/* Tabs */}
        <div className="gsc-tabs" style={{ background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 12, border: `1px solid ${C.border}` }}>
          {[{ id: "overview", label: t("gsc.overviewAndCharts") }, { id: "queries", label: t("gsc.searchQueries") }, { id: "pages", label: t("gsc.topPages") }, { id: "countries", label: t("gsc.countries") }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 16px", background: activeTab === tab.id ? "rgba(255,255,255,0.08)" : "transparent",
                color: activeTab === tab.id ? C.white : C.muted, borderRadius: 8, fontWeight: 700,
                fontSize: 13, cursor: "pointer", transition: "all 0.2s", border: "none", whiteSpace: "nowrap"
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="gsc-filters" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <select 
            value={chartSiteId} 
            onChange={e => setChartSiteId(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
              color: C.white, borderRadius: 8, padding: "8px 14px", fontSize: 13,
              outline: "none", cursor: "pointer", maxWidth: 220, textOverflow: "ellipsis"
            }}
          >
            <option value="all" style={{ background: "#1a1d2e", color: "#fff" }}>{t("gsc.allSitesTotal")}</option>
            {sortedRows.map(({ site }) => (
              <option key={site.id} value={site.id} style={{ background: "#1a1d2e", color: "#fff" }}>
                {site.domain}
              </option>
            ))}
          </select>
          
          <div className="gsc-period-btns" style={{ display: "flex", gap: 8 }}>
            {PERIODS.map(p => (
              <button key={p.days} onClick={() => setPeriod(p.days)}
                style={{
                  border: `1px solid ${period === p.days ? "rgba(0,255,136,0.55)" : C.border}`,
                  background: period === p.days ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)",
                  color: period === p.days ? C.green : C.muted, borderRadius: 999,
                  padding: "7px 14px", fontSize: 12, fontWeight: 700,
                  fontFamily: "Syne,sans-serif", cursor: "pointer", transition: "all 0.2s",
                }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {tableQ.error && (
        <div style={{ background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.22)",
          borderRadius: 14, padding: "12px 14px", color: C.red, fontSize: 13, marginBottom: 16 }}>
          {tableQ.error.message}
        </div>
      )}

      {/* ── Empty state ── */}
      {!tableQ.isLoading && sites.length === 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: "40px 24px", textAlign: "center", color: C.muted }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🌐</div>
          <div style={{ color: C.white, fontWeight: 700, marginBottom: 6 }}>{t("gsc.noSitesAdded")}</div>
          <div>{t("gsc.addSiteOrImport")}</div>
        </div>
      )}

      {sites.length > 0 && activeTab === "overview" && (
        <>
          {/* ── Summary cards ── */}
          <div className="gsc-metrics-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 12, marginBottom: 20 }}>
               {[
                { label: t("gsc.impressions"), value: fmtMetric(totals.impressions), color: "#5b8cff", metricKey: "impressions", cur: totals.impressions, prev: prevTotals?.impressions },
                { label: t("gsc.clicks"),      value: fmtMetric(totals.clicks),      color: C.green,   metricKey: "clicks",      cur: totals.clicks,      prev: prevTotals?.clicks      },
                { label: t("gsc.ctr"),         value: fmtCtr(ctr),                   color: C.gold,    metricKey: "ctr",         cur: ctr,                prev: prevCtr                 },
                { label: t("gsc.avgPosition"), value: fmtPos(avgPosition),           color: "#ff6b9d", metricKey: "position",    cur: avgPosition,        prev: prevAvgPos              },
            ].map(card => (
              <div key={card.label}
                onClick={() => setActiveMetric(card.metricKey)}
                style={{
                  background: activeMetric === card.metricKey
                    ? `rgba(${card.color === C.green ? "0,255,136" : card.color === C.gold ? "255,208,96" : card.color === "#5b8cff" ? "91,140,255" : "255,107,157"},0.08)`
                    : C.card,
                  border: `1px solid ${activeMetric === card.metricKey ? card.color + "55" : C.border}`,
                  borderRadius: 16, padding: "16px 18px", cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: C.muted, marginBottom: 6 }}>
                  {card.label}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 800, color: card.color }}>
                    {tableQ.isLoading ? <span style={{ opacity: 0.3 }}>…</span> : card.value}
                  </div>
                  {!tableQ.isLoading && (
                    <TrendBadge current={card.cur} previous={card.prev} metricKey={card.metricKey} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Metric switcher ── */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {METRICS.map(m => (
              <button key={m.key} onClick={() => setActiveMetric(m.key)}
                style={{
                  border: `1px solid ${activeMetric === m.key ? m.color + "66" : C.border}`,
                  background: activeMetric === m.key ? m.color + "18" : "rgba(255,255,255,0.03)",
                  color: activeMetric === m.key ? m.color : C.muted,
                  borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 700,
                  fontFamily: "Syne,sans-serif", cursor: "pointer", transition: "all 0.15s",
                }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* ── Charts Grid ── */}
          <div className="gsc-charts-grid" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, marginBottom: 20 }}>
            {/* ── Chart block ── */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
              padding: "20px 20px 12px" }}>
              {chartQ.isLoading ? (
                <div style={{ height: CHART_H, display: "flex", alignItems: "center",
                  justifyContent: "center", color: C.muted, fontSize: 13 }}>
                  {t("gsc.loadingChart")}
                </div>
              ) : chartQ.error ? (
                <div style={{ height: CHART_H, display: "flex", alignItems: "center", flexDirection: "column", gap: 8,
                  justifyContent: "center", color: C.red, fontSize: 13 }}>
                  <div>{t("gsc.chartError")}</div>
                  <div style={{ opacity: 0.6, fontSize: 11, maxWidth: "80%", textAlign: "center" }}>
                    {chartQ.error.message}
                  </div>
                </div>
              ) : currentData.length === 0 ? (
                <div style={{ height: CHART_H, display: "flex", alignItems: "center",
                  justifyContent: "center", color: C.muted, fontSize: 13 }}>
                  {t("gsc.noChartData")}
                </div>
              ) : (
                <>
                  <LineChart
                    currentData={currentData}
                    previousData={previousData}
                    metricKey={activeMetric}
                    color={metricCfg.color}
                  />
                  <ChartLegend color={metricCfg.color} />
                </>
              )}
            </div>

            {/* ── Devices block ── */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.white, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("gsc.devicesTitle")}</div>
              {devicesQ.isLoading ? (
                <div style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 40 }}>{t("gsc.loadingDevices")}</div>
              ) : devicesQ.error ? (
                <div style={{ color: C.red, fontSize: 12, textAlign: "center", marginTop: 40 }}>{t("gsc.devicesError")}</div>
              ) : !devicesQ.data?.devices?.length ? (
                <div style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 40 }}>{t("gsc.noDevicesData")}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {devicesQ.data.devices.map(d => {
                    const maxClicks = Math.max(...devicesQ.data.devices.map(x => x.clicks));
                    const pct = maxClicks > 0 ? (d.clicks / maxClicks) * 100 : 0;
                    const isMobile = d.device === "MOBILE";
                    const isTablet = d.device === "TABLET";
                    const devColor = isMobile ? "#ff6b9d" : isTablet ? "#ffd060" : "#5b8cff";
                    const label = isMobile ? t("gsc.mobile") : isTablet ? t("gsc.tablet") : t("gsc.desktop");
                    
                    return (
                      <div key={d.device}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                          <span style={{ color: C.muted, fontWeight: 600 }}>{label}</span>
                          <span style={{ fontWeight: 800, color: C.white }}>{fmtMetric(d.clicks)}</span>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.05)", height: 8, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: devColor, borderRadius: 4, transition: "width 0.5s ease-out" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginTop: 4, color: "rgba(255,255,255,0.3)" }}>
                          <span>{t("gsc.ctrLabel")} {fmtCtr(d.ctr)}</span>
                          <span>{t("gsc.posLabel")} {fmtPos(d.position)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Sites table ── */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{t("gsc.sitesStats")}</h3>
            <input 
              type="text" 
              placeholder={t("gsc.searchPlaceholder")} 
              value={searchDomain} 
              onChange={e => setSearchDomain(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
                color: C.white, borderRadius: 8, padding: "8px 14px", fontSize: 13,
                outline: "none", width: "100%", maxWidth: 240
              }}
            />
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)" }}>
                    {[
                      ["domain",     t("gsc.site")],
                      ["gsc_url",    t("gsc.gscResource")],
                      ["impressions",t("gsc.impressions")],
                      ["clicks",     t("gsc.clicks")],
                      ["ctr",        t("gsc.ctr")],
                      ["position",   t("gsc.position")],
                      ["updated_at", t("gsc.updated")],
                    ].map(([key, label]) => (
                      <th key={key} onClick={() => changeSort(key)}
                        style={{ padding: "12px 16px", textAlign: "left", color: sort.key === key ? C.green : C.muted,
                          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
                          textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>
                        {label} <span style={{ opacity: sort.key === key ? 1 : 0.5 }}>{sortIcon(key)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableQ.isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} style={{ padding: "14px 16px" }}>
                            <div style={{ height: 12, borderRadius: 4,
                              background: "rgba(255,255,255,0.06)",
                              width: j === 0 ? "60%" : j === 1 ? "80%" : "40%",
                              animation: "pulse 1.5s ease-in-out infinite" }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : sortedRows.map(({ site, metric, missingRow }) => (
                    <tr key={site.id}
                      style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 700, color: C.white }}>{site.domain}</div>
                        {missingRow && (
                          <div style={{ fontSize: 11, color: C.gold, marginTop: 3 }}>
                            {t("gsc.missingData", { reason: missingRow.reason })}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", color: C.muted, maxWidth: 220,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {metric?.gsc_url || site.gsc_url || "—"}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#5b8cff", fontWeight: 700 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {fmtMetric(metric?.impressions)}
                          <TrendBadge current={metric?.impressions} previous={metric?.prev_impressions} metricKey="impressions" />
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", color: C.green, fontWeight: 700 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {fmtMetric(metric?.clicks)}
                          <TrendBadge current={metric?.clicks} previous={metric?.prev_clicks} metricKey="clicks" />
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", color: C.gold, fontWeight: 700 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {fmtCtr(metric?.ctr)}
                          <TrendBadge current={metric?.ctr} previous={metric?.prev_ctr} metricKey="ctr" />
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#ff6b9d", fontWeight: 700 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {fmtPos(metric?.position)}
                          <TrendBadge current={metric?.position} previous={metric?.prev_position} metricKey="position" />
                        </div>
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

      {sites.length > 0 && activeTab === "queries" && (() => {
        const toggleQuerySort = (key) => setQuerySort(prev =>
          prev.key === key
            ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
            : { key, direction: key === "position" ? "asc" : "desc" }
        );
        const qSortIcon = (key) => querySort.key === key ? (querySort.direction === "asc" ? " ↑" : " ↓") : "";
        const sortedQueries = queriesQ.data?.queries ? [...queriesQ.data.queries].sort((a, b) => {
          const dir = querySort.direction === "asc" ? 1 : -1;
          return ((a[querySort.key] ?? 0) - (b[querySort.key] ?? 0)) * dir;
        }) : [];
        
        const thStyle = (key) => ({
          padding: "12px 16px", textAlign: "left",
          color: querySort.key === key ? C.green : C.muted,
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
          textTransform: "uppercase", whiteSpace: "nowrap",
          cursor: "pointer", userSelect: "none",
          transition: "color 0.15s"
        });
        return (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            {queriesQ.isLoading ? (
               <div style={{ padding: 40, textAlign: "center", color: C.muted }}>{t("gsc.loadingQueries")}</div>
            ) : queriesQ.error ? (
              <div style={{ padding: 40, textAlign: "center", color: C.red }}>
                {t("gsc.queriesError")}<br/>
                <small style={{ opacity: 0.6 }}>{queriesQ.error.message}</small>
              </div>
            ) : !sortedQueries.length ? (
              <div style={{ padding: 40, textAlign: "center", color: C.muted }}>{t("gsc.noQueriesData")}</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", color: C.muted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{t("gsc.query")}</th>
                      {chartSiteId === "all" && (
                        <th style={{ padding: "12px 16px", textAlign: "left", color: C.muted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{t("gsc.site")}</th>
                      )}
                      <th style={thStyle("clicks")} onClick={() => toggleQuerySort("clicks")}>{t("gsc.clicks")}{qSortIcon("clicks")}</th>
                      <th style={thStyle("impressions")} onClick={() => toggleQuerySort("impressions")}>{t("gsc.impressions")}{qSortIcon("impressions")}</th>
                      <th style={thStyle("ctr")} onClick={() => toggleQuerySort("ctr")}>{t("gsc.ctr")}{qSortIcon("ctr")}</th>
                      <th style={thStyle("position")} onClick={() => toggleQuerySort("position")}>{t("gsc.position")}{qSortIcon("position")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedQueries.map((q, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: C.white, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {q.query}
                        </td>
                        {chartSiteId === "all" && (
                          <td style={{ padding: "14px 16px", color: C.muted, fontSize: 12 }}>{q.domain}</td>
                        )}
                        <td style={{ padding: "14px 16px", color: C.green, fontWeight: 700 }}>{fmtMetric(q.clicks)}</td>
                        <td style={{ padding: "14px 16px", color: "#5b8cff", fontWeight: 700 }}>{fmtMetric(q.impressions)}</td>
                        <td style={{ padding: "14px 16px", color: C.gold, fontWeight: 700 }}>{fmtCtr(q.ctr)}</td>
                        <td style={{ padding: "14px 16px", color: "#ff6b9d", fontWeight: 700 }}>{fmtPos(q.position)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}

      {sites.length > 0 && activeTab === "pages" && (() => {
        const togglePageSort = (key) => setPageSort(prev =>
          prev.key === key
            ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
            : { key, direction: key === "position" ? "asc" : "desc" }
        );
        const pSortIcon = (key) => pageSort.key === key ? (pageSort.direction === "asc" ? " ↑" : " ↓") : "";
        const sortedPages = pagesQ.data?.pages ? [...pagesQ.data.pages].sort((a, b) => {
          const dir = pageSort.direction === "asc" ? 1 : -1;
          return ((a[pageSort.key] ?? 0) - (b[pageSort.key] ?? 0)) * dir;
        }) : [];
        
        const thStyle = (key) => ({
          padding: "12px 16px", textAlign: "left",
          color: pageSort.key === key ? C.green : C.muted,
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
          textTransform: "uppercase", whiteSpace: "nowrap",
          cursor: "pointer", userSelect: "none",
          transition: "color 0.15s"
        });
        return (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            {pagesQ.isLoading ? (
              <div style={{ padding: 40, textAlign: "center", color: C.muted }}>{t("gsc.loadingPages")}</div>
            ) : pagesQ.error ? (
              <div style={{ padding: 40, textAlign: "center", color: C.red }}>
                {t("gsc.pagesError")}<br/>
                <small style={{ opacity: 0.6 }}>{pagesQ.error.message}</small>
              </div>
            ) : !sortedPages.length ? (
              <div style={{ padding: 40, textAlign: "center", color: C.muted }}>{t("gsc.noPagesData")}</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", color: C.muted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>URL</th>
                      {chartSiteId === "all" && (
                        <th style={{ padding: "12px 16px", textAlign: "left", color: C.muted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Сайт</th>
                      )}
                      <th style={thStyle("clicks")} onClick={() => togglePageSort("clicks")}>Кліки{pSortIcon("clicks")}</th>
                      <th style={thStyle("impressions")} onClick={() => togglePageSort("impressions")}>Покази{pSortIcon("impressions")}</th>
                      <th style={thStyle("ctr")} onClick={() => togglePageSort("ctr")}>CTR{pSortIcon("ctr")}</th>
                      <th style={thStyle("position")} onClick={() => togglePageSort("position")}>Позиція{pSortIcon("position")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPages.map((p, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: C.white, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <a href={p.page} target="_blank" rel="noreferrer" style={{ color: "#5b8cff", textDecoration: "none" }}>{p.page}</a>
                        </td>
                        {chartSiteId === "all" && (
                          <td style={{ padding: "14px 16px", color: C.muted, fontSize: 12 }}>{p.domain}</td>
                        )}
                        <td style={{ padding: "14px 16px", color: C.green, fontWeight: 700 }}>{fmtMetric(p.clicks)}</td>
                        <td style={{ padding: "14px 16px", color: "#5b8cff", fontWeight: 700 }}>{fmtMetric(p.impressions)}</td>
                        <td style={{ padding: "14px 16px", color: C.gold, fontWeight: 700 }}>{fmtCtr(p.ctr)}</td>
                        <td style={{ padding: "14px 16px", color: "#ff6b9d", fontWeight: 700 }}>{fmtPos(p.position)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}

      {sites.length > 0 && activeTab === "countries" && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", padding: "24px 0" }}>
          {countriesQ.isLoading ? (
            <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Завантажуємо статистику по країнах...</div>
          ) : countriesQ.error ? (
            <div style={{ padding: 40, textAlign: "center", color: C.red }}>
              Помилка завантаження<br/>
              <small style={{ opacity: 0.6 }}>{countriesQ.error.message}</small>
            </div>
          ) : !countriesQ.data?.countries?.length ? (
            <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Немає даних по країнах за цей period</div>
          ) : (
            <div style={{ padding: "0 24px" }}>
              {countriesQ.data.countries.map((c, i) => {
                const maxClicks = Math.max(...countriesQ.data.countries.map(x => x.clicks));
                const pct = maxClicks > 0 ? (c.clicks / maxClicks) * 100 : 0;
                
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px", gap: 16, alignItems: "center", marginBottom: 16, paddingBottom: 16, borderBottom: i < countriesQ.data.countries.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    {/* Country label */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: C.white }}>
                      <span style={{ fontSize: 20 }}>{getFlag(c.country)}</span>
                      <span>{c.country}</span>
                    </div>
                    
                    {/* Bar and secondary stats */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ background: "rgba(255,255,255,0.05)", height: 8, borderRadius: 4, overflow: "hidden", width: "100%" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: C.green, borderRadius: 4, transition: "width 0.5s ease-out" }} />
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                        <span>Покази: {fmtMetric(c.impressions)}</span>
                        <span>CTR: {fmtCtr(c.ctr)}</span>
                        <span>Поз: {fmtPos(c.position)}</span>
                      </div>
                    </div>
                    
                    {/* Main Metric */}
                    <div style={{ textAlign: "right", color: C.green, fontWeight: 800, fontSize: 16 }}>
                      {fmtMetric(c.clicks)} кліків
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.8; }
        }
        .gsc-tabs { display: flex; gap: 4px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .gsc-tabs::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .gsc-header { flex-direction: column; align-items: flex-start !important; gap: 16px; }
          .gsc-filters { width: 100%; flex-direction: column; align-items: stretch !important; gap: 12px; }
          .gsc-filters select { max-width: 100% !important; }
          .gsc-period-btns { display: flex; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .gsc-period-btns::-webkit-scrollbar { display: none; }
          .gsc-period-btns button { white-space: nowrap; }
          .gsc-metrics-cards { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .gsc-charts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
});
