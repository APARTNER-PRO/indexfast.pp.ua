// src/components/GscImportModal.jsx
import { useState, useEffect, memo } from "react";
import { Modal, Btn, Spinner } from "./ui/index.jsx";
import { apiClient }            from "../api/client.js";
import { C }                    from "../constants.js";

export const GscImportModal = memo(function GscImportModal({
  open, onClose, onImported, plan, sitesCount, sitesLimit,
}) {
  const [step,     setStep]     = useState("choose"); // choose | import | done
  const [sites,    setSites]    = useState([]);
  const [selected, setSelected] = useState({});
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [results,  setResults]  = useState([]);

  const available = sitesLimit - sitesCount;

  // Перевіряємо чи є ?gsc=ready або ?gsc=error після OAuth redirect
  useEffect(() => {
    if (!open) return;
    const params = new URLSearchParams(window.location.search);
    const gsc = params.get("gsc");
    if (gsc === "ready") {
      window.history.replaceState(null, "", window.location.pathname);
      loadSites();
    } else if (gsc === "error") {
      const msg = params.get("msg") || "Помилка підключення";
      setError(msg);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [open]);

  async function loadSites() {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.gscSites();
      setSites(data.sites ?? []);
      // Авто-вибір тих що ще не додані
      const sel = {};
      (data.sites ?? []).forEach(s => {
        if (!s.already) sel[s.domain] = true;
      });
      setSelected(sel);
    } catch (e) {
      if (e.status === 403) {
        setStep("auth"); // потрібна авторизація
      } else {
        setError(e.message || "Не вдалось завантажити сайти");
      }
    } finally {
      setLoading(false);
    }
  }

  function toggle(domain) {
    setSelected(prev => ({ ...prev, [domain]: !prev[domain] }));
  }

  function selectAll() {
    const sel = {};
    sites.filter(s => !s.already).forEach(s => { sel[s.domain] = true; });
    setSelected(sel);
  }

  function selectNone() { setSelected({}); }

  const selectedList = sites.filter(s => selected[s.domain]);
  const canImport    = selectedList.length > 0 && selectedList.length <= available;

  async function doImport() {
    setLoading(true);
    setError("");
    const res = [];
    for (const site of selectedList) {
      try {
        await apiClient.addSite({
          domain:      site.domain,
          sitemap_url: site.sitemap,
          // service_account порожній — юзер додасть пізніше
        });
        res.push({ domain: site.domain, ok: true });
      } catch (e) {
        res.push({ domain: site.domain, ok: false, error: e.message });
      }
    }
    setResults(res);
    setStep("done");
    setLoading(false);
    onImported?.();
  }

  const permLabel = (p) => ({
    siteOwner:      "👑 Власник",
    siteFullUser:   "✏ Повний доступ",
    siteRestrictedUser: "👁 Перегляд",
  })[p] ?? p;

  return (
    <Modal open={open} onClose={onClose}
      title="Імпорт з Google Search Console"
      subtitle="Підключіть сайти які вже є у вашому GSC акаунті">

      {/* ── Step: auth needed */}
      {step === "auth" && (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
          <p style={{ color: C.muted, marginBottom: 8, lineHeight: 1.6 }}>
            Для імпорту потрібен дозвіл на читання Google Search Console.
            Клікніть кнопку і авторизуйте доступ через Google.
          </p>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 24 }}>
            Ми запитуємо тільки <strong style={{ color: C.white }}>читання</strong> списку сайтів.
            Жодних змін в GSC не робимо.
          </p>
          <Btn variant="primary" onClick={() => apiClient.gscRedirect()}>
            <svg width="16" height="16" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.7-2.9-11.3-7.2l-6.5 5C9.5 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.6-2.7 4.7-5 6.1l6.2 5.2C40 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Підключити Google Search Console
          </Btn>
          <p style={{ marginTop: 16 }}>
            <button onClick={() => { setStep("choose"); loadSites(); }}
              style={{ background: "none", border: "none", color: C.green,
                cursor: "pointer", fontSize: 13 }}>
              Вже підключено — завантажити сайти
            </button>
          </p>
        </div>
      )}

      {/* ── Step: choose */}
      {step === "choose" && (
        <>
          {error && (
            <div style={{ background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.2)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              fontSize: 13, color: C.red }}>
              {error}
              {error.includes("підключіть") && (
                <button onClick={() => setStep("auth")}
                  style={{ background: "none", border: "none", color: C.green,
                    cursor: "pointer", marginLeft: 8, fontSize: 13 }}>
                  Підключити →
                </button>
              )}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: 32 }}>
              <Spinner size={28}/>
              <p style={{ color: C.muted, marginTop: 12, fontSize: 13 }}>
                Завантажуємо сайти з GSC...
              </p>
            </div>
          )}

          {!loading && sites.length === 0 && !error && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.5 }}>🌐</div>
              <p style={{ color: C.muted, marginBottom: 16 }}>
                Не вдалось знайти сайти.
              </p>
              <Btn variant="outline" onClick={() => setStep("auth")}>
                Підключити GSC
              </Btn>
            </div>
          )}

          {!loading && sites.length > 0 && (
            <>
              {/* Ліміт */}
              {available <= 0 ? (
                <div style={{ background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.2)",
                  borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: C.red }}>
                  Ліміт сайтів вичерпано ({sitesLimit}). Оновіть план щоб додати більше.
                </div>
              ) : (
                <div style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)",
                  borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: C.muted }}>
                  Можна додати ще <strong style={{ color: C.green }}>{available}</strong> сайт(ів).
                  Обрано: <strong style={{ color: C.white }}>{selectedList.length}</strong>
                </div>
              )}

              {/* Кнопки вибору */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button onClick={selectAll}
                  style={{ background: "none", border: `1px solid ${C.border}`,
                    color: C.muted, borderRadius: 8, padding: "4px 12px",
                    fontSize: 12, cursor: "pointer" }}>
                  Обрати всі
                </button>
                <button onClick={selectNone}
                  style={{ background: "none", border: `1px solid ${C.border}`,
                    color: C.muted, borderRadius: 8, padding: "4px 12px",
                    fontSize: 12, cursor: "pointer" }}>
                  Зняти вибір
                </button>
                <button onClick={loadSites}
                  style={{ background: "none", border: "none",
                    color: C.muted, fontSize: 12, cursor: "pointer", marginLeft: "auto" }}>
                  ↻ Оновити
                </button>
              </div>

              {/* Список сайтів */}
              <div style={{ maxHeight: 320, overflowY: "auto",
                border: `1px solid ${C.border}`, borderRadius: 12 }}>
                {sites.map((site, i) => (
                  <label key={site.domain}
                    style={{ display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px",
                      borderBottom: i < sites.length - 1 ? `1px solid ${C.border}` : "none",
                      cursor: site.already ? "default" : "pointer",
                      opacity: site.already ? 0.5 : 1,
                      background: selected[site.domain] ? "rgba(0,255,136,0.04)" : "transparent",
                      transition: "background 0.15s" }}>
                    <input type="checkbox"
                      checked={!!selected[site.domain]}
                      disabled={site.already}
                      onChange={() => !site.already && toggle(site.domain)}
                      style={{ flexShrink: 0, accentColor: C.green }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {site.domain}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                        {permLabel(site.permission)}
                        {site.already && <span style={{ marginLeft: 8, color: C.gold }}>● Вже додано</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, flexShrink: 0,
                      maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap" }}>
                      {site.sitemap}
                    </div>
                  </label>
                ))}
              </div>

              {/* Примітка про SA */}
              <div style={{ marginTop: 12, padding: "10px 14px",
                background: "rgba(255,208,96,0.06)", border: "1px solid rgba(255,208,96,0.2)",
                borderRadius: 10, fontSize: 12, color: C.gold, lineHeight: 1.6 }}>
                ⚠ Сайти будуть додані без Service Account.
                Після імпорту відредагуйте кожен сайт і додайте SA JSON для запуску індексації.
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Скасувати</Btn>
                <Btn variant="primary" loading={loading}
                  disabled={!canImport} onClick={doImport}
                  style={{ flex: 2 }}>
                  ⬇ Імпортувати {selectedList.length > 0 ? `(${selectedList.length})` : ""}
                </Btn>
              </div>
            </>
          )}
        </>
      )}

      {/* ── Step: done */}
      {step === "done" && (
        <div>
          <div style={{ fontSize: 36, textAlign: "center", marginBottom: 16 }}>
            {results.every(r => r.ok) ? "✅" : "⚠️"}
          </div>
          <p style={{ textAlign: "center", fontWeight: 700, marginBottom: 16 }}>
            {results.filter(r => r.ok).length} з {results.length} сайтів імпортовано
          </p>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden",
            marginBottom: 16 }}>
            {results.map((r, i) => (
              <div key={r.domain} style={{ display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px",
                borderBottom: i < results.length - 1 ? `1px solid ${C.border}` : "none",
                fontSize: 13 }}>
                <span>{r.ok ? "✅" : "❌"}</span>
                <span style={{ flex: 1 }}>{r.domain}</span>
                {!r.ok && <span style={{ color: C.red, fontSize: 11 }}>{r.error}</span>}
              </div>
            ))}
          </div>
          {results.some(r => r.ok) && (
            <p style={{ color: C.gold, fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
              Наступний крок: відкрийте кожен імпортований сайт і додайте Google Service Account JSON для запуску індексації.
            </p>
          )}
          <Btn variant="primary" onClick={onClose} style={{ width: "100%" }}>Готово</Btn>
        </div>
      )}
    </Modal>
  );
});
