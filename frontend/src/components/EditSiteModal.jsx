// src/components/EditSiteModal.jsx
import { useState, useEffect, memo } from "react";
import { Modal, Field, Input, Textarea, Btn } from "./ui/index.jsx";
import { useQueryClient }                      from "@tanstack/react-query";
import { apiClient }                           from "../api/client.js";
import { KEYS }                                from "../hooks/useStats.js";
import { C }                                   from "../constants.js";

export const EditSiteModal = memo(function EditSiteModal({
  open, onClose, site, showToast,
}) {
  const [domain,  setDomain]  = useState("");
  const [sitemap, setSitemap] = useState("");
  const [sa,      setSa]      = useState("");
  const [indexnowEnabled, setIndexnowEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("info"); // info | sa | indexnow

  const qc = useQueryClient();

  // Заповнюємо з поточного сайту
  useEffect(() => {
    if (open && site) {
      setDomain(site.domain ?? "");
      setSitemap(site.sitemap_url ?? "");
      setSa("");
      setIndexnowEnabled(site.indexnow_enabled ?? false);
      setError("");
      setTab(site.has_sa === false ? "sa" : "info"); // якщо немає SA — одразу на вкладку SA
    }
  }, [open, site]);

  async function save() {
    setError("");

    // Базова валідація
    const trimDomain  = domain.trim();
    const trimSitemap = sitemap.trim();
    const trimSa      = sa.trim();

    if (!trimDomain)  { setError("Введіть домен"); return; }
    if (!trimSitemap) { setError("Введіть URL sitemap"); return; }

    // Якщо SA заповнено — валідуємо
    if (trimSa) {
      try {
        const obj = JSON.parse(trimSa);
        if (obj?.type !== "service_account")
          { setError('Тип має бути "service_account"'); return; }
        if (!obj.client_email || !obj.private_key)
          { setError("Відсутній client_email або private_key"); return; }
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

      await apiClient.updateSite(body);
      qc.invalidateQueries({ queryKey: KEYS.stats });
      showToast?.("✓ Сайт оновлено");
      onClose();
    } catch (e) {
      setError(e.message || "Помилка збереження");
    } finally {
      setLoading(false);
    }
  }

  if (!site) return null;

  const hasSa = site.has_sa !== false;

  return (
    <Modal open={open} onClose={onClose}
      title={`Редагувати сайт`}
      subtitle={site.domain}>

      {/* Вкладки */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20,
        background: C.dark, borderRadius: 10, padding: 4,
        border: `1px solid ${C.border}` }}>
        {[
          { id: "info", label: "🌐 Основне" },
          { id: "sa",   label: hasSa ? "🔑 Service Account" : "⚠ Додати SA" },
          { id: "indexnow", label: "🚀 IndexNow" },
        ].map(t => (
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
          <Field label="Домен сайту" hint="Без https:// — наприклад: myshop.ua">
            <Input value={domain} onChange={e => setDomain(e.target.value)}
              placeholder="myshop.ua"/>
          </Field>
          <Field label="URL Sitemap.xml" hint="Повна адреса з https://...">
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
              ⚠ Цей сайт не має Service Account.
              Без нього запуск індексації неможливий.
            </div>
          )}
          {hasSa && (
            <div style={{ background: "rgba(0,255,136,0.06)",
              border: "1px solid rgba(0,255,136,0.15)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              fontSize: 13, color: C.green }}>
              ✅ Service Account підключений. Вставте новий JSON щоб замінити.
            </div>
          )}
          <Field label="Google Service Account JSON"
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
          <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#c8c8d8" }}>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong style={{ color: "#00d4ff" }}>IndexNow</strong> дозволяє миттєво відправляти URL у Bing, Yandex, Seznam та DuckDuckGo. Це працює паралельно з Google Indexing API.
            </p>
            {site.indexnow_key && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Ваш ключ верифікації:</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <code style={{ background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 4, color: "#fff" }}>
                    {site.indexnow_key}
                  </code>
                </div>
                <p style={{ marginTop: 12, fontSize: 12, color: C.muted }}>
                  1. Створіть файл <strong>{site.indexnow_key}.txt</strong><br/>
                  2. Вставте в нього ваш ключ: <strong>{site.indexnow_key}</strong><br/>
                  3. Завантажте файл у корінь вашого сайту: <strong>https://{site.domain}/{site.indexnow_key}.txt</strong>
                </p>
              </div>
            )}
          </div>

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
