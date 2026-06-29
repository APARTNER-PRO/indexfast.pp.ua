// src/pages/Auth.jsx  ← lazy chunk
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation }                  from "react-router-dom";
import { apiClient }                                 from "../api/client.js";
import { C }                                         from "../constants.js";
import i18n                                          from "../i18n/index.js";

// ── Типи видів
const VIEWS = { login: "login", register: "register", forgot: "forgot" };

export default function Auth() {
  const [, forceUpdate] = useState(0);
  const t = i18n.t.bind(i18n);

  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  // Визначаємо початковий вид з URL: /app/register → register, /app/login → login
  const initialView = location.pathname.endsWith("register")
    ? VIEWS.register
    : location.pathname.endsWith("forgot")
    ? VIEWS.forgot
    : VIEWS.login;

  const [view,    setView]    = useState(initialView);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(""); // для forgot-success / reg-success

  // Поля форм
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPass,     setLoginPass]     = useState("");
  const [remember,      setRemember]      = useState(false);
  const [regName,       setRegName]       = useState("");
  const [regSurname,    setRegSurname]    = useState("");
  const [regEmail,      setRegEmail]      = useState("");
  const [regPass,       setRegPass]       = useState("");
  const [agreeTerms,    setAgreeTerms]    = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(true);
  const [forgotEmail,   setForgotEmail]   = useState("");

  // Password strength
  const [strength, setStrength] = useState(0);
  const [showPass,  setShowPass]  = useState(false);

  // Email debounce validation
  const emailTimer = useRef(null);
  const [emailError, setEmailError] = useState("");

  // ── Google OAuth: обробляємо токени з URL (fragment або query)
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const hash   = new URLSearchParams(window.location.hash.slice(1));
    
    const accessToken  = search.get("token")   || hash.get("token");
    const refreshToken = search.get("refresh") || hash.get("refresh");

    if (accessToken) {
      localStorage.setItem("access_token",  accessToken);
      localStorage.setItem("refresh_token", refreshToken || "");
      
      // Очищаємо URL та редіректимо в кабінет
      window.history.replaceState(null, "", window.location.pathname);
      navigate("/app/dashboard", { replace: true });
      return;
    }
    // Redirect якщо вже авторизований
    if (localStorage.getItem("access_token")) {
      const from = location.state?.from || "/app/dashboard";
      navigate(from, { replace: true });
    }
  }, []);

  // ── Повідомлення: sessionStorage (від auto-refresh) і ?error= (Google OAuth)
  useEffect(() => {
    // msg від redirectToLogin — зберігається в sessionStorage
    const sessionMsg = sessionStorage.getItem("auth_msg");
    if (sessionMsg) {
      setError(sessionMsg);
      sessionStorage.removeItem("auth_msg"); // одноразове
    }

    // error= — від Google OAuth і verify-email (залишається в URL)
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    if (oauthError) {
      const messages = {
        invalid_state:        t("errors.securityError"),
        account_disabled:     t("errors.accountDisabled"),
        token_exchange_failed:t("errors.googleAuthError"),
        userinfo_failed:      t("errors.userinfoError"),
        verification_failed:  t("errors.verificationError"),
      };
      setError(messages[oauthError] || "Помилка входу через Google.");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Підставляємо збережений email
  useEffect(() => {
    const saved = localStorage.getItem("saved_email");
    if (saved) { setLoginEmail(saved); setRemember(true); }
  }, []);

  // Змінюємо URL при переключенні виду
  const switchView = useCallback((v) => {
    setView(v);
    setError("");
    setSuccess("");
    setEmailError("");
    navigate(`/app/${v}`, { replace: true });
  }, [navigate]);

  // ── Зберігаємо токени і редіректимо
  function saveAndRedirect(data) {
    localStorage.setItem("access_token",  data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token || "");
    if (remember) {
      localStorage.setItem("saved_email", loginEmail.trim());
    } else {
      localStorage.removeItem("saved_email");
    }
    const from = location.state?.from || "/app/dashboard";
    navigate(from, { replace: true });
  }

  // ── Валідація email (debounce)
  function onEmailChange(val, setter) {
    setter(val);
    setEmailError("");
    clearTimeout(emailTimer.current);
    emailTimer.current = setTimeout(() => {
      if (val && !isValidEmail(val)) setEmailError("Невалідний email");
    }, 600);
  }

  // ── ЛОГІН
  async function handleLogin(e) {
    e?.preventDefault();
    setError("");
    if (!isValidEmail(loginEmail)) { setError(t("auth.invalidEmail")); return; }
    if (!loginPass)                  { setError(t("auth.enterPassword")); return; }

    setLoading(true);
    try {
      const res = await apiClient.login({ email: loginEmail.trim(), password: loginPass });
      saveAndRedirect(res);
      showToast?.(t("auth.loginSuccess"));
    } catch (e) {
      if (e.status === 401) {
        setError(t("auth.invalidCredentials"));
        setLoginPass("");
      } else if (e.status === 429) {
        setError(e.message || t("auth.tooManyAttempts"));
      } else {
        setError(e.message || t("auth.generalError"));
      }
    } finally {
      setLoading(false);
    }
  }

  // ── РЕЄСТРАЦІЯ
  async function handleRegister(e) {
    e?.preventDefault();
    setError("");
    if (regName.trim().length < 2)   { setError(t("auth.nameMinLength")); return; }
    if (!isValidEmail(regEmail))      { setError(t("auth.invalidEmail")); return; }
    if (regPass.length < 8)           { setError(t("auth.passwordMinLength")); return; }
    if (!agreeTerms)                  { setError(t("auth.agreeTerms")); return; }

    setLoading(true);
    try {
      const res = await apiClient.register({
        name: regName.trim(), surname: regSurname.trim(),
        email: regEmail.trim(), password: regPass,
        marketing: agreeMarketing,
      });
      saveAndRedirect(res);
      showToast?.(t("auth.registerSuccess"));
    } catch (e) {
      if (e.status === 409 || e.message?.includes("вже існує")) {
        setError(<>Користувач з таким email вже існує. <button type="button" onClick={() => switchView("login")} style={{ color: C.green, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>{t("auth.loginLink")}</button></>);
      } else if (e.status === 429) {
        setError(t("auth.tooManyRegAttempts"));
      } else {
        setError(e.message || t("auth.registrationError"));
      }
    } finally {
      setLoading(false);
    }
  }

  // ── ВІДНОВЛЕННЯ ПАРОЛЯ
  async function handleForgot(e) {
    e?.preventDefault();
    setError("");
    if (!isValidEmail(forgotEmail)) { setError(t("auth.invalidForgotEmail")); return; }

    setLoading(true);
    try {
      await apiClient.forgot({ email: forgotEmail.trim() });
      setSuccess(forgotEmail.trim());
    } catch (e) {
      setError(e.message || t("auth.generalError"));
    } finally {
      setLoading(false);
    }
  }

  // ── Password strength
  function calcStrength(val) {
    let s = 0;
    if (val.length >= 8)         s++;
    if (/[A-Z]/.test(val))       s++;
    if (/[0-9]/.test(val))       s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  }

  const strengthColor = ["", C.red, C.gold, C.gold, C.green][strength];
  const strengthLabel = ["", "Слабкий", "Середній", "Добрий", "Надійний"][strength];

  return (
    <div className="auth-wrapper" style={{ minHeight: "100vh", background: C.black,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", color: C.white,
      padding: "40px 16px" }}>
      <style>{`
        .auth-mobile-logo { display: none; }
        .auth-container { }
        @media (max-width: 700px) {
          .auth-mobile-logo { display: block !important; }
          .auth-container { justify-content: center; border: none !important; border-radius: 0 !important; min-height: 100vh !important; }
          .auth-left  { display: none !important; }
          .auth-card  { width: 100% !important; max-width: 100% !important; border-radius: 16px !important; }
          .auth-inner { padding: 28px 20px !important; }
          .auth-wrapper { padding: 0 !important; align-items: flex-start !important; }
        }
        @media (max-width: 900px) and (min-width: 701px) {
          .auth-left { padding: 32px 24px !important; }
          .auth-left h2 { font-size: 20px !important; }
        }
      `}</style>

      {/* ── Контейнер по центру */}
      <div className="auth-container" style={{ width: "100%", maxWidth: 900, display: "flex",
        borderRadius: 20, overflow: "hidden",
        border: `1px solid ${C.border}`, minHeight: 600 }}>

        {/* ── Ліва панель — переваги */}
        <div className="auth-left" style={{ flex: 1, background: C.dark,
          borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "48px 40px" }}>
          <div>
          <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: 32 }}>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 22,
              letterSpacing: "-0.04em", color: C.white }}>
              Index<span style={{ color: C.green }}>Fast</span>
            </div>
          </a>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 26,
            lineHeight: 1.25, marginBottom: 24, letterSpacing: "-0.03em" }}>
            {t("overview.goPro")}
          </h2>
          {[
            { icon: "⚡", text: t("overview.proFeatures").split('·')[0].trim() },
            { icon: "🔑", text: t("auth.registerFreeBtn") },
            { icon: "📊", text: t("overview.urlsSentToday") },
            { icon: "🌐", text: t("sites.gscIntegration") },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12,
              marginBottom: 14, fontSize: 14, color: C.muted }}>
              <span style={{ fontSize: 18, width: 24, flexShrink: 0 }}>{icon}</span>
              {text}
            </div>
          ))}
          </div>
        </div>

        {/* ── Права панель — форми */}
        <div className="auth-inner" style={{ width: 420, display: "flex", alignItems: "center",
          justifyContent: "center", padding: "40px 32px",
          background: C.black }}>
          <div className="auth-card" style={{ width: "100%", maxWidth: 360 }}>

          {/* Логотип — тільки на мобільному (коли ліва панель прихована) */}
          <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: 32,
            textAlign: "center" }} className="auth-mobile-logo">
            <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 20,
              letterSpacing: "-0.04em", color: C.white }}>
              Index<span style={{ color: C.green }}>Fast</span>
            </span>
          </a>

          {/* ── ЛОГІН */}
          {view === VIEWS.login && (
            <form onSubmit={handleLogin}>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 24,
                marginBottom: 6 }}>{t("auth.login")}</h1>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
                {t("auth.noAccount")}{" "}
                <button type="button" onClick={() => switchView("register")}
                  style={linkBtnStyle}>{t("auth.registerFree")}</button>
              </p>

              {error && <ErrorAlert>{error}</ErrorAlert>}

              <Field label={t("auth.email")}>
                <Input type="email" value={loginEmail} autoComplete="email"
                  placeholder="your@email.com"
                  onChange={e => onEmailChange(e.target.value, setLoginEmail)}
                  error={emailError}/>
              </Field>

              <Field label={t("auth.password")} style={{ marginBottom: 8 }}>
                <div style={{ position: "relative" }}>
                  <Input type={showPass ? "text" : "password"} value={loginPass}
                    autoComplete="current-password" placeholder="••••••••"
                    onChange={e => setLoginPass(e.target.value)}/>
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: "absolute", right: 12, top: "50%",
                      transform: "translateY(-50%)", background: "none", border: "none",
                      cursor: "pointer", fontSize: 16, color: C.muted }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </Field>

              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8,
                  fontSize: 13, color: C.muted, cursor: "pointer" }}>
                  <input type="checkbox" checked={remember}
                    onChange={e => setRemember(e.target.checked)}/>
                  {t("auth.rememberMe")}
                </label>
                <button type="button" onClick={() => switchView("forgot")}
                  style={linkBtnStyle}>{t("auth.forgotPassword")}</button>
              </div>

              <SubmitBtn loading={loading}>{t("auth.login")}</SubmitBtn>

              <Divider t={t}/>
              <GoogleBtn t={t}/>
            </form>
          )}

          {/* ── РЕЄСТРАЦІЯ */}
          {view === VIEWS.register && (
            <form onSubmit={handleRegister}>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 24,
                marginBottom: 6 }}>{t("auth.register")}</h1>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
                {t("auth.hasAccount")}{" "}
                <button type="button" onClick={() => switchView("login")}
                  style={linkBtnStyle}>{t("auth.login")}</button>
              </p>

              {error && <ErrorAlert>{error}</ErrorAlert>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label={t("auth.name")}>
                  <Input value={regName} placeholder="Іван"
                    onChange={e => setRegName(e.target.value)}/>
                </Field>
                <Field label={t("profile.lastName")}>
                  <Input value={regSurname} placeholder="Коваль"
                    onChange={e => setRegSurname(e.target.value)}/>
                </Field>
              </div>

              <Field label={t("auth.email")}>
                <Input type="email" value={regEmail} autoComplete="email"
                  placeholder="your@email.com"
                  onChange={e => onEmailChange(e.target.value, setRegEmail)}
                  error={emailError}/>
              </Field>

              <Field label={t("auth.password")}>
                <div style={{ position: "relative" }}>
                  <Input type={showPass ? "text" : "password"} value={regPass}
                    autoComplete="new-password" placeholder="Мінімум 8 символів"
                    onChange={e => { setRegPass(e.target.value); calcStrength(e.target.value); }}/>
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: "absolute", right: 12, top: "50%",
                      transform: "translateY(-50%)", background: "none", border: "none",
                      cursor: "pointer", fontSize: 16, color: C.muted }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
                {regPass && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2,
                          background: i <= strength ? strengthColor : C.border,
                          transition: "background 0.2s" }}/>
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: strengthColor }}>{strengthLabel}</span>
                  </div>
                )}
              </Field>

              <label style={{ display: "flex", alignItems: "flex-start", gap: 10,
                fontSize: 13, color: C.muted, cursor: "pointer", marginBottom: 12 }}>
                <input type="checkbox" checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  style={{ marginTop: 2, flexShrink: 0 }}/>
                 <span>{t("auth.agreeTermsText")}{" "}
                   <a href="/terms.html" target="_blank" style={{ color: C.green }}>{t("auth.terms")}</a>
                   {" "}{t("auth.andText")}{" "}
                   <a href="/privacy-policy.html" target="_blank" style={{ color: C.green }}>{t("auth.privacy")}</a>
                 </span>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: 10,
                fontSize: 13, color: C.muted, cursor: "pointer", marginBottom: 24 }}>
                <input type="checkbox" checked={agreeMarketing}
                  onChange={e => setAgreeMarketing(e.target.checked)}
                  style={{ marginTop: 2, flexShrink: 0 }}/>
                 <span>
                  {t("profile.marketingDesc")}
                 </span>
              </label>

              <SubmitBtn loading={loading}>{t("auth.registerFreeBtn")}</SubmitBtn>

              <Divider t={t}/>
              <GoogleBtn t={t} onClick={() => {
                if (!agreeTerms) {
                  setError(t("auth.agreeTermsGoogle"));
                  return;
                }
                const BASE = import.meta?.env?.VITE_API_URL ?? "/api";
                window.location.href = BASE + "/auth/google/redirect.php";
              }} />
            </form>
          )}

          {/* ── ВІДНОВЛЕННЯ ПАРОЛЯ */}
          {view === VIEWS.forgot && !success && (
            <form onSubmit={handleForgot}>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 24,
                marginBottom: 6 }}>{t("auth.forgotTitle")}</h1>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
                {t("auth.forgotDesc")}
              </p>

              {error && <ErrorAlert>{error}</ErrorAlert>}

              <Field label={t("auth.email")}>
                <Input type="email" value={forgotEmail} placeholder={t("auth.emailPlaceholder")}
                  onChange={e => setForgotEmail(e.target.value)}/>
              </Field>

              <SubmitBtn loading={loading}>{t("auth.sendInstructions")}</SubmitBtn>

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button type="button" onClick={() => switchView("login")}
                  style={linkBtnStyle}>{t("auth.backToLogin")}</button>
              </div>
            </form>
          )}

          {/* ── FORGOT SUCCESS */}
          {view === VIEWS.forgot && success && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
                fontSize: 22, marginBottom: 12 }}>{t("auth.checkEmail")}</h2>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 8 }}>
                {t("auth.sentInstructions")}
              </p>
              <p style={{ color: C.green, fontWeight: 600, marginBottom: 24 }}>{success}</p>
              <p style={{ color: C.muted, fontSize: 12, marginBottom: 24 }}>
                {t("auth.notReceived")}{" "}
                <button type="button" onClick={() => setSuccess("")}
                  style={linkBtnStyle}>{t("auth.resend")}</button>
              </p>
              <button onClick={() => switchView("login")}
                style={{ background: C.green, color: C.black, border: "none",
                  borderRadius: 12, padding: "12px 32px", fontFamily: "Syne,sans-serif",
                  fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%" }}>
                {t("auth.backToLogin")}
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

// ── Допоміжні компоненти

const linkBtnStyle = {
  background: "none", border: "none", cursor: "pointer",
  color: C.green, fontSize: "inherit", fontFamily: "inherit",
  padding: 0, textDecoration: "underline",
};

function Field({ label, children, style: sx }) {
  return (
    <div style={{ marginBottom: 16, ...sx }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: C.muted, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ error, style: sx, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <>
      <input {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e  => { setFocused(false); props.onBlur?.(e);  }}
        style={{
          width: "100%", background: C.dark, borderRadius: 12,
          padding: "11px 14px", color: C.white, fontFamily: "inherit",
          fontSize: 14, outline: "none", boxSizing: "border-box",
          border: `1px solid ${error ? C.red : focused ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.1)"}`,
          transition: "border-color 0.2s", ...sx,
        }}/>
      {error && <p style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{error}</p>}
    </>
  );
}

function ErrorAlert({ children }) {
  return (
    <div style={{ background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.2)",
      borderRadius: 10, padding: "12px 16px", marginBottom: 16,
      fontSize: 13, color: C.red, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function SubmitBtn({ loading, children }) {
  return (
    <button type="submit" disabled={loading}
      style={{ width: "100%", background: loading ? "#1a3d2a" : C.green,
        color: loading ? "#2a6a44" : C.black, border: "none", borderRadius: 12,
        padding: "13px 20px", fontFamily: "Syne,sans-serif", fontWeight: 700,
        fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.2s", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8 }}>
      {loading
        ? <span style={{ width: 18, height: 18, border: "2px solid #2a6a44",
            borderTopColor: C.green, borderRadius: "50%",
            animation: "spin 0.7s linear infinite", display: "inline-block" }}/>
        : children}
    </button>
  );
}

function Divider({ t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12,
      margin: "20px 0", color: C.muted, fontSize: 12 }}>
      <div style={{ flex: 1, height: 1, background: C.border }}/>
      {t("auth.or")}
      <div style={{ flex: 1, height: 1, background: C.border }}/>
    </div>
  );
}

function GoogleBtn({ onClick, t }) {
  const BASE = import.meta?.env?.VITE_API_URL ?? "/api";
  return (
    <button type="button"
      onClick={onClick ? onClick : () => { window.location.href = BASE + "/auth/google/redirect.php"; }}
      style={{ width: "100%", background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
        padding: "12px 20px", color: C.white, fontFamily: "inherit",
        fontSize: 14, cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", gap: 10,
        transition: "background 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.7-2.9-11.3-7.2l-6.5 5C9.5 39.6 16.3 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.6-2.7 4.7-5 6.1l6.2 5.2C40 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-4z"/>
      </svg>
      {t("auth.continueWithGoogle")}
    </button>
  );
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
