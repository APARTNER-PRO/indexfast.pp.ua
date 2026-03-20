// src/pages/Logs.jsx  ← окремий chunk (lazy)
import { useState, memo } from "react";
import { useLogs }   from "../hooks/useLogs.js";
import { Spinner, Btn } from "../components/ui/index.jsx";
import { C } from "../constants.js";

const STATUS_FILTERS = [
  { value: "",       label: "Всі"     },
  { value: "ok",     label: "✓ OK"    },
  { value: "error",  label: "✕ Помилки" },
  { value: "pending", label: "⏳ В черзі" },
];

const PAGE_SIZE = 50;

export default memo(function Logs({ sites }) {
  const [siteId, setSiteId] = useState("");
  const [status, setStatus] = useState("");
  const [page,   setPage]   = useState(0);

  const { data, isLoading, isFetching, isError, refetch } = useLogs({
    siteId: siteId || undefined,
    status: status || undefined,
    limit:  PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });

  const logs  = data?.logs  ?? [];
  const total = data?.total ?? 0;
  const pages = Math.ceil(total / PAGE_SIZE);

  // Скидаємо сторінку при зміні фільтрів
  function handleFilter(fn) {
    fn();
    setPage(0);
  }

  const icons  = { ok: "✓", error: "✕", pending: "⏳" };
  const colors = { ok: C.green, error: C.red, pending: C.gold };

  return (
    <div>
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

      {/* Фільтри */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        {/* Фільтр по сайту */}
        {sites?.length > 1 && (
          <select value={siteId}
            onChange={e => handleFilter(() => setSiteId(e.target.value))}
            style={{ background: C.card, border: `1px solid ${C.border2}`, borderRadius: 10,
              padding: "7px 12px", color: C.white, fontSize: 13, outline: "none", cursor: "pointer" }}>
            <option value="">Всі сайти</option>
            {sites.map(s => (
              <option key={s.id} value={s.id}>{s.domain}</option>
            ))}
          </select>
        )}

        {/* Фільтр по статусу */}
        <div style={{ display: "flex", gap: 4 }}>
          {STATUS_FILTERS.map(f => (
            <button key={f.value}
              onClick={() => handleFilter(() => setStatus(f.value))}
              style={{ padding: "6px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 12, fontFamily: "Syne,sans-serif", fontWeight: 700,
                background: status === f.value ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)",
                color: status === f.value ? C.green : C.muted, transition: "all 0.15s" }}>
              {f.label}
            </button>
          ))}
        </div>

        <span style={{ fontSize: 12, color: C.muted, marginLeft: "auto" }}>
          {total.toLocaleString("uk-UA")} записів
        </span>
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
              {status || siteId ? "Нічого не знайдено за фільтром" : "Логів ще немає"}
            </p>
            {!status && !siteId && (
              <p style={{ fontSize: 12 }}>Запустіть індексацію щоб побачити логи</p>
            )}
          </div>
        ) : (
          <div style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
            {logs.map((l, i) => (
              <LogRow key={l.id ?? i} log={l} icons={icons} colors={colors}/>
            ))}
          </div>
        )}
      </div>

      {/* Пагінація */}
      {pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
          <Btn variant="ghost" disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            style={{ padding: "7px 16px", fontSize: 13 }}>← Попередня</Btn>

          {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
            // показуємо кнопки навколо поточної сторінки
            const p = page < 3 ? i : page > pages - 4 ? pages - 7 + i : page - 3 + i;
            if (p < 0 || p >= pages) return null;
            return (
              <button key={p} onClick={() => setPage(p)}
                style={{ width: 36, height: 36, borderRadius: 10, border: "none",
                  cursor: "pointer", fontFamily: "Syne,sans-serif", fontWeight: 700,
                  fontSize: 13, background: p === page ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.04)",
                  color: p === page ? C.green : C.muted }}>
                {p + 1}
              </button>
            );
          })}

          <Btn variant="ghost" disabled={page >= pages - 1}
            onClick={() => setPage(p => p + 1)}
            style={{ padding: "7px 16px", fontSize: 13 }}>Наступна →</Btn>
        </div>
      )}
    </div>
  );
});

const LogRow = memo(function LogRow({ log: l, icons, colors }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px",
      borderBottom: `1px solid ${C.border}`, fontSize: 12 }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.015)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <span style={{ color: colors[l.status], fontWeight: 800, width: 16, textAlign: "center", flexShrink: 0 }}>
        {icons[l.status] ?? "?"}
      </span>
      <span style={{ flex: 1, fontFamily: "ui-monospace,monospace", fontSize: 11,
        color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {l.url}
      </span>
      {l.domain && (
        <span style={{ fontSize: 11, color: C.muted, flexShrink: 0,
          background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 6 }}>
          {l.domain}
        </span>
      )}
      <span style={{ fontWeight: 700, fontSize: 10, flexShrink: 0,
        fontFamily: "Syne,sans-serif", letterSpacing: "0.05em", color: colors[l.status] }}>
        {l.status === "ok" ? "OK 200" : l.http_status ? `ERR ${l.http_status}` : l.status?.toUpperCase()}
      </span>
      {l.error_msg && (
        <span title={l.error_msg} style={{ fontSize: 10, color: C.red, flexShrink: 0,
          maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {l.error_msg}
        </span>
      )}
      <span style={{ color: C.muted, fontSize: 10, whiteSpace: "nowrap", flexShrink: 0 }}>
        {new Date(l.created_at).toLocaleString("uk-UA", {
          day: "2-digit", month: "2-digit",
          hour: "2-digit", minute: "2-digit",
        })}
      </span>
    </div>
  );
});
