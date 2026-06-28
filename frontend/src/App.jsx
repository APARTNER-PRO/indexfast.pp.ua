// src/App.jsx
import {
  useState, useCallback, useEffect,
  lazy, Suspense, memo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient }              from "@tanstack/react-query";
import { useStats, useDeleteSite, useToggleSite } from "./hooks/useStats.js";
import { apiClient } from "./api/client.js";
import { useToast }          from "./hooks/useToast.js";
import i18n from "./i18n/index.js";
import { AddSiteModal }      from "./components/AddSiteModal.jsx";
import { GscImportModal }  from "./components/GscImportModal.jsx";
import { RunModal }          from "./components/RunModal.jsx";
import {
  Toast, Spinner, Btn, Badge, ConfirmModal,
} from "./components/ui/index.jsx";
import { C, NAV_ITEMS }      from "./constants.js";
import LanguageSwitcher       from "./components/LanguageSwitcher.jsx";

// ── Lazy сторінки — окремі JS chunks
const Overview    = lazy(() => import("./pages/Overview.jsx"));
const GscMetrics  = lazy(() => import("./pages/GscMetrics.jsx"));
const Profile     = lazy(() => import("./pages/Profile.jsx"));
const Sites       = lazy(() => import("./pages/Sites.jsx"));
const Logs        = lazy(() => import("./pages/Logs.jsx"));
const Billing     = lazy(() => import("./pages/Billing.jsx"));

// ── Fallback для Suspense
function PageLoader() {
  return (
    <>
    <style>{`
      .hamburger-btn { display: none; }
      @media (max-width: 768px) { .hamburger-btn { display: flex !important; } }
    `}</style>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: 300 }}>
      <Spinner size={28}/>
    </div>
  </>
  );
}


