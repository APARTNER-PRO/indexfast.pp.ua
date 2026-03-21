// src/pages/Profile.jsx  ← lazy chunk
import { useState, useEffect, memo } from "react";
import { useQueryClient }            from "@tanstack/react-query";
import { apiClient }                 from "../api/client.js";
import { KEYS }                      from "../hooks/useStats.js";
import { C }                         from "../constants.js";
import { Spinner, Btn }              from "../components/ui/index.jsx";

// ── Strength bar
function StrengthBar({ password }) {
  if (!password) return null;
  let s = 0;
  if (password.length >= 8)          s++;
  if (/[A-Z]/.test(password))        s++;
  if (/[0-9]/.test(password))        s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  const colors = ["", C.red, C.gold, C.gold, C.green];
  const labels = ["", "Слабкий", "Середній", "Добрий", "Надійний"];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2,
            background: i <= s ? colors[s] : C.border, transition: "background 0.2s" }}/>
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[s] }}>{labels[s]}</span>
    </div>
  );
}

// ── Секція форми
const Section = memo(function Section({ title, children }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700,
        fontSize: 15, marginBottom: 20, color: C.white }}>{title}</h3>
      {children}
    </div>
  );
});

// ── Поле
function Field({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: C.muted, marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

// ── Input
function Input({ style: sx, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e  => { setFocused(false); props.onBlur?.(e); }}
      style={{ width: "100%", background: C.dark,
        border: `1px solid ${focused ? "rgba(0,255,136,0.4)" : C.border2}`,
        borderRadius: 12, padding: "10px 14px", color: C.white,
        fontFamily: "inherit", fontSize: 14, outline: "none",
        boxSizing: "border-box", transition: "border-color 0.2s", ...sx }}/>
  );
}

export default function Profile({ user, onUpdate, showToast }) {
  // ── Загальна інфо
  const [name,    setName]    = useState(user?.name    ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [savingInfo, setSavingInfo] = useState(false);

  // ── Email
  const [email,      setEmail]      = useState(user?.email ?? "");
  const [savingEmail, setSavingEmail] = useState(false);

  // ── Пароль
  const [currentPass, setCurrentPass] = useState("");
  const [newPass,     setNewPass]     = useState("");
  const [newPass2,    setNewPass2]    = useState("");
  const [showPasses,  setShowPasses]  = useState(false);
  const [savingPass,  setSavingPass]  = useState(false);

  const qc = useQueryClient();

  // Синхронізуємо якщо user оновився
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setSurname(user.surname ?? "");
      setEmail(user.email ?? "");
    }
  }, [user?.id]);

  // ── Зберігаємо ім'я/прізвище
  async function saveInfo(e) {
    e.preventDefault();
    if (name.trim().length < 2) { showToast("Ім'я мінімум 2 символи", "error"); return; }
    setSavingInfo(true);
    try {
      const res = await apiClient.updateProfile({ name: name.trim(), surname: surname.trim() });
      qc.invalidateQueries({ queryKey: KEYS.stats });
      onUpdate?.(res.user);
      showToast("✓ Профіль оновлено");
    } catch (e) {
      showToast(e.message || "Помилка збереження", "error");
    } finally {
      setSavingInfo(false);
    }
  }

  // ── Зберігаємо email
  async function saveEmail(e) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Введіть коректний email", "error"); return;
    }
    if (email === user?.email) { showToast("Email не змінився"); return; }
    setSavingEmail(true);
    try {
      const res = await apiClient.updateProfile({ email });
      qc.invalidateQueries({ queryKey: KEYS.stats });
      onUpdate?.(res.user);
      showToast("✓ Email змінено. Перевірте пошту для підтвердження.");
    } catch (e) {
      showToast(e.message || "Помилка зміни email", "error");
    } finally {
      setSavingEmail(false);
    }
  }

  // ── Зберігаємо пароль
  async function savePassword(e) {
    e.preventDefault();
    if (newPass.length < 8)     { showToast("Пароль мінімум 8 символів", "error"); return; }
    if (newPass !== newPass2)   { showToast("Паролі не збігаються", "error"); return; }
    if (user?.password_hash !== undefined && !currentPass) {
      showToast("Введіть поточний пароль", "error"); return;
    }
    setSavingPass(true);
    try {
      await apiClient.updateProfile({ current_password: currentPass, new_password: newPass });
      setCurrentPass(""); setNewPass(""); setNewPass2("");
      showToast("✓ Пароль змінено. Увійдіть знову.");
      // Logout тільки при успіху — сесія інвалідована на сервері
      setTimeout(() => {
        apiClient.logout();
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/app/login";
      }, 2000);
    } catch (e) {
      // Невірний пароль (401) або інша помилка — НЕ розлогінюємо
      const msg = e.status === 401
        ? "Поточний пароль невірний"
        : e.message || "Помилка зміни пароля";
      showToast(msg, "error");
      setCurrentPass(""); // очищаємо поле поточного пароля
    } finally {
      setSavingPass(false);
    }
  }

  const planColors = { start: C.muted, pro: C.green, agency: C.gold, enterprise: "#9370db" };
  const planColor  = planColors[user?.plan] ?? C.muted;

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
        fontSize: 20, marginBottom: 24 }}>Профіль</h2>

      {/* ── Аватар + план */}
      <div style={{ display: "flex", alignItems: "center", gap: 16,
        marginBottom: 24, padding: 20,
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, flexShrink: 0,
          background: `${planColor}22`, border: `2px solid ${planColor}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 20,
          color: planColor }}>
          {(user?.name?.[0] ?? "U").toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 16 }}>
            {user?.name} {user?.surname}
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{user?.email}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.1em", color: planColor,
              background: `${planColor}15`, padding: "2px 8px",
              borderRadius: 100, border: `1px solid ${planColor}30` }}>
              {user?.plan}
            </span>
            {user?.email_verified === false && (
              <span style={{ fontSize: 10, color: C.gold,
                background: "rgba(255,208,96,0.1)", padding: "2px 8px",
                borderRadius: 100, border: "1px solid rgba(255,208,96,0.2)" }}>
                ⚠ Email не підтверджено
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Ім'я і прізвище */}
      <Section title="Основна інформація">
        <form onSubmit={saveInfo}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Ім'я">
              <Input value={name} onChange={e => setName(e.target.value)}
                placeholder="Іван" autoComplete="given-name"/>
            </Field>
            <Field label="Прізвище">
              <Input value={surname} onChange={e => setSurname(e.target.value)}
                placeholder="Коваль" autoComplete="family-name"/>
            </Field>
          </div>
          <Btn type="submit" variant="outline" loading={savingInfo}
            style={{ marginTop: 4 }}>
            Зберегти
          </Btn>
        </form>
      </Section>

      {/* ── Email */}
      <Section title="Email адреса">
        <form onSubmit={saveEmail}>
          <Field label="Email"
            hint={email !== user?.email
              ? "⚠ Після зміни email потрібно підтвердити нову адресу. Поточна сесія буде завершена."
              : user?.email_verified === false
              ? "Email не підтверджено. Перевірте пошту або запросіть новий лист."
              : undefined}>
            <Input type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" autoComplete="email"/>
          </Field>
          <Btn type="submit" variant="outline" loading={savingEmail}
            disabled={email === user?.email}
            style={{ marginTop: 4 }}>
            Змінити email
          </Btn>
        </form>
      </Section>

      {/* ── Пароль */}
      <Section title="Пароль">
        <form onSubmit={savePassword}>
          {/* Поточний пароль — тільки якщо є password (не тільки Google) */}
          <Field label="Поточний пароль">
            <div style={{ position: "relative" }}>
              <Input type={showPasses ? "text" : "password"}
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                placeholder="Поточний пароль" autoComplete="current-password"/>
            </div>
          </Field>
          <Field label="Новий пароль">
            <div style={{ position: "relative" }}>
              <Input type={showPasses ? "text" : "password"}
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="Мінімум 8 символів" autoComplete="new-password"/>
              <button type="button" onClick={() => setShowPasses(p => !p)}
                style={{ position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)", background: "none", border: "none",
                  cursor: "pointer", color: C.muted, fontSize: 15 }}>
                {showPasses ? "🙈" : "👁"}
              </button>
            </div>
            <StrengthBar password={newPass}/>
          </Field>
          <Field label="Підтвердіть пароль">
            <Input type={showPasses ? "text" : "password"}
              value={newPass2}
              onChange={e => setNewPass2(e.target.value)}
              placeholder="Повторіть пароль" autoComplete="new-password"
              style={{ borderColor: newPass2 && newPass !== newPass2 ? C.red : undefined }}/>
            {newPass2 && newPass !== newPass2 && (
              <p style={{ fontSize: 11, color: C.red, marginTop: 4 }}>Паролі не збігаються</p>
            )}
          </Field>
          <Btn type="submit" variant="outline" loading={savingPass}
            disabled={!newPass || !newPass2}
            style={{ marginTop: 4 }}>
            Змінити пароль
          </Btn>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
            Після зміни пароля вас буде розлоговано.
          </p>
        </form>
      </Section>

      {/* ── Небезпечна зона */}
      <div style={{ background: "rgba(255,77,109,0.04)",
        border: "1px solid rgba(255,77,109,0.15)",
        borderRadius: 16, padding: 20, marginTop: 8 }}>
        <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700,
          fontSize: 14, color: C.red, marginBottom: 12 }}>Небезпечна зона</h3>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
          Видалення акаунту призведе до втрати всіх даних: сайтів, логів, статистики.
          Цю дію неможливо скасувати.
        </p>
        <Btn variant="danger"
          onClick={() => showToast("Для видалення акаунту зверніться до підтримки: t.me/indexfastgoogle", "error")}>
          Видалити акаунт
        </Btn>
      </div>
    </div>
  );
}
