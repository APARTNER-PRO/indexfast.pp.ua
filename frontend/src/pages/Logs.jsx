// src/pages/Logs.jsx  ← окремий chunk (lazy)
import { useState, memo, useCallback } from "react";
import { useLogs }                     from "../hooks/useLogs.js";
import { Spinner, Btn }                from "../components/ui/index.jsx";
import { C }                           from "../constants.js";

const STATUS_FILTERS = [
  { value: "",        label: "Всі"        },
  { value: "ok",      label: "✓ OK"       },
  { value: "error",   label: "✕ Помилки"  },
  { value: "pending", label: "⏳ В черзі" },
];

const PAGE_SIZE = 50;

// ── Швидкі date-range пресети
const DATE_PRESETS = [
  { label: "Сьогодні",   days: 0  },
  { label: "7 днів",     days: 7  },
  { label: "30 днів",    days: 30 },
  { label: "Все",        days: -1 },
];

function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

function todayStr()    { return toDateStr(new Date()); }
function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateStr(d);
}

/* ── Mobile-responsive styles ── */
const MOBILE_STYLES = `
  @media (max-width: 600px) {
    .logs-filters { gap: 6px !important; }
    .logs-filters select { width: 100%; }
    .logs-status-btns { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .logs-status-btns::-webkit-scrollbar { display: none; }
    .logs-count { width: 100%; text-align: right; margin-left: 0 !important; }
    .logs-date-row { gap: 6px !important; }
    .logs-date-row .logs-date-inputs { width: 100%; margin-left: 0 !important; }
    .logs-date-row .logs-date-inputs input { flex: 1; min-width: 0; }
    .logs-pagination { gap: 4px !important; flex-wrap: wrap; }
    .logs-pagination .logs-page-nums { display: none; }
    .logs-pagination .logs-page-info { display: flex !important; }

    .log-row { flex-wrap: wrap !important; gap: 6px !important; padding: 10px 12px !important; }
    .log-row .log-url { order: 1; width: calc(100% - 30px); font-size: 10px !important; }
    .log-row .log-copy { order: 2; }
    .log-row .log-meta { order: 3; display: flex; width: 100%; align-items: center; gap: 8px; padding-left: 22px; }
    .log-row .log-domain { font-size: 10px !important; }
    .log-row .log-status-icon { flex-shrink: 0; }
    .log-row .log-error { max-width: none !important; flex: 1; }
  }
`;

