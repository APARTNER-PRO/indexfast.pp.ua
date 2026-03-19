// src/components/SitesTable.jsx
import { memo, useCallback } from "react";
import { StatusDot, Btn, ProgressBar } from "./ui/index.jsx";
import { C } from "../constants.js";

export const SitesTable = memo(function SitesTable({
  sites, remaining, onRun, onDelete, onToggle,
}) {
  if (!sites.length) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>🌐</div>
      <p style={{ fontSize: 15, marginBottom: 8, color: C.white }}>Немає підключених сайтів</p>
      <p style={{ fontSize: 13 }}>Натисніть «+ Додати сайт» щоб розпочати</p>
    </div>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {["Сайт", "Статус", "URL в sitemap", "Відправлено", "Остання індексація", ""].map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: C.muted,
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", background: "rgba(255,255,255,0.02)",
                whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sites.map(s => (
            <SiteRow
              key={s.id}
              site={s}
              remaining={remaining}
              onRun={onRun}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

const SiteRow = memo(function SiteRow({ site: s, remaining, onRun, onDelete, onToggle }) {
  const handleRun    = useCallback(() => onRun(s),       [s, onRun]);
  const handleDelete = useCallback(() => onDelete(s),    [s, onDelete]);
  const handleToggle = useCallback(() => onToggle(s.id), [s.id, onToggle]);

  const isActive     = s.status === "active";
  const isPaused     = s.status === "paused";
  const isError      = s.status === "error";
  const isJobRunning = s.active_job?.status === "pending" || s.active_job?.status === "processing";

  return (
    <tr style={{ borderBottom: `1px solid ${C.border}` }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.015)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

      {/* Сайт */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: isPaused ? "rgba(255,208,96,0.08)" : "rgba(0,255,136,0.08)",
            border: `1px solid ${isPaused ? "rgba(255,208,96,0.2)" : "rgba(0,255,136,0.15)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, transition: "all 0.2s" }}>
            {isPaused ? "⏸" : isError ? "⚠️" : "🌐"}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: isPaused ? C.muted : C.white,
              transition: "color 0.2s" }}>{s.domain}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2,
              maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {s.sitemap_url}
            </div>
            {s.error_message && (
              <div style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{s.error_message}</div>
            )}
          </div>
        </div>

        {/* Прогрес активного job */}
        {isJobRunning && (
          <div style={{ marginTop: 8, maxWidth: 300 }}>
            <ProgressBar value={s.active_job.progress ?? 0} max={100}/>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>
              {s.active_job.sent}/{s.active_job.total} URL
            </div>
          </div>
        )}
      </td>

      {/* Статус */}
      <td style={{ padding: "14px 16px" }}>
        <StatusDot status={s.status}/>
      </td>

      {/* URL в sitemap */}
      <td style={{ padding: "14px 16px", color: C.white }}>
        {(s.total_urls || 0).toLocaleString("uk-UA")}
      </td>

      {/* Відправлено */}
      <td style={{ padding: "14px 16px", color: C.green, fontWeight: 700 }}>
        {(s.indexed_total || 0).toLocaleString("uk-UA")}
      </td>

      {/* Остання індексація */}
      <td style={{ padding: "14px 16px", color: C.muted, whiteSpace: "nowrap", fontSize: 12 }}>
        {s.last_run_at
          ? new Date(s.last_run_at).toLocaleString("uk-UA", {
              day: "2-digit", month: "2-digit",
              hour: "2-digit", minute: "2-digit",
            })
          : "—"}
      </td>

      {/* Дії */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>

          {/* Запуск — тільки для активних */}
          {!isPaused && (
            <Btn variant="outline" onClick={handleRun}
              disabled={remaining === 0 || isJobRunning}
              title={remaining === 0 ? "Денний ліміт вичерпано" : "Запустити індексацію"}
              style={{ padding: "6px 14px", fontSize: 12 }}>
              ▶ Запуск
            </Btn>
          )}

          {/* Пауза / Активація */}
          <Btn
            variant={isPaused ? "outline" : "ghost"}
            onClick={handleToggle}
            disabled={isJobRunning}
            title={isJobRunning
              ? "Дочекайтесь завершення індексації"
              : isPaused ? "Активувати сайт" : "Призупинити сайт"}
            style={{
              padding: "6px 12px", fontSize: 12,
              ...(isPaused ? { color: C.green, borderColor: "rgba(0,255,136,0.3)" } : {}),
            }}>
            {isPaused ? "▶ Активувати" : "⏸"}
          </Btn>

          {/* Видалити */}
          <Btn variant="danger" onClick={handleDelete} title="Видалити сайт"
            style={{ padding: "6px 12px", fontSize: 12 }}>
            ✕
          </Btn>
        </div>
      </td>
    </tr>
  );
});
