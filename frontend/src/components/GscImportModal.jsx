// src/components/GscImportModal.jsx
import { useState, useEffect, memo, useCallback } from "react";
import { Modal, Btn, Spinner, Field, Textarea } from "./ui/index.jsx";
import { apiClient }            from "../api/client.js";
import { C }                    from "../constants.js";

export const GscImportModal = memo(function GscImportModal({
  open, onClose, onImported, plan, sitesCount, sitesLimit,
}) {
  const [step,     setStep]     = useState("choose"); // auth | choose | import | done
  const [sites,    setSites]    = useState([]);
  const [selected, setSelected] = useState({});
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [results,  setResults]  = useState([]);
  const [sa,       setSa]       = useState(""); // Service Account JSON

  const available = sitesLimit - sitesCount;

  // Перевіряємо чи є ?gsc=ready або ?gsc=error після OAuth redirect
  useEffect(() => {
    if (!open) return;
    const params = new URLSearchParams(window.location.search);
    const gsc = params.get("gsc");
    if (gsc === "ready") {
      // Очищаємо URL щоб не спрацьовувало при ререндері
      const url = new URL(window.location);
      url.searchParams.delete("gsc");
      url.searchParams.delete("msg");
      window.history.replaceState(null, "", url.pathname + url.search);
      
      setStep("choose");
      loadSites();
    } else if (gsc === "error") {
      const msg = params.get("msg") || "Помилка підключення";
      setError(msg === "invalid_state" ? "Сесія закінчилась або невалідна. Спробуйте ще раз." : msg);
      setStep("auth");
      
      const url = new URL(window.location);
      url.searchParams.delete("gsc");
      url.searchParams.delete("msg");
      window.history.replaceState(null, "", url.pathname + url.search);
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

  const toggle = useCallback((domain) => {
    setSelected(prev => ({ ...prev, [domain]: !prev[domain] }));
  }, []);

  const selectAll = useCallback(() => {
    const sel = {};
    sites.filter(s => !s.already).forEach(s => { sel[s.domain] = true; });
    setSelected(sel);
  }, [sites]);

  const selectNone = useCallback(() => setSelected({}), []);

  const selectedList = sites.filter(s => selected[s.domain]);
  const canImport    = selectedList.length > 0 && selectedList.length <= available;

  async function doImport() {
    setError("");
    if (sa.trim()) {
      try {
        const saObj = JSON.parse(sa);
        if (saObj?.type !== "service_account") throw new Error('Поле type має бути "service_account"');
      } catch (e) {
        return setError("Невалідний Service Account JSON: " + e.message);
      }
    }

    setLoading(true);
    const res = [];
    for (let i = 0; i < selectedList.length; i++) {
      const site = selectedList[i];
      
      // Спроба отримати реальний sitemap
      let bestSitemap = site.sitemap;
      try {
        const sitemapsData = await apiClient.gscSitemaps(site.gsc_url);
        if (sitemapsData?.sitemaps?.length > 0) {
          bestSitemap = sitemapsData.sitemaps[0].path;
        }
      } catch (e) { /* fallback to guess */ }

      try {
        await apiClient.addSite({
          domain:      site.domain,
          sitemap_url: bestSitemap,
          gsc_url:     site.gsc_url,
          service_account: sa.trim() || undefined,
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
      subtitle="Масове підключення сайтів із вашого акаунту">

      {/* ── Step: auth needed */}
      {step === "auth" && (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
          <p style={{ color: C.muted, marginBottom: 8, lineHeight: 1.6 }}>
            Для імпорту потрібен дозвіл на читання Google Search Console.<br/>
            Клікніть кнопку і авторизуйте доступ через Google.
          </p>
          
          {error && <p style={{ color: C.red, fontSize: 13, marginBottom: 16 }}>{error}</p>}

          <Btn variant="primary" onClick={() => apiClient.gscRedirect()} style={{ margin: "0 auto" }}>
            <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 10 }}>
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.7-2.9-11.3-7.2l-6.5 5C9.5 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.6-2.7 4.7-5 6.1l6.2 5.2C40 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Підключити Google Search Console
          </Btn>
          <p style={{ marginTop: 20 }}>
            <button onClick={() => { setStep("choose"); loadSites(); }}
              style={{ background: "none", border: "none", color: C.green,
                cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>
              Вже підключено — завантажити список сайтів
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
              <p style={{ color: C.muted, marginBottom: 20 }}>
                Список сайтів порожній або ще не завантажений.
              </p>
              <Btn variant="primary" onClick={loadSites} style={{ marginBottom: 12, marginInline: "auto" }}>
                ↻ Завантажити список сайтів
              </Btn>
              <div>
                <button onClick={() => setStep("auth")}
                  style={{ background: "none", border: "none", color: C.muted,
                    cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>
                  Змінити акаунт Google
                </button>
              </div>
            </div>
          )}

          {!loading && sites.length > 0 && (
            <>
              {/* Ліміт */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 13 }}>
                <span style={{ color: C.muted }}>
                  Обрано: <strong style={{ color: C.white }}>{selectedList.length}</strong>
                </span>
                <span style={{ color: available <= 0 ? C.red : C.muted }}>
                  Вільних місць: <strong style={{ color: available <= 0 ? C.red : C.green }}>{available}</strong>
                </span>
              </div>

              {/* Список сайтів */}
              <div style={{ maxHeight: 240, overflowY: "auto",
                border: `1px solid ${C.border}`, borderRadius: 12, background: "rgba(255,255,255,0.02)" }}>
                {sites.map((site, i) => (
                  <label key={site.gsc_url}
                    style={{ display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 14px",
                      borderBottom: i < sites.length - 1 ? `1px solid ${C.border}` : "none",
                      cursor: site.already ? "default" : "pointer",
                      opacity: site.already ? 0.4 : 1,
                      background: selected[site.domain] ? "rgba(0,255,136,0.03)" : "transparent" }}>
                    <input type="checkbox"
                      checked={!!selected[site.domain]}
                      disabled={site.already}
                      onChange={() => !site.already && toggle(site.domain)}
                      style={{ flexShrink: 0, accentColor: C.green }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {site.domain}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>
                        {permLabel(site.permission)}
                        {site.already && <span style={{ marginLeft: 8, color: C.green, fontWeight: 700 }}>● ВЖЕ Є</span>}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8, marginBottom: 20 }}>
                <button onClick={selectAll} style={{ background: "none", border: "none", color: C.green, fontSize: 11, cursor: "pointer" }}>Обрати всі нові</button>
                <button onClick={selectNone} style={{ background: "none", border: "none", color: C.muted, fontSize: 11, cursor: "pointer" }}>Зняти вибір</button>
              </div>

              {/* Service Account Section */}
              <Field label="Google Service Account JSON"
                hint={<>Спільний для всіх сайтів що імпортуються.{" "}
                  <a href="/docs/" target="_blank" style={{ color: C.green }}>Як отримати →</a></>}>
                <Textarea
                  value={sa}
                  onChange={e => setSa(e.target.value)}
                  placeholder={'{\n  "type": "service_account",\n  "client_email": "...",\n  "private_key": "..." \n}'}
                  style={{ height: 80, fontSize: 12 }}
                />
              </Field>

              {available < selectedList.length && (
                <p style={{ color: C.red, fontSize: 12, marginBottom: 12 }}>
                  ⚠ Ви обрали більше сайтів ({selectedList.length}), ніж дозволяє ваш план ({available}).
                </p>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Скасувати</Btn>
                <Btn variant="primary" loading={loading}
                  disabled={!canImport || available < selectedList.length} onClick={doImport}
                  style={{ flex: 2 }}>
                  ✓ Імпортувати ({selectedList.length})
                </Btn>
              </div>
            </>
          )}
        </>
      )}

      {/* ── Step: done */}
      {step === "done" && (
        <div style={{ padding: "10px 0" }}>
          <div style={{ fontSize: 36, textAlign: "center", marginBottom: 16 }}>
            {results.every(r => r.ok) ? "✅" : "⚠️"}
          </div>
          <p style={{ textAlign: "center", fontWeight: 700, marginBottom: 16 }}>
            Імпорт завершено: {results.filter(r => r.ok).length} успішно
          </p>
          <div style={{ maxHeight: 200, overflowY: "auto", border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 20 }}>
            {results.map((r, i) => (
              <div key={r.domain} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderBottom: i < results.length - 1 ? `1px solid ${C.border}` : "none", fontSize: 12 }}>
                <span>{r.ok ? "✅" : "❌"}</span>
                <span style={{ flex: 1 }}>{r.domain}</span>
                {!r.ok && <span style={{ color: C.red, fontSize: 10 }}>{r.error}</span>}
              </div>
            ))}
          </div>
          <Btn variant="primary" onClick={onClose} style={{ width: "100%" }}>Закрити</Btn>
        </div>
      )}
    </Modal>
  );
});