export default memo(function Logs({ sites }) {
  const [siteId,   setSiteId]   = useState("");
  const [status,   setStatus]   = useState("");
  const [page,     setPage]     = useState(0);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [preset,   setPreset]   = useState(-1); // індекс активного пресету

  const { data, isLoading, isFetching, isError, refetch } = useLogs({
    siteId:    siteId  || undefined,
    status:    status  || undefined,
    dateFrom:  dateFrom || undefined,
    dateTo:    dateTo   || undefined,
    limit:     PAGE_SIZE,
    offset:    page * PAGE_SIZE,
  });

  const logs  = data?.logs  ?? [];
  const total = data?.total ?? 0;
  const pages = Math.ceil(total / PAGE_SIZE);

  function resetPage(fn) { fn(); setPage(0); }

  // Застосовуємо пресет
  const applyPreset = useCallback((idx) => {
    setPreset(idx);
    const { days } = DATE_PRESETS[idx];
    if (days === -1) {
      setDateFrom(""); setDateTo("");
    } else if (days === 0) {
      setDateFrom(todayStr()); setDateTo(todayStr());
    } else {
      setDateFrom(daysAgoStr(days)); setDateTo(todayStr());
    }
    setPage(0);
  }, []);

  // При ручній зміні дат — знімаємо пресет
  function onDateFromChange(v) { setDateFrom(v); setPreset(-1); setPage(0); }
  function onDateToChange(v)   { setDateTo(v);   setPreset(-1); setPage(0); }

  const icons  = { ok: "✓", error: "✕", pending: "⏳" };
  const colors = { ok: C.green, error: C.red, pending: C.gold };

  const inputStyle = {
    background: C.card, border: `1px solid ${C.border2}`, borderRadius: 10,
    padding: "7px 10px", color: C.white, fontSize: 12,
    outline: "none", fontFamily: "inherit", cursor: "pointer",
  };

  return (
    <div>
      <style>{MOBILE_STYLES}</style>

      {/* Заголовок */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 20 }}>
          Логи індексації
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isFetching && !isLoading && <Spinner size={16}/>}
          <Btn variant="ghost" onClick={refetch}
            style={{ padding: "6px 12px", fontSize: 12 }}>
            ↻ Оновити
          </Btn>
        </div>
      </div>

      {/* ── Фільтри */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>

        {/* Рядок 1: сайт + статус + лічильник */}
        <div className="logs-filters" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {sites?.length > 1 && (
            <select value={siteId}
              onChange={e => resetPage(() => setSiteId(e.target.value))}
              style={inputStyle}>
              <option value="">Всі сайти</option>
              {sites.map(s => (
                <option key={s.id} value={s.id}>{s.domain}</option>
              ))}
            </select>
          )}

          <div className="logs-status-btns" style={{ display: "flex", gap: 4 }}>
            {STATUS_FILTERS.map(f => (
              <button key={f.value}
                onClick={() => resetPage(() => setStatus(f.value))}
                style={{ padding: "6px 14px", borderRadius: 10, border: "none",
                  cursor: "pointer", fontSize: 12, whiteSpace: "nowrap",
                  fontFamily: "Syne,sans-serif", fontWeight: 700,
                  background: status === f.value
                    ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)",
                  color: status === f.value ? C.green : C.muted,
                  transition: "all 0.15s" }}>
                {f.label}
              </button>
            ))}
          </div>

          <span className="logs-count" style={{ fontSize: 12, color: C.muted, marginLeft: "auto" }}>
            {total.toLocaleString("uk-UA")} записів
          </span>
        </div>

        {/* Рядок 2: фільтр за датою */}
        <div className="logs-date-row" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {/* Пресети */}
          {DATE_PRESETS.map((p, i) => (
            <button key={i} onClick={() => applyPreset(i)}
              style={{ padding: "5px 12px", borderRadius: 8, border: "none",
                cursor: "pointer", fontSize: 12,
                fontFamily: "Syne,sans-serif", fontWeight: 600,
                background: preset === i
                  ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)",
                color: preset === i ? C.green : C.muted,
                transition: "all 0.15s" }}>
              {p.label}
            </button>
          ))}

          <div className="logs-date-inputs" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
            <span style={{ fontSize: 11, color: C.muted }}>від</span>
            <input type="date" value={dateFrom}
              onChange={e => onDateFromChange(e.target.value)}
              max={dateTo || todayStr()}
              style={inputStyle}/>
            <span style={{ fontSize: 11, color: C.muted }}>до</span>
            <input type="date" value={dateTo}
              onChange={e => onDateToChange(e.target.value)}
              min={dateFrom} max={todayStr()}
              style={inputStyle}/>
          </div>

          {/* Скидання дат */}
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(""); setDateTo(""); setPreset(-1); setPage(0); }}
              style={{ padding: "5px 10px", borderRadius: 8, border: "none",
                cursor: "pointer", fontSize: 11, color: C.muted,
                background: "rgba(255,255,255,0.04)" }}>
              ✕ Скинути дати
            </button>
          )}
        </div>
      </div>

      {/* Таблиця */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 16, overflow: "hidden" }}>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
            <Spinner size={28}/>
          </div>
        ) : isError ? (
          <div style={{ textAlign: "center", padding: "48px 20px", color: C.muted }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <p style={{ marginBottom: 16 }}>Помилка завантаження логів</p>
            <Btn variant="outline" onClick={refetch}>Повторити</Btn>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", color: C.muted }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>📋</div>
            <p style={{ marginBottom: 8 }}>
              {status || siteId || dateFrom || dateTo
                ? "Нічого не знайдено за фільтром"
                : "Логів ще немає"}
            </p>
            {!status && !siteId && !dateFrom && (
              <p style={{ fontSize: 12 }}>Запустіть індексацію щоб побачити логи</p>
            )}
          </div>
        ) : (
          <div style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto", overflowX: "auto",
            WebkitOverflowScrolling: "touch" }}>
            {logs.map((l, i) => (
              <LogRow key={l.id ?? i} log={l} icons={icons} colors={colors}/>
            ))}
          </div>
        )}
      </div>

      {/* Пагінація */}
      {pages > 1 && (
        <div className="logs-pagination" style={{ display: "flex", justifyContent: "center",
          alignItems: "center", gap: 8, marginTop: 16 }}>
          <Btn variant="ghost" disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            style={{ padding: "7px 16px", fontSize: 13 }}>← Попередня</Btn>

          <span className="logs-page-nums">
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
              const p = page < 3 ? i : page > pages - 4 ? pages - 7 + i : page - 3 + i;
              if (p < 0 || p >= pages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 36, height: 36, borderRadius: 10, border: "none",
                    cursor: "pointer", fontFamily: "Syne,sans-serif", fontWeight: 700,
                    fontSize: 13,
                    background: p === page ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)",
                    color: p === page ? C.green : C.muted }}>
                  {p + 1}
                </button>
              );
            })}
          </span>

          {/* Mobile-only page info */}
          <span className="logs-page-info" style={{ display: "none", fontSize: 12,
            color: C.muted, fontFamily: "Syne,sans-serif", fontWeight: 700 }}>
            {page + 1} / {pages}
          </span>

          <Btn variant="ghost" disabled={page >= pages - 1}
            onClick={() => setPage(p => p + 1)}
            style={{ padding: "7px 16px", fontSize: 13 }}>Наступна →</Btn>
        </div>
      )}
    </div>
  );
});

