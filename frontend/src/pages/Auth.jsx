// src/pages/Auth.jsx  ← lazy chunk
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation }                  from "react-router-dom";
import { apiClient }                                 from "../api/client.js";
import { C }                                         from "../constants.js";

// ── Типи видів
const VIEWS = { login: "login", register: "register", forgot: "forgot" };

export default function Auth() {
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
  const [forgotEmail,   setForgotEmail]   = useState("");

  // Password strength
  const [strength, setStrength] = useState(0);
  const [showPass,  setShowPass]  = useState(false);

  // Email debounce validation
  const emailTimer = useRef(null);
  const [emailError, setEmailError] = useState("");

  // ── Google OAuth: обробляємо токени з URL fragment #token=...&refresh=...
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("token=")) {
      const params = new URLSearchParams(hash.slice(1)); // прибираємо #
      const accessToken  = params.get("token");
      const refreshToken = params.get("refresh");
      if (accessToken) {
        localStorage.setItem("access_token",  accessToken);
        localStorage.setItem("refresh_token", refreshToken || "");
        // Очищаємо fragment з URL (токени не повинні залишатись в history)
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/app/dashboard", { replace: true });
        return;
      }
    }
    // Redirect якщо вже авторизований
    if (localStorage.getItem("access_token")) {
      const from = location.state?.from || "/app/dashboard";
      navigate(from, { replace: true });
    }
  }, []);

  // ── Повідомлення з redirectToLogin (msg=) і Google OAuth error (?error=)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // msg= — від auto-refresh redirectToLogin
    const msg = params.get("msg");
    if (msg) {
      setError(decodeURIComponent(msg));
    }

    // error= — від Google OAuth і verify-email
    const oauthError = params.get("error");
    if (oauthError) {
      const messages = {
        invalid_state:        "Помилка безпеки. Спробуйте ще раз.",
        account_disabled:     "Акаунт заблоковано. Зверніться до підтримки.",
        token_exchange_failed:"Помилка авторизації Google. Спробуйте ще раз.",
        userinfo_failed:      "Не вдалось отримати дані з Google.",
        verification_failed:  "Посилання для підтвердження недійсне або застаріле.",
      };
      setError(messages[oauthError] || "Помилка входу через Google.");
    }

    // Прибираємо параметри з URL
    if (msg || oauthError) {
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
    if (!isValidEmail(loginEmail)) { setError("Введіть коректний email"); return; }
    if (!loginPass)                  { setError("Введіть пароль"); return; }

    setLoading(true);
    try {
      const res = await apiClient.login({ email: loginEmail.trim(), password: loginPass });
      saveAndRedirect(res);
    } catch (e) {
      if (e.status === 401) {
        setError("Невірний email або пароль");
        setLoginPass("");
      } else if (e.status === 429) {
        setError(e.message || "Забагато спроб. Зачекайте кілька хвилин.");
      } else {
        setError(e.message || "Помилка входу. Спробуйте ще раз.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ── РЕЄСТРАЦІЯ
  async function handleRegister(e) {
    e?.preventDefault();
    setError("");
    if (regName.trim().length < 2)   { setError("Ім'я має бути мінімум 2 символи"); return; }
    if (!isValidEmail(regEmail))      { setError("Введіть коректний email"); return; }
    if (regPass.length < 8)           { setError("Пароль мінімум 8 символів"); return; }
    if (!agreeTerms)                  { setError("Погодьтесь з умовами використання"); return; }

    setLoading(true);
    try {
      const res = await apiClient.register({
        name: regName.trim(), surname: regSurname.trim(),
        email: regEmail.trim(), password: regPass,
      });
      saveAndRedirect(res);
    } catch (e) {
      if (e.status === 409 || e.message?.includes("вже існує")) {
        setError(<>Користувач з таким email вже існує. <button onClick={() => switchView("login")} style={{ color: C.green, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Увійти →</button></>);
      } else if (e.status === 429) {
        setError("Забагато спроб реєстрації. Зачекайте.");
      } else {
        setError(e.message || "Помилка реєстрації. Спробуйте ще раз.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ── ВІДНОВЛЕННЯ ПАРОЛЯ
  async function handleForgot(e) {
    e?.preventDefault();
    setError("");
    if (!isValidEmail(forgotEmail)) { setError("Введіть коректний email"); return; }

    setLoading(true);
    try {
      await apiClient.forgot({ email: forgotEmail.trim() });
      setSuccess(forgotEmail.trim());
    } catch (e) {
      setError(e.message || "Помилка. Спробуйте ще раз.");
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
    <div style={{ minHeight: "100vh", background: C.black,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", color: C.white,
      padding: "40px 16px" }}>

      {/* ── Контейнер по центру */}
      <div style={{ width: "100%", maxWidth: 900, display: "flex",
        borderRadius: 20, overflow: "hidden",
        border: `1px solid ${C.border}`, minHeight: 600 }}>

        {/* ── Ліва панель — переваги */}
        <div style={{ flex: 1, background: C.dark,
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
            Автоматична індексація<br/>в Google за хвилини
          </h2>
          {[
            { icon: "⚡", text: "До 500 URL/день на PRO плані" },
            { icon: "🔑", text: "Офіційний Google Indexing API" },
            { icon: "📊", text: "Статистика та логи в реальному часі" },
            { icon: "🌐", text: "Підтримка Sitemap Index" },
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
        <div style={{ width: 420, display: "flex", alignItems: "center",
          justifyContent: "center", padding: "40px 32px",
          background: C.black }}>
          <div style={{ width: "100%", maxWidth: 360 }}>

          {/* Логотип на мобільному */}
          <a href="/" style={{ textDecoration: "none", display: "block", marginBottom: 32,
            textAlign: "center" }}>
            <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 20,
              letterSpacing: "-0.04em", color: C.white }}>
              Index<span style={{ color: C.green }}>Fast</span>
            </span>
          </a>

          {/* ── ЛОГІН */}
          {view === VIEWS.login && (
            <form onSubmit={handleLogin}>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 24,
                marginBottom: 6 }}>З поверненням</h1>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
                Немає акаунту?{" "}
                <button type="button" onClick={() => switchView("register")}
                  style={linkBtnStyle}>Зареєструватись безкоштовно</button>
              </p>

              {error && <ErrorAlert>{error}</ErrorAlert>}

              <Field label="Email">
                <Input type="email" value={loginEmail} autoComplete="email"
                  placeholder="your@email.com"
                  onChange={e => onEmailChange(e.target.value, setLoginEmail)}
                  error={emailError}/>
              </Field>

              <Field label="Пароль" style={{ marginBottom: 8 }}>
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
                  Запам'ятати мене
                </label>
                <button type="button" onClick={() => switchView("forgot")}
                  style={linkBtnStyle}>Забули пароль?</button>
              </div>

              <SubmitBtn loading={loading}>Увійти</SubmitBtn>

              <Divider/>
              <GoogleBtn/>
            </form>
          )}

          {/* ── РЕЄСТРАЦІЯ */}
          {view === VIEWS.register && (
            <form onSubmit={handleRegister}>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 24,
                marginBottom: 6 }}>Створити акаунт</h1>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
                Вже є акаунт?{" "}
                <button type="button" onClick={() => switchView("login")}
                  style={linkBtnStyle}>Увійти</button>
              </p>

              {error && <ErrorAlert>{error}</ErrorAlert>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Ім'я">
                  <Input value={regName} placeholder="Іван"
                    onChange={e => setRegName(e.target.value)}/>
                </Field>
                <Field label="Прізвище">
                  <Input value={regSurname} placeholder="Коваль"
                    onChange={e => setRegSurname(e.target.value)}/>
                </Field>
              </div>

              <Field label="Email">
                <Input type="email" value={regEmail} autoComplete="email"
                  placeholder="your@email.com"
                  onChange={e => onEmailChange(e.target.value, setRegEmail)}
                  error={emailError}/>
              </Field>

              <Field label="Пароль">
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
                fontSize: 13, color: C.muted, cursor: "pointer", marginBottom: 24 }}>
                <input type="checkbox" checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  style={{ marginTop: 2, flexShrink: 0 }}/>
                <span>Погоджуюсь з{" "}
                  <a href="/terms.html" target="_blank" style={{ color: C.green }}>умовами використання</a>
                  {" "}та{" "}
                  <a href="/privacy-policy.html" target="_blank" style={{ color: C.green }}>політикою конфіденційності</a>
                </span>
              </label>

              <SubmitBtn loading={loading}>Зареєструватись безкоштовно</SubmitBtn>

              <Divider/>
              <GoogleBtn/>
            </form>
          )}

          {/* ── ВІДНОВЛЕННЯ ПАРОЛЯ */}
          {view === VIEWS.forgot && !success && (
            <form onSubmit={handleForgot}>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 24,
                marginBottom: 6 }}>Відновлення пароля</h1>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
                Введіть email і ми надішлемо інструкції для відновлення
              </p>

              {error && <ErrorAlert>{error}</ErrorAlert>}

              <Field label="Email">
                <Input type="email" value={forgotEmail} placeholder="your@email.com"
                  onChange={e => setForgotEmail(e.target.value)}/>
              </Field>

              <SubmitBtn loading={loading}>Надіслати інструкції</SubmitBtn>

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button type="button" onClick={() => switchView("login")}
                  style={linkBtnStyle}>← Повернутись до входу</button>
              </div>
            </form>
          )}

          {/* ── FORGOT SUCCESS */}
          {view === VIEWS.forgot && success && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
                fontSize: 22, marginBottom: 12 }}>Перевірте пошту</h2>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 8 }}>
                Ми надіслали інструкції на
              </p>
              <p style={{ color: C.green, fontWeight: 600, marginBottom: 24 }}>{success}</p>
              <p style={{ color: C.muted, fontSize: 12, marginBottom: 24 }}>
                Не отримали? Перевірте папку «Спам» або{" "}
                <button type="button" onClick={() => setSuccess("")}
                  style={linkBtnStyle}>спробуйте знову</button>
              </p>
              <button onClick={() => switchView("login")}
                style={{ background: C.green, color: C.black, border: "none",
                  borderRadius: 12, padding: "12px 32px", fontFamily: "Syne,sans-serif",
                  fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%" }}>
                Повернутись до входу
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

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12,
      margin: "20px 0", color: C.muted, fontSize: 12 }}>
      <div style={{ flex: 1, height: 1, background: C.border }}/>
      або
      <div style={{ flex: 1, height: 1, background: C.border }}/>
    </div>
  );
}

function GoogleBtn() {
  const BASE = import.meta?.env?.VITE_API_URL ?? "/api";
  return (
    <button type="button"
      onClick={() => { window.location.href = BASE + "/auth/google/redirect.php"; }}
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
      Продовжити з Google
    </button>
  );
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