// ══════════════════════════════════════════════
//  Банер: підтвердіть email
// ══════════════════════════════════════════════
function EmailVerifyBanner({ email, showToast, t }) {
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  async function resend() {
    setSending(true);
    try {
      await apiClient.resendVerify();
      setSent(true);
      showToast?.("✓ Лист надіслано на " + email);
    } catch (e) {
      showToast?.(e.message || "Помилка надсилання", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      background: "rgba(255,208,96,0.07)", border: "1px solid rgba(255,208,96,0.25)",
      borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13,
    }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>📧</span>
      <span style={{ flex: 1, color: "#e8d88a", lineHeight: 1.5 }}>
        <strong>{t("auth.verifyEmail")}</strong> — {t("auth.verifyEmailText")}{" "}
        <span style={{ opacity: 0.8 }}>{email}</span>
        {" "}{t("auth.clickLink")}
      </span>
      {!sent ? (
        <button onClick={resend} disabled={sending}
          style={{ flexShrink: 0, background: "rgba(255,208,96,0.15)",
            border: "1px solid rgba(255,208,96,0.3)", color: "#ffd060",
            borderRadius: 8, padding: "6px 14px", fontSize: 12,
            fontWeight: 700, cursor: sending ? "not-allowed" : "pointer",
            opacity: sending ? 0.6 : 1, whiteSpace: "nowrap" }}>
          {sending ? t("auth.sending") : t("auth.resend")}
        </button>
      ) : (
        <span style={{ color: "#00ff88", fontSize: 12, flexShrink: 0 }}>✓ {t("auth.sent")}</span>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
//  Sidebar
// ══════════════════════════════════════════════
const Sidebar = memo(function Sidebar({ activePage, setPage, user, sideOpen, setSideOpen, onLogout, t }) {
  if (!user) return null;
  const plan = user.plan;

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: C.dark, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
      transition: "transform 0.25s",
    }} className={sideOpen ? "sidebar sidebar--open" : "sidebar"}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, background: C.green, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 12, color: C.black }}>
          IF
        </div>
        <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 16,
          letterSpacing: "-0.03em" }}>
          Index<span style={{ color: C.green }}>Fast</span>
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {NAV_ITEMS.map(item => {
          const active = activePage === item.id;
          return (
            <button key={item.id}
              onClick={() => { setPage(item.id); setSideOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: active ? "rgba(0,255,136,0.08)" : "transparent",
                color: active ? C.green : C.muted, fontSize: 14, fontFamily: "inherit",
                transition: "all 0.15s", marginBottom: 2, position: "relative",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
              {active && (
                <span style={{ position: "absolute", left: 0, top: 6, bottom: 6, width: 3,
                  background: C.green, borderRadius: "0 2px 2px 0" }}/>
              )}
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}

        <div style={{ height: 1, background: C.border, margin: "12px 4px" }}/>

        {[
          { href: "/docs/",                        icon: "📖", labelKey: "sidebar.documentation" },
          { href: "https://t.me/indexfastgoogle",  icon: "💬", labelKey: "sidebar.support", external: true },
        ].map(({ href, icon, labelKey, external }) => (
          <a key={href} href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
              fontSize: 14, color: C.muted, textDecoration: "none", borderRadius: 10,
              transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; }}>
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{icon}</span>
            {t(labelKey)}
          </a>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 8px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
          borderRadius: 12, cursor: "pointer", transition: "background 0.15s" }}
          onClick={() => {
            if (window.confirm(t("sidebar.logout"))) {
              onLogout?.();
            }
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,#00ff88,#4d9fff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 12, color: C.black }}>
            {(user.name?.[0] ?? "?").toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.white,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name} {user.surname}
            </div>
            <div style={{ fontSize: 11 }}>
              <Badge plan={plan}/>
            </div>
          </div>
          <span style={{ color: C.muted, fontSize: 12 }}>↩</span>
        </div>
      </div>
    </aside>
  );
});

// ══════════════════════════════════════════════
//  Topbar
// ══════════════════════════════════════════════
const Topbar = memo(function Topbar({ activePage, onRefresh, onAddSite, onImportGsc, onToggleSide, isRefetching, t }) {
  const label = NAV_ITEMS.find(n => n.id === activePage)?.labelKey ?? "topbar.dashboard";
  return (
    <header className="topbar-header" style={{
      height: 58, padding: "0 28px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: `1px solid ${C.border}`,
      background: "rgba(5,5,8,0.85)", backdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 40,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Hamburger — мобільне */}
        <button onClick={onToggleSide}
          className="hamburger-btn"
          style={{ flexDirection: "column", gap: 4,
            background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ width: 18, height: 2, background: C.white,
              display: "block", borderRadius: 1 }}/>
          ))}
        </button>
        <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15 }}>
          {t(label)}
        </span>
        {isRefetching && <Spinner size={13}/>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <LanguageSwitcher />
        <Btn variant="ghost" onClick={onRefresh} className="btn-refresh"
          style={{ padding: "6px 14px", fontSize: 13 }}>
          {t("common.refresh")}
        </Btn>
        <Btn variant="primary" onClick={onAddSite} style={{ padding: "7px 16px", fontSize: 13 }}>
          + {t("overview.addSite")}
        </Btn>
      </div>
    </header>
  );
});

// ══════════════════════════════════════════════
//  Головний App
// ══════════════════════════════════════════════
export default function App() {
  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);
  const t = i18n.t.bind(i18n);

  // Re-render on language change so all t() calls pick up the new language
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  // ── Email verified: показуємо toast при ?verified=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "1") {
      showToast("✓ Email успішно підтверджено!");
      window.history.replaceState(null, "", window.location.pathname);
    }
    if (params.get("gsc")) {
      setGscOpen(true);
    }
  }, []);

  // ── Google OAuth: якщо прийшли на /app/dashboard з token у fragment або query
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const hash   = new URLSearchParams(window.location.hash.slice(1));
    
    const accessToken  = search.get("token")   || hash.get("token");
    const refreshToken = search.get("refresh") || hash.get("refresh");

    if (accessToken) {
      localStorage.setItem("access_token",  accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
      
      // Очищаємо URL від токенів
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);
  const [activePage, setActivePage] = useState("overview");
  const [addOpen,    setAddOpen]    = useState(false);
  const [gscOpen,    setGscOpen]    = useState(false);
  const [runSite,    setRunSite]    = useState(null);
  const [sideOpen,   setSideOpen]   = useState(false);

  const { toast, showToast } = useToast();
  const qc = useQueryClient();

  // ── Дані через react-query
  const { data, isLoading, isError, error, isRefetching } = useStats();

  // Клієнтський кеш для останніх успішних даних статистики
  const [cachedStats, setCachedStats] = useState(null);

  useEffect(() => {
    if (data?.user) {
      setCachedStats(data);
    }
  }, [data]);

  const deleteSite   = useDeleteSite();
  const [confirmSite, setConfirmSite] = useState(null); // сайт для підтвердження видалення
  const [deleteLoading, setDeleteLoading] = useState(false);
  const toggleSite   = useToggleSite();

  // ── Callback-и (memo щоб не перерендерювати дочірні)
  const handleRefresh = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["stats"] });
  }, [qc]);

  const handleDelete = useCallback((site) => {
    setConfirmSite(site); // відкриваємо Modal замість window.confirm
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!confirmSite) return;
    setDeleteLoading(true);
    try {
      await deleteSite.mutateAsync(confirmSite.id);
      showToast(`Сайт ${confirmSite.domain} видалено`);
      setConfirmSite(null);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  }, [confirmSite, deleteSite, showToast]);

  const handleToggle = useCallback(async (siteId) => {
    try {
      const res = await toggleSite.mutateAsync(siteId);
      showToast(res?.message ?? "Статус змінено");
    } catch (e) {
      showToast(e.message, "error");
    }
  }, [toggleSite, showToast]);

  const handleAddSuccess = useCallback((site) => {
    showToast(`✓ Сайт ${site?.domain ?? ""} підключено!`);
  }, [showToast]);

  const handleRunFinished = useCallback((job) => {
    const msg = job.status === "done"
      ? `✓ Індексація завершена: відправлено ${job.sent} URL`
      : `⚠ Індексація завершена з помилками (${job.failed}/${job.total})`;
    showToast(msg, job.status === "done" ? "ok" : "error");
  }, [showToast]);

  const handleGoLogs    = useCallback(() => setActivePage("logs"),    []);
  const handleGoBilling = useCallback(() => setActivePage("billing"), []);
  const handleAddSite   = useCallback(() => setAddOpen(true),         []);
  const handleImportGsc = useCallback(() => setGscOpen(true),         []);

  // ── Мемоізуємо пропси для сторінок (використовуємо кешовану або свіжу відповідь)
  const statsData = cachedStats || data;

  // ── Loading / Error стани
  // Показуємо завантаження або помилку тільки якщо немає раніше збережених робочих даних
  if (isLoading && !cachedStats) return (
    <div style={{ background: C.black, minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800,
          marginBottom: 24, letterSpacing: "-0.04em" }}>
          Index<span style={{ color: C.green }}>Fast</span>
        </div>
        <Spinner size={32}/>
      </div>
    </div>
  );

  if (isError && !cachedStats) {
    if (error?.status === 415) {
      return (
        <div style={{ background: C.black, minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800,
              marginBottom: 24, letterSpacing: "-0.04em" }}>
              Index<span style={{ color: C.green }}>Fast</span>
            </div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>
              З'єднання...
            </div>
            <Spinner size={32}/>
          </div>
        </div>
      );
    }

    return (
      <div style={{ background: C.black, minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        color: C.red, fontFamily: "Syne,sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠</div>
          <div style={{ marginBottom: 20 }}>{error?.message}</div>
          <Btn variant="outline" onClick={handleRefresh}>Повторити</Btn>
        </div>
      </div>
    );
  }

  // Guard: показуємо помилку тільки якщо даних взагалі немає
  if (!statsData?.user) {
    return (
      <div style={{ background: C.black, minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        color: C.red, fontFamily: "Syne,sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠</div>
          <div style={{ marginBottom: 20 }}>
            Помилка завантаження даних.<br/>
            <span style={{ fontSize: 14, color: C.muted }}>
              Перевірте підключення до бази даних та наявність таблиць.
            </span>
          </div>
          <Btn variant="outline" onClick={handleRefresh}>Повторити</Btn>
        </div>
      </div>
    );
  }

  const { user, sites, sites_limit } = statsData;
  const plan      = user.plan;
  const remaining = statsData.today.remaining;

  // ── Рендер активної сторінки через Suspense
  function renderPage() {
    switch (activePage) {
      case "overview":
        return (
          <Suspense fallback={<PageLoader/>}>
            <Overview
              data={statsData}
              onAddSite={handleAddSite}
              onRun={setRunSite}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onGoLogs={handleGoLogs}
              onGoBilling={handleGoBilling}
              onImportGsc={handleImportGsc}
              showToast={showToast}
            />
          </Suspense>
        );
      case "gsc":
        return (
          <Suspense fallback={<PageLoader/>}>
            <GscMetrics
              sites={sites}
              onImportGsc={handleImportGsc}
            />
          </Suspense>
        );
      case "sites":
        return (
          <Suspense fallback={<PageLoader/>}>
            <Sites
              sitesList={sites}
              sitesLimit={sites_limit}
              plan={plan}
              today={statsData.today}
              onAddSite={handleAddSite}
              onRun={setRunSite}
              onDelete={handleDelete}
              onToggle={handleToggle}
              showToast={showToast}
              onImportGsc={handleImportGsc}
            />
          </Suspense>
        );
      case "logs":
        return (
          <Suspense fallback={<PageLoader/>}>
            <Logs sites={sites}/>
          </Suspense>
        );
      case "billing":
        return (
          <Suspense fallback={<PageLoader/>}>
            <Billing currentPlan={plan}/>
          </Suspense>
        );
      case "profile":
        return (
          <Suspense fallback={<PageLoader/>}>
            <Profile
              user={user}
              showToast={showToast}
              onUpdate={(updatedUser) => {
                qc.invalidateQueries({ queryKey: ["stats"] });
              }}
            />
          </Suspense>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body {
          background: ${C.black};
          color: ${C.white};
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
        }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:none;opacity:1} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border2}; border-radius: 2px; }
        a { color: ${C.green}; }
        .hamburger-btn { display: none; }
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          .main-content { margin-left: 0 !important; }
          .sidebar { transform: translateX(-100%); }
          .sidebar--open { transform: translateX(0); }

          /* Topbar */
          .topbar-actions .btn-refresh { display: none; }
          .topbar-header { padding: 0 16px !important; }

          /* Main content */
          .main-padding { padding: 16px !important; }

          /* Таблиця сайтів */
          .sites-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

          /* Логи */
          .logs-filters { flex-direction: column !important; }
          .logs-date-row { flex-wrap: wrap !important; gap: 6px !important; }

          /* GSC Metrics */
          .gsc-header { flex-direction: column !important; align-items: flex-start !important; }
          .gsc-tabs { display: flex; flex-wrap: nowrap !important; overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }
          .gsc-tabs::-webkit-scrollbar { display: none; }
          .gsc-filters { width: 100%; flex-direction: column !important; align-items: stretch !important; }
          .gsc-filters select { width: 100%; max-width: 100% !important; }
          .gsc-metrics-cards { grid-template-columns: 1fr 1fr !important; }
        }

      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* Overlay для мобільного sidebar */}
        {sideOpen && (
          <div onClick={() => setSideOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
              zIndex: 49, backdropFilter: "blur(2px)" }}/>
        )}

        <Sidebar
          activePage={activePage}
          setPage={setActivePage}
          user={user}
          sideOpen={sideOpen}
          setSideOpen={setSideOpen}
          onLogout={() => {
                  apiClient.logout();
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("refresh_token");
                  navigate("/app/login");
                }}
          t={t}
        />

        {/* Main */}
        <div className="main-content"
          style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

          <Topbar
            activePage={activePage}
            onRefresh={handleRefresh}
            onAddSite={handleAddSite}
            onImportGsc={() => setGscOpen(true)}
            onToggleSide={() => setSideOpen(s => !s)}
            isRefetching={isRefetching}
            t={t}
          />

          <main className="main-padding" style={{ padding: 28, flex: 1 }}>
            {/* Банер підтвердження email */}
            {user && user.email_verified === false && (
              <EmailVerifyBanner email={user.email} showToast={showToast} t={t}/>
            )}
            {renderPage()}
          </main>
        </div>
      </div>

      {/* Модалки */}
      <AddSiteModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleAddSuccess}
        plan={plan}
        sitesCount={sites.length}
        sitesLimit={sites_limit}
        onOpenGsc={() => setGscOpen(true)}
      />

      <GscImportModal
        open={gscOpen}
        onClose={() => setGscOpen(false)}
        onImported={() => {
          setGscOpen(false);
          handleRefresh();
        }}
        plan={plan}
        sitesCount={sites.length}
        sitesLimit={sites_limit}
      />

      <RunModal
        open={!!runSite}
        onClose={() => setRunSite(null)}
        onFinished={handleRunFinished}
        site={runSite}
        remaining={remaining}
      />

      {/* Modal підтвердження видалення */}
      <ConfirmModal
        open={!!confirmSite}
        onClose={() => setConfirmSite(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title={t("sites.deleteSite")}
        message={t("sites.deleteConfirm", { domain: confirmSite?.domain ?? "" })}
        confirmLabel={t("sites.yesDelete")}
      />

      <Toast {...toast}/>
    </>
  );
}
