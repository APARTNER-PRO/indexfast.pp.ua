// src/components/AddSiteModal.jsx
import { useState, useEffect, memo } from "react";
import { Modal, Field, Input, Textarea, Btn } from "./ui/index.jsx";
import { useAddSite } from "../hooks/useStats.js";
import { C } from "../constants.js";

export const AddSiteModal = memo(function AddSiteModal({
  open, onClose, onSuccess, plan, sitesCount, sitesLimit,
}) {
  const [domain,  setDomain]  = useState("");
  const [sitemap, setSitemap] = useState("");
  const [sa,      setSa]      = useState("");
  const [error,   setError]   = useState("");

  const addSite = useAddSite();

  // Скидаємо форму при відкритті
  useEffect(() => {
    if (open) { setDomain(""); setSitemap(""); setSa(""); setError(""); }
  }, [open]);

  const canAdd = sitesCount < sitesLimit;

  async function submit() {
    setError("");
    if (!domain.trim())  return setError("Введіть домен сайту");
    if (!sitemap.trim()) return setError("Введіть URL sitemap.xml");
    if (!sa.trim())      return setError("Вставте Google Service Account JSON");

    let saObj;
    try         { saObj = JSON.parse(sa); }
    catch       { return setError("Невалідний JSON. Перевірте дужки і лапки."); }

    if (saObj?.type !== "service_account")
      return setError('Файл має бути типу "service_account"');
    if (!saObj.client_email || !saObj.private_key)
      return setError("JSON не містить client_email або private_key");

    try {
      const data = await addSite.mutateAsync({ domain, sitemap_url: sitemap, service_account: sa });
      onSuccess?.(data?.site);
      onClose();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Modal open={open} onClose={onClose}
      title="Додати сайт"
      subtitle="Підключіть сайт для автоматичної індексації в Google">

      {!canAdd ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
          <p style={{ color: C.muted, marginBottom: 20 }}>
            План «{plan}» дозволяє максимум {sitesLimit} сайт(ів).<br/>
            Оновіть план для підключення більшої кількості сайтів.
          </p>
          <Btn variant="primary" onClick={() => { onClose(); window.location.href = "/#pricing"; }}>
            Переглянути плани →
          </Btn>
        </div>
      ) : (
        <>
          <Field label="Домен сайту" hint="Наприклад: myshop.ua (без https://)">
            <Input
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="myshop.ua"
              onKeyDown={e => e.key === "Enter" && submit()}
            />
          </Field>

          <Field label="URL Sitemap.xml" hint="Повна адреса sitemap.xml або sitemap index">
            <Input
              value={sitemap}
              onChange={e => setSitemap(e.target.value)}
              placeholder="https://myshop.ua/sitemap.xml"
            />
          </Field>

          <Field label="Google Service Account JSON"
            hint={<>Потрібен для Google Indexing API.{" "}
              <a href="/docs/" style={{ color: C.green }}>Як отримати →</a></>}>
            <Textarea
              value={sa}
              onChange={e => setSa(e.target.value)}
              placeholder={'{\n  "type": "service_account",\n  "client_email": "...",\n  "private_key": "-----BEGIN RSA PRIVATE KEY-----\\n..."\n}'}
            />
          </Field>

          {error && (
            <p style={{ color: C.red, fontSize: 13, marginBottom: 12,
              background: "rgba(255,77,109,0.07)", padding: "10px 14px", borderRadius: 10 }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Скасувати</Btn>
            <Btn variant="primary" loading={addSite.isPending} onClick={submit} style={{ flex: 2 }}>
              ✓ Підключити сайт
            </Btn>
          </div>
        </>
      )}
    </Modal>
  );
});
