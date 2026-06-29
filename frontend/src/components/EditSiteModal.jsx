// src/components/EditSiteModal.jsx
import { useState, useEffect, memo } from "react";
import { Modal, Field, Input, Textarea, Btn } from "./ui/index.jsx";
import { useQueryClient }                      from "@tanstack/react-query";
import { apiClient }                           from "../api/client.js";
import { KEYS }                                from "../hooks/useStats.js";
import { C }                                   from "../constants.js";
import i18n                                    from "../i18n/index.js";

export const EditSiteModal = memo(function EditSiteModal({
  open, onClose, site, showToast, initialTab = null,
}) {
  const t = i18n.t.bind(i18n);
  const [domain,  setDomain]  = useState("");
  const [sitemap, setSitemap] = useState("");
  const [sa,      setSa]      = useState("");
  const [indexnowEnabled, setIndexnowEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("info"); // info | sa | indexnow
  const [localSite, setLocalSite] = useState(null);

  const qc = useQueryClient();

  // Заповнюємо з поточного сайту
  useEffect(() => {
    if (open && site) {
      setLocalSite(site);
      setDomain(site.domain ?? "");
      setSitemap(site.sitemap_url ?? "");
      setSa("");
      setIndexnowEnabled(site.indexnow_enabled ?? false);
      setError("");
      setTab(initialTab ?? (site.has_sa === false ? "sa" : "info")); // initialTab має пріоритет
    }
  }, [open, site]);

  async function save() {
    setError("");

    // Базова валідація
    const trimDomain  = domain.trim();
    const trimSitemap = sitemap.trim();
    const trimSa      = sa.trim();

      if (!trimDomain)  { setError(t("sites.enterDomain")); return; }
      if (!trimSitemap) { setError(t("sites.enterSitemap")); return; }

    // Якщо SA заповнено — валідуємо
    if (trimSa) {
      try {
        const obj = JSON.parse(trimSa);
      if (obj?.type !== "service_account")
        { setError(t("sites.saInvalidType")); return; }
      if (!obj.client_email || !obj.private_key)
        { setError(t("sites.saMissingFields")); return; }
      } catch {
        setError("Невалідний JSON"); return;
      }
    }

    setLoading(true);
    try {
      const body = {
        site_id:     site.id,
        domain:      trimDomain,
        sitemap_url: trimSitemap,
        indexnow_enabled: indexnowEnabled,
      };
      if (trimSa) body.service_account = trimSa;

      const res = await apiClient.updateSite(body);
      if (res?.site) setLocalSite(res.site);
      
      qc.invalidateQueries({ queryKey: KEYS.stats });
      showToast?.(t("sites.siteUpdated"));
      
      // Якщо IndexNow щойно увімкнули, залишаємо модалку відкритою на вкладці indexnow, щоб показати згенерований ключ
      if (indexnowEnabled && !(localSite || site).indexnow_enabled) {
        setTab("indexnow");
      } else {
        onClose();
      }
    } catch (e) {
      setError(e.message || t("common.saveError"));
    } finally {
      setLoading(false);
    }
  }

  const currentSite = localSite || site;
  if (!currentSite) return null;

  const hasSa = currentSite.has_sa !== false;

  return (
    <Modal open={open} onClose={onClose}
      title={t("sites.editSiteTitle")}
      subtitle={currentSite.domain}>

      {/* Вкладки */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20,
        background: C.dark, borderRadius: 10, padding: 4,
        border: `1px solid ${C.border}` }}>
        {[
          { id: "info", label: t("sites.infoTab") },
          { id: "sa",   label: hasSa ? t("sites.saTabLabel") : t("sites.saTabNoSa") },
          { id: "indexnow", label: t("sites.indexnowTab") },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "8px 12px", border: "none",
              borderRadius: 8, cursor: "pointer", fontSize: 13,
              fontFamily: "inherit", transition: "all 0.15s",
              background: tab === t.id ? "rgba(0,255,136,0.1)" : "transparent",
              color: tab === t.id ? C.green
                : t.id === "sa" && !hasSa ? C.gold
                : C.muted,
              fontWeight: tab === t.id ? 700 : 400 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Вкладка: Основне */}
      {tab === "info" && (
        <>
          <Field label={t("sites.domainField")} hint={t("sites.domainHint")}>
            <Input value={domain} onChange={e => setDomain(e.target.value)}
              placeholder="myshop.ua"/>
          </Field>
          <Field label={t("sites.sitemapField")} hint={t("sites.sitemapHint")}>
            <Input value={sitemap} onChange={e => setSitemap(e.target.value)}
              placeholder="https://myshop.ua/sitemap.xml"/>
          </Field>
        </>
      )}

      {/* Вкладка: Service Account */}
      {tab === "sa" && (
        <>
          {!hasSa && (
            <div style={{ background: "rgba(255,208,96,0.07)",
              border: "1px solid rgba(255,208,96,0.2)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              fontSize: 13, color: C.gold, lineHeight: 1.6 }}>
              ⚠ {t("sites.noSaWarning")}
            </div>
          )}
          {hasSa && (
            <div style={{ background: "rgba(0,255,136,0.06)",
              border: "1px solid rgba(0,255,136,0.15)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              fontSize: 13, color: C.green }}>
              {t("sites.hasSaInfo")}
            </div>
          )}
          <Field label={t("sites.saField")}
            hint={<>Отримайте в <a href="https://console.cloud.google.com"
              target="_blank" style={{ color: C.green }}>Google Cloud Console</a>.{" "}
              <a href="/docs/" style={{ color: C.green }}>Інструкція →</a></>}>
            <Textarea
              value={sa}
              onChange={e => setSa(e.target.value)}
              rows={10}
              placeholder={'{\n  "type": "service_account",\n  "client_email": "...",\n  "private_key": "-----BEGIN RSA PRIVATE KEY-----\\n..."\n}'}
            />
          </Field>
          {/* Валідація в реальному часі */}
          {sa.trim() && (() => {
            try {
              const obj = JSON.parse(sa);
              if (obj?.type !== "service_account")
                return <p style={{ fontSize: 12, color: C.red, marginTop: -8, marginBottom: 12 }}>
                  ✕ type має бути "service_account"</p>;
              if (!obj.client_email || !obj.private_key)
                return <p style={{ fontSize: 12, color: C.red, marginTop: -8, marginBottom: 12 }}>
                  ✕ Відсутній client_email або private_key</p>;
              return <p style={{ fontSize: 12, color: C.green, marginTop: -8, marginBottom: 12 }}>
                ✓ JSON валідний · {obj.client_email}</p>;
            } catch {
              return <p style={{ fontSize: 12, color: C.red, marginTop: -8, marginBottom: 12 }}>
                ✕ Невалідний JSON</p>;
            }
          })()}
        </>
      )}

      {/* Вкладка: IndexNow */}
      {tab === "indexnow" && (
        <>
          {(() => {
            const key      = currentSite.indexnow_key;
            
            if (!key) {
              return (
                <div style={{ marginBottom: 20, padding: "16px 20px", background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 24, lineHeight: 1 }}>🚀</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#00d4ff", marginBottom: 6 }}>IndexNow не активовано</div>
                      <div style={{ fontSize: 13, color: "#c8c8d8", lineHeight: 1.5 }}>
                        IndexNow дозволяє миттєво повідомляти Bing, Yandex та DuckDuckGo про нові сторінки.<br/>
                        Щоб отримати ключ верифікації та інструкцію, <strong>увімкніть опцію нижче та збережіть налаштування</strong>.
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            const filename = `${key}.txt`;
            const fileUrl  = `https://${currentSite.domain}/${filename}`;
            const copy = (text, label) =>
              navigator.clipboard.writeText(text).then(() => showToast?.(`✓ ${label} скопійовано`));

            const copyRowStyle = {
              display: "flex", alignItems: "center", gap: 6, marginTop: 6,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 6, padding: "5px 8px",
            };
            const codeStyle = {
              fontFamily: "monospace", fontSize: 12, color: "#e0e0ff",
              flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            };
            const iconBtn = (onClick, icon, title) => (
              <button onClick={onClick} title={title} style={{
                flexShrink: 0, width: 24, height: 24, padding: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, cursor: "pointer",
                background: "rgba(0,212,255,0.08)", color: "#00d4ff",
                border: "1px solid rgba(0,212,255,0.2)", borderRadius: 4,
                fontFamily: "inherit",
              }}>{icon}</button>
            );

            const steps = [
              {
                n: 1,
                text: <>Створіть текстовий файл з назвою:</>,
                value: filename,
                copyLabel: "назву файлу",
                extra: null,
              },
              {
                n: 2,
                text: <>Вставте в нього <strong style={{ color: "#e0e0ff" }}>тільки цей рядок</strong> (ваш ключ верифікації):</>,
                value: key,
                copyLabel: "ключ",
                extra: null,
              },
              {
                n: 3,
                text: <>Завантажте файл у корінь сайту — він має бути доступний за адресою:</>,
                value: fileUrl,
                copyLabel: "URL",
                extra: fileUrl,
              },
            ];

            return (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>
                  <strong style={{ color: "#00d4ff" }}>IndexNow</strong> — дозволяє миттєво повідомляти Bing, Yandex та DuckDuckGo про нові сторінки.
                  Для верифікації потрібно розмістити файл-ключ на вашому сайті.
                </div>

                {steps.map(({ n, text, value, copyLabel, extra }) => (
                  <div key={n} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    {/* Номер кроку */}
                    <div style={{
                      flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
                      background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "#00d4ff", marginTop: 1,
                    }}>{n}</div>

                    {/* Текст + рядок копіювання */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#c8c8d8", lineHeight: 1.5 }}>{text}</div>
                      <div style={copyRowStyle}>
                        {extra
                          ? <a href={extra} target="_blank" rel="noopener noreferrer"
                              style={{ ...codeStyle, color: "#00d4ff", textDecoration: "none" }}
                              title="Відкрити в новій вкладці">{value}</a>
                          : <span style={codeStyle}>{value}</span>}
                        {iconBtn(() => copy(value, copyLabel), "📋", `Копіювати ${copyLabel}`)}
                        {extra && (
                          <a href={extra} target="_blank" rel="noopener noreferrer"
                            title="Відкрити в новій вкладці"
                            style={{
                              flexShrink: 0, width: 24, height: 24,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 12, background: "rgba(0,212,255,0.08)", color: "#00d4ff",
                              border: "1px solid rgba(0,212,255,0.2)", borderRadius: 4,
                              textDecoration: "none",
                            }}>🔗</a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            background: "rgba(255,255,255,0.02)", padding: "12px 16px", borderRadius: 10,
            border: `1px solid ${C.border}` }}>
            <input type="checkbox" checked={indexnowEnabled}
              onChange={e => setIndexnowEnabled(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: C.green }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Увімкнути IndexNow</div>
              <div style={{ fontSize: 12, color: C.muted }}>Відправляти URL у Bing при запуску індексації</div>
            </div>
          </label>
        </>
      )}

      {/* Помилка */}
      {error && (
        <p style={{ color: C.red, fontSize: 13, marginBottom: 12,
          background: "rgba(255,77,109,0.07)", padding: "10px 14px",
          borderRadius: 10, lineHeight: 1.5 }}>
          {error}
        </p>
      )}

      {/* Кнопки */}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn variant="ghost" onClick={onClose} disabled={loading} style={{ flex: 1 }}>
          Скасувати
        </Btn>
        <Btn variant="primary" loading={loading} onClick={save} style={{ flex: 2 }}>
          ✓ Зберегти
        </Btn>
      </div>
    </Modal>
  );
});