const LogRow = memo(function LogRow({ log: l, icons, colors }) {
  const [copied, setCopied] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText(l.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="log-row" style={{ display: "flex", alignItems: "center", gap: 10,
      padding: "10px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.015)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

      {/* Статуси */}
      <div className="log-status-icon" style={{ display: "flex", gap: 6, flexShrink: 0, width: 48, alignItems: "center" }}>
        <span title={`Google: ${l.status}`} style={{ color: colors[l.status], fontWeight: 800 }}>
          <span style={{ fontSize: 9, marginRight: 2, color: C.muted }}>G</span>
          {icons[l.status] ?? "?"}
        </span>
        {l.indexnow_status && (
          <span title={`IndexNow: ${l.indexnow_status} (${l.indexnow_http_status})`} 
            style={{ color: colors[l.indexnow_status] ?? C.muted, fontWeight: 800 }}>
            <span style={{ fontSize: 9, marginRight: 2, color: C.muted }}>I</span>
            {icons[l.indexnow_status] ?? "?"}
          </span>
        )}
      </div>

      {/* URL */}
      <span className="log-url" style={{ flex: 1, fontFamily: "ui-monospace,monospace", fontSize: 11,
        color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        minWidth: 0 }}>
        {l.url}
      </span>

      {/* Копіювання */}
      <button className="log-copy" onClick={copyUrl} title="Копіювати URL"
        style={{ flexShrink: 0, background: "none", border: "none",
          cursor: "pointer", fontSize: 12, color: copied ? C.green : C.muted,
          padding: "2px 6px", borderRadius: 6,
          transition: "color 0.2s" }}>
        {copied ? "✓" : "⎘"}
      </button>

      {/* Мета-інформація (на мобільному зливається в окремий рядок) */}
      <span className="log-meta" style={{ display: "contents" }}>
        {/* Домен */}
        {l.domain && (
          <span className="log-domain" style={{ fontSize: 11, color: C.muted, flexShrink: 0,
            background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 6 }}>
            {l.domain}
          </span>
        )}

        {/* HTTP код */}
        <span style={{ fontWeight: 700, fontSize: 10, flexShrink: 0,
          fontFamily: "Syne,sans-serif", letterSpacing: "0.05em",
          color: colors[l.status] }}>
          {l.status === "ok" ? "200" : l.http_status ? `${l.http_status}` : l.status?.toUpperCase()}
        </span>

        {/* Помилка */}
        {l.error_msg && (
          <span className="log-error" title={l.error_msg} style={{ fontSize: 10, color: C.red,
            flexShrink: 0, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap" }}>
            {l.error_msg}
          </span>
        )}

        {/* Дата */}
        <span style={{ color: C.muted, fontSize: 10, whiteSpace: "nowrap", flexShrink: 0,
          marginLeft: "auto" }}>
          {new Date(l.created_at).toLocaleString("uk-UA", {
            day: "2-digit", month: "2-digit",
            hour: "2-digit", minute: "2-digit",
          })}
        </span>
      </span>
    </div>
  );
});
