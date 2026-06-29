// src/components/SitesTable.jsx
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { StatusDot, Btn, ProgressBar } from "./ui/index.jsx";
import { C } from "../constants.js";

/* ── Mobile-responsive styles ── */
const SITES_MOBILE_STYLES = `
  @media (max-width: 640px) {
    .sites-table-wrap table { display: none; }
    .sites-mobile-list { display: flex !important; }
  }
`;

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

export const SitesTable = memo(function SitesTable({
  sites, remaining, onRun, onDelete, onToggle, onEdit, onEditWithTab,
  gscMetrics = {}, gscLoading = false, gscError = null, onImportGsc,
}) {
  const { t } = useTranslation();
  if (!sites.length) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>🌐</div>
      <p style={{ fontSize: 15, marginBottom: 8, color: C.white }}>{t("sites.noSitesTitle")}</p>
      <p style={{ fontSize: 13 }}>{t("sites.noSitesText")}</p>
    </div>
  );

  return (
    <div className="sites-table-wrap" style={{ overflowX: "auto" }}>
      <style>{SITES_MOBILE_STYLES}</style>



      {/* Desktop table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {[
              t("sites.domain"), t("sites.status"),
              t("sites.urlsInSitemap"), t("sites.sent"), t("sites.lastIndexing"), ""
            ].map(h => (
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
              onEdit={onEdit}
              onEditWithTab={onEditWithTab}
              gscMetrics={gscMetrics}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="sites-mobile-list" style={{ display: "none", flexDirection: "column" }}>
        {sites.map(s => (
          <SiteCard
            key={s.id}
            site={s}
            remaining={remaining}
            onRun={onRun}
            onDelete={onDelete}
            onToggle={onToggle}
            onEdit={onEdit}
            onEditWithTab={onEditWithTab}
            gscMetrics={gscMetrics}
          />
        ))}
      </div>
    </div>
  );
});

/* ── Mobile card layout ── */
const SiteCard = memo(function SiteCard({ site: s, remaining, onRun, onDelete, onToggle, onEdit, onEditWithTab, gscMetrics }) {
  const { t } = useTranslation();
  const handleRun    = () => onRun(s);
  const handleDelete = () => onDelete(s);
  const handleToggle = () => onToggle(s.id);
  const handleEdit   = () => onEdit?.(s);
  const gsc = gscMetrics?.[s.id];

  const isActive     = s.status === "active";
  const isPaused     = s.status === "paused";
  const isError      = s.status === "error";
  const isJobRunning = s.active_job?.status === "pending" || s.active_job?.status === "processing";

  return (
    <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
      {/* Row 1: Icon + Domain + Status */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: isPaused ? "rgba(255,208,96,0.08)" : "rgba(0,255,136,0.08)",
          border: `1px solid ${isPaused ? "rgba(255,208,96,0.2)" : "rgba(0,255,136,0.15)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14 }}>
          {isPaused ? "⏸" : isError ? "⚠️" : "🌐"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, color: isPaused ? C.muted : C.white,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {s.domain}
            </span>
            {s.has_sa === false && (
              <span title="Немає Service Account"
                style={{ fontSize: 10, background: "rgba(255,208,96,0.12)",
                  color: "#ffd060", border: "1px solid rgba(255,208,96,0.25)",
                  borderRadius: 4, padding: "1px 5px", cursor: "pointer" }}
                onClick={handleEdit}>
                ⚠ SA
              </span>
            )}
            {s.indexnow_enabled && (
              <span title="IndexNow підключено — натисніть щоб переглянути"
                style={{ fontSize: 10, background: "rgba(0,212,255,0.1)",
                  color: "#00d4ff", border: "1px solid rgba(0,212,255,0.25)",
                  borderRadius: 4, padding: "1px 5px", cursor: "pointer" }}
                onClick={() => onEditWithTab?.(s, "indexnow")}>
                🚀 IndexNow
              </span>
            )}
          </div>
        </div>
        <StatusDot status={s.status}/>
      </div>

      {/* Sitemap URL */}
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 8,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {s.sitemap_url}
      </div>

      {/* Error message */}
      {s.error_message && (
        <div style={{ fontSize: 11, color: C.red, marginBottom: 8 }}>{s.error_message}</div>
      )}



      {/* Job progress */}
      {isJobRunning && (
        <div style={{ marginBottom: 10 }}>
          <ProgressBar value={s.active_job.progress ?? 0} max={100}/>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>
            {s.active_job.sent}/{s.active_job.total} URL
          </div>
        </div>
      )}

      {/* Row 2: Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 11 }}>
        <div>
          <span style={{ color: C.muted }}>{t("sites.sitemap")}: </span>
          <span style={{ color: C.white, fontWeight: 600 }}>
            {(s.total_urls || 0).toLocaleString("uk-UA")}
          </span>
        </div>
        <div>
          <span style={{ color: C.muted }}>{t("sites.sent")}: </span>
          <span style={{ color: C.green, fontWeight: 700 }}>
            {(s.indexed_total || 0).toLocaleString("uk-UA")}
          </span>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span style={{ color: C.muted, fontSize: 10 }}>
            {s.last_run_at
              ? new Date(s.last_run_at).toLocaleString("uk-UA", {
                  day: "2-digit", month: "2-digit",
                  hour: "2-digit", minute: "2-digit",
                })
              : "—"}
          </span>
        </div>
      </div>

      {/* Row 3: Actions */}
      <div style={{ display: "flex", gap: 6 }}>
        {!isPaused && (
          <Btn variant="outline" onClick={handleRun}
            disabled={remaining === 0 || isJobRunning}
            title={remaining === 0 ? t("sites.dailyLimitReached") : t("sites.runIndexing")}
            style={{ padding: "6px 12px", fontSize: 12, flex: 1 }}>
            {t("sites.runShort")}
          </Btn>
        )}
        <Btn
          variant={isPaused ? "outline" : "ghost"}
          onClick={handleToggle}
          disabled={isJobRunning}
          title={isJobRunning
            ? t("sites.waitForCompletion")
            : isPaused ? t("sites.activateSite") : t("sites.pauseSite")}
          style={{
            padding: "6px 12px", fontSize: 12,
            flex: isPaused ? 1 : undefined,
            ...(isPaused ? { color: C.green, borderColor: "rgba(0,255,136,0.3)" } : {}),
          }}>
          {isPaused ? t("sites.activateShort") : "⏸"}
        </Btn>
        <Btn variant="ghost" onClick={handleEdit} title={t("sites.editSite")}
          style={{ padding: "6px 12px", fontSize: 12 }}>
          ✏
        </Btn>
        <Btn variant="danger" onClick={handleDelete} title={t("sites.deleteSite")}
          style={{ padding: "6px 12px", fontSize: 12 }}>
          ✕
        </Btn>
      </div>
    </div>
  );
});

/* ── Desktop table row ── */
const SiteRow = memo(function SiteRow({ site: s, remaining, onRun, onDelete, onToggle, onEdit, onEditWithTab, gscMetrics }) {
  const { t } = useTranslation();
  // Прямі виклики замість useCallback — уникаємо stale closure
  const handleRun    = () => onRun(s);
  const handleDelete = () => onDelete(s);
  const handleToggle = () => onToggle(s.id);
  const handleEdit   = () => onEdit?.(s);
  const gsc = gscMetrics?.[s.id];

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
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 600, color: isPaused ? C.muted : C.white,
                transition: "color 0.2s" }}>{s.domain}</span>
              {s.has_sa === false && (
                <span title="Немає Service Account — натисніть ✏ щоб додати"
                  style={{ fontSize: 10, background: "rgba(255,208,96,0.12)",
                    color: "#ffd060", border: "1px solid rgba(255,208,96,0.25)",
                    borderRadius: 4, padding: "1px 5px", cursor: "pointer" }}
                  onClick={handleEdit}>
                  ⚠ SA
                </span>
              )}
              {s.indexnow_enabled && (
                <span title="IndexNow підключено — натисніть щоб переглянути"
                  style={{ fontSize: 10, background: "rgba(0,212,255,0.1)",
                    color: "#00d4ff", border: "1px solid rgba(0,212,255,0.25)",
                    borderRadius: 4, padding: "1px 5px", cursor: "pointer" }}
                  onClick={() => onEditWithTab?.(s, "indexnow")}>
                  🚀 IndexNow
                </span>
              )}
            </div>
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



          {/* {t("sites.urlInSitemap")} */}
      <td style={{ padding: "14px 16px", color: C.white }}>
        {(s.total_urls || 0).toLocaleString("uk-UA")}
      </td>

      {/* {t("sites.sent")} */}
      <td style={{ padding: "14px 16px", color: C.green, fontWeight: 700 }}>
        {(s.indexed_total || 0).toLocaleString("uk-UA")}
      </td>

      {/* {t("sites.lastIndexing")} */}
      <td style={{ padding: "14px 16px", color: C.muted, whiteSpace: "nowrap", fontSize: 12 }}>
        {s.last_run_at
          ? new Date(s.last_run_at).toLocaleString("uk-UA", {
              day: "2-digit", month: "2-digit",
              hour: "2-digit", minute: "2-digit",
            })
          : "—"}
      </td>

      {/* {t("sites.actions")} */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>

          {/* {t("sites.runShort")} — тільки для активних */}
          {!isPaused && (
            <Btn variant="outline" onClick={handleRun}
              disabled={remaining === 0 || isJobRunning}
              title={remaining === 0 ? t("sites.dailyLimitReached") : t("sites.runIndexing")}
              style={{ padding: "6px 14px", fontSize: 12 }}>
              {t("sites.runShort")}
            </Btn>
          )}

          {/* {t("sites.pauseSite")} / {t("sites.activateSite")} */}
          <Btn
            variant={isPaused ? "outline" : "ghost"}
            onClick={handleToggle}
            disabled={isJobRunning}
            title={isJobRunning
              ? t("sites.waitForCompletion")
              : isPaused ? t("sites.activateSite") : t("sites.pauseSite")}
            style={{
              padding: "6px 12px", fontSize: 12,
              flex: isPaused ? 1 : undefined,
              ...(isPaused ? { color: C.green, borderColor: "rgba(0,255,136,0.3)" } : {}),
            }}>
            {isPaused ? t("sites.activateShort") : "⏸"}
          </Btn>

          {/* {t("sites.editSite")} */}
          <Btn variant="ghost" onClick={handleEdit} title={t("sites.editSite")}
            style={{ padding: "6px 12px", fontSize: 12 }}>
            ✏
          </Btn>

          {/* {t("sites.deleteSite")} */}
          <Btn variant="danger" onClick={handleDelete} title={t("sites.deleteSite")}
            style={{ padding: "6px 12px", fontSize: 12 }}>
            ✕
          </Btn>
        </div>
      </td>
    </tr>
  );
});
