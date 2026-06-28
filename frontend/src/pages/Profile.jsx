// src/pages/Profile.jsx  ← lazy chunk
import { useState, useEffect, memo } from "react";
import { useQueryClient }            from "@tanstack/react-query";
import { useTranslation }            from "react-i18next";
import { apiClient }                 from "../api/client.js";
import { KEYS }                      from "../hooks/useStats.js";
import { C }                         from "../constants.js";
import { Spinner, Btn }              from "../components/ui/index.jsx";

// ── Strength bar
function StrengthBar({ password, t }) {
  if (!password) return null;
  let s = 0;
  if (password.length >= 8)          s++;
  if (/[A-Z]/.test(password))        s++;
  if (/[0-9]/.test(password))        s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  const colors = ["", C.red, C.gold, C.gold, C.green];
  const labels = ["", t("profile.weak"), t("profile.medium"), t("profile.good"), t("profile.strong")];
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

export default function Profile({ user, onUpdate, showToast, t }) {
  // ── Загальна інфо
  const [name,    setName]    = useState(user?.name    ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [savingInfo, setSavingInfo] = useState(false);

  // ── Marketing consent
  const [marketing,     setMarketing]    = useState(user?.marketing_consent ?? false);
  const [savingMarketing, setSavingMarketing] = useState(false);

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
      setMarketing(user.marketing_consent ?? false);
    }
  }, [user?.id]);

  // ── Зберігаємо ім'я/прізвище
  async function saveInfo(e) {
    e.preventDefault();
    if (name.trim().length < 2) { showToast(t("profile.nameMinLength"), "error"); return; }
    setSavingInfo(true);
    try {
      const res = await apiClient.updateProfile({ name: name.trim(), surname: surname.trim() });
      qc.invalidateQueries({ queryKey: KEYS.stats });
      onUpdate?.(res.user);
      showToast(t("profile.updateSuccess"));
    } catch (e) {
      showToast(e.message || t("common.saveError"), "error");
    } finally {
      setSavingInfo(false);
    }
  }

  // ── Зберігаємо email
  async function saveEmail(e) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast(t("profile.invalidEmail"), "error"); return;
    }
    if (email === user?.email) { showToast(t("profile.emailNotChanged")); return; }
    setSavingEmail(true);
    try {
      const res = await apiClient.updateProfile({ email });
      qc.invalidateQueries({ queryKey: KEYS.stats });
      onUpdate?.(res.user);
      showToast(t("profile.emailChanged"));
    } catch (e) {
      showToast(e.message || t("profile.emailChangeError"), "error");
    } finally {
      setSavingEmail(false);
    }
  }

  // ── Маркетинг
  async function saveMarketing(val) {
    setMarketing(val);
    setSavingMarketing(true);
    try {
      await apiClient.updateProfile({ marketing_consent: val });
      qc.invalidateQueries({ queryKey: KEYS.stats });
      showToast(val ? t("profile.subscribed") : t("profile.unsubscribed"));
    } catch (e) {
      setMarketing(!val); // rollback
      showToast(e.message || t("common.saveError"), "error");
    } finally {
      setSavingMarketing(false);
    }
  }

  // ── Зберігаємо пароль
  async function savePassword(e) {
    e.preventDefault();
    if (newPass.length < 8)     { showToast(t("profile.passwordMinLength"), "error"); return; }
    if (newPass !== newPass2)   { showToast(t("profile.passwordsMismatch"), "error"); return; }
    if (user?.password_hash !== undefined && !currentPass) {
      showToast(t("profile.enterCurrentPassword"), "error"); return;
    }
    setSavingPass(true);
    try {
      await apiClient.updateProfile({ current_password: currentPass, new_password: newPass });
      setCurrentPass(""); setNewPass(""); setNewPass2("");
      showToast(t("profile.passwordChanged"));
      setTimeout(() => {
        apiClient.logout();
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/app/login";
      }, 2000);
    } catch (e) {
      const msg = e.status === 401
        ? t("profile.wrongCurrentPassword")
        : e.message || t("profile.passwordChangeError");
      showToast(msg, "error");
      setCurrentPass("");
    } finally {
      setSavingPass(false);
    }
  }

  const planColors = { start: C.muted, pro: C.green, agency: C.gold, enterprise: "#9370db" };
  const planColor  = planColors[user?.plan] ?? C.muted;

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
        fontSize: 20, marginBottom: 24 }}>{t("profile.title")}</h2>

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
                ⚠ {t("profile.emailNotVerified")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Ім'я і прізвище */}
      <Section title={t("profile.basicInfo")}>
        <form onSubmit={saveInfo}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            <Field label={t("profile.firstName")}>
              <Input value={name} onChange={e => setName(e.target.value)}
                placeholder="Іван" autoComplete="given-name"/>
            </Field>
            <Field label={t("profile.lastName")}>
              <Input value={surname} onChange={e => setSurname(e.target.value)}
                placeholder="Коваль" autoComplete="family-name"/>
            </Field>
          </div>
          <Btn type="submit" variant="outline" loading={savingInfo}
            style={{ marginTop: 4 }}>
            {t("profile.save")}
          </Btn>
        </form>
      </Section>

      {/* ── Email */}
      <Section title={t("profile.emailSection")}>
        <form onSubmit={saveEmail}>
          <Field label={t("profile.email")}
            hint={email !== user?.email
              ? t("profile.emailVerifyHint")
              : user?.email_verified === false
              ? t("profile.emailNotVerified")
              : undefined}>
            <Input type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" autoComplete="email"/>
          </Field>
          <Btn type="submit" variant="outline" loading={savingEmail}
            disabled={email === user?.email}
            style={{ marginTop: 4 }}>
            {t("profile.changeEmail")}
          </Btn>
        </form>
      </Section>

      {/* ── Пароль */}
      <Section title={t("profile.passwordSection")}>
        <form onSubmit={savePassword}>
          {/* Поточний пароль — тільки якщо є password (не тільки Google) */}
          <Field label={t("profile.currentPassword")}>
            <div style={{ position: "relative" }}>
              <Input type={showPasses ? "text" : "password"}
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                placeholder={t("profile.currentPassword")} autoComplete="current-password"/>
            </div>
          </Field>
          <Field label={t("profile.newPassword")}>
            <div style={{ position: "relative" }}>
              <Input type={showPasses ? "text" : "password"}
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder={t("profile.passwordMinLength")} autoComplete="new-password"/>
              <button type="button" onClick={() => setShowPasses(p => !p)}
                style={{ position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)", background: "none", border: "none",
                  cursor: "pointer", color: C.muted, fontSize: 15 }}>
                {showPasses ? "🙈" : "👁"}
              </button>
            </div>
            <StrengthBar password={newPass} t={t} />
          </Field>
          <Field label={t("profile.confirmPassword")}>
            <Input type={showPasses ? "text" : "password"}
              value={newPass2}
              onChange={e => setNewPass2(e.target.value)}
              placeholder={t("profile.passwordMinLength")} autoComplete="new-password"
              style={{ borderColor: newPass2 && newPass !== newPass2 ? C.red : undefined }}/>
            {newPass2 && newPass !== newPass2 && (
              <p style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{t("profile.passwordsMismatch")}</p>
            )}
          </Field>
          <Btn type="submit" variant="outline" loading={savingPass}
            disabled={!newPass || !newPass2}
            style={{ marginTop: 4 }}>
            {t("profile.changePassword")}
          </Btn>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
            {t("profile.logoutHint")}
          </p>
        </form>
      </Section>

      {/* ── Маркетингові листи */}
      <Section title={t("profile.marketing")}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 14,
          cursor: savingMarketing ? "not-allowed" : "pointer" }}>
          <div style={{ position: "relative", flexShrink: 0, marginTop: 2 }}>
            <input type="checkbox"
              checked={marketing}
              disabled={savingMarketing}
              onChange={e => saveMarketing(e.target.checked)}
              style={{ width: 18, height: 18, cursor: "pointer", accentColor: C.green }}/>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              {t("profile.marketingTitle")}
              {savingMarketing && (
                <span style={{ marginLeft: 8, fontSize: 11, color: C.muted }}>
                  {t("profile.marketingSaving")}
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              {t("profile.marketingDesc")}
            </div>
            {!marketing && (
              <div style={{ fontSize: 12, color: C.gold, marginTop: 6 }}>
                {t("profile.unsubscribed")}
              </div>
            )}
            {marketing && (
              <div style={{ fontSize: 12, color: C.green, marginTop: 6 }}>
                {t("profile.subscribed")}
              </div>
            )}
          </div>
        </label>
      </Section>

      {/* ── Небезпечна зона */}
      <div style={{ background: "rgba(255,77,109,0.04)",
        border: "1px solid rgba(255,77,109,0.15)",
        borderRadius: 16, padding: 20, marginTop: 8 }}>
        <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700,
          fontSize: 14, color: C.red, marginBottom: 12 }}>{t("profile.dangerZone")}</h3>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
          {t("profile.deleteAccountWarning")}
        </p>
        <Btn variant="danger"
          onClick={() => showToast(t("profile.deleteAccountSupport"), "error")}>
          {t("profile.deleteAccount")}
        </Btn>
      </div>
    </div>
  );
}
