// src/pages/ResetPassword.jsx  ← lazy chunk
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiClient } from "../api/client.js";
import { C }         from "../constants.js";

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate             = useNavigate();
  const [searchParams]       = useSearchParams();
  const token                = searchParams.get("token") || "";

  const [password,    setPassword]    = useState("");
  const [password2,   setPassword2]   = useState("");
  const [showPass,    setShowPass]     = useState(false);
  const [loading,     setLoading]      = useState(false);
  const [error,       setError]        = useState("");
  const [done,        setDone]         = useState(false);
  const [strength,    setStrength]     = useState(0);

  // Токен відсутній — показуємо помилку одразу
  const noToken = !token;

  // Якщо вже авторизований — на dashboard
  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/app/dashboard", { replace: true });
    }
  }, []);

  // Password strength
  function calcStrength(val) {
    let s = 0;
    if (val.length >= 8)          s++;
    if (/[A-Z]/.test(val))        s++;
    if (/[0-9]/.test(val))        s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  }

  const strengthColor = ["", C.red, C.gold, C.gold, C.green][strength];
  const strengthLabel = ["", t("profile.weak"), t("profile.medium"), t("profile.good"), t("profile.strong")][strength];

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("profile.passwordMinLength"));
      return;
    }
    if (password !== password2) {
      setError(t("profile.passwordsMismatch"));
      return;
    }

    setLoading(true);
    try {
      await apiClient.reset({ token, password });
      setDone(true);
    } catch (e) {
      if (e.status === 400) {
        setError(t("auth.invalidResetLink"));
      } else if (e.status === 422) {
        setError(e.message || t("auth.passwordRequirements"));
      } else {
        setError(e.message || t("auth.generalError"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.black,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Логотип */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link to="/app/login" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
              fontSize: 22, letterSpacing: "-0.04em", color: "#f0f0f8" }}>
              Index<span style={{ color: C.green }}>Fast</span>
            </span>
          </Link>
        </div>

        <div style={{ background: C.dark, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: "36px 32px" }}>

          {/* ── Токен відсутній */}
          {noToken && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
               <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
                 fontSize: 22, marginBottom: 12 }}>{t("auth.invalidLink")}</h1>
               <p style={{ color: C.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                 {t("auth.invalidLinkDesc")}
               </p>
               <Link to="/app/forgot" style={{ display: "inline-block",
                 background: C.green, color: C.black, borderRadius: 12,
                 padding: "12px 28px", fontFamily: "Syne,sans-serif",
                 fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                 {t("auth.requestNewLink")}
               </Link>
            </div>
          )}

          {/* ── Успішна зміна */}
          {!noToken && done && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
                fontSize: 22, marginBottom: 12 }}>{t("auth.passwordChangedTitle")}</h1>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
                {t("auth.passwordChangedDesc")}
              </p>
              <Link to="/app/login" style={{ display: "block",
                background: C.green, color: C.black, borderRadius: 12,
                padding: "13px 20px", fontFamily: "Syne,sans-serif",
                fontWeight: 700, fontSize: 15, textDecoration: "none",
                textAlign: "center" }}>
                {t("auth.goToLogin")}
              </Link>
            </div>
          )}

          {/* ── Форма нового пароля */}
          {!noToken && !done && (
            <form onSubmit={handleSubmit}>
              <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
                fontSize: 24, marginBottom: 6 }}>{t("auth.newPasswordTitle")}</h1>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
                {t("auth.newPasswordDesc")}
              </p>

              {/* Error */}
              {error && (
                <div style={{ background: "rgba(255,77,109,0.08)",
                  border: "1px solid rgba(255,77,109,0.2)", borderRadius: 10,
                  padding: "12px 16px", marginBottom: 16,
                  fontSize: 13, color: C.red, lineHeight: 1.5 }}>
                  {error}
                   {error.includes(t("auth.requestNew")) && (
                    <> <Link to="/app/forgot"
                      style={{ color: C.green, marginLeft: 4 }}>
                      Запросити →
                    </Link></>
                  )}
                </div>
              )}

              {/* Новий пароль */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: C.muted, marginBottom: 6 }}>Новий пароль</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    autoComplete="new-password"
                    placeholder={t("profile.passwordMinLength")}
                    onChange={e => { setPassword(e.target.value); calcStrength(e.target.value); }}
                    style={{ width: "100%", background: C.card, borderRadius: 12,
                      padding: "11px 44px 11px 14px", color: C.white,
                      fontFamily: "inherit", fontSize: 14, outline: "none",
                      boxSizing: "border-box",
                      border: `1px solid ${error && password.length < 8 ? C.red : "rgba(255,255,255,0.1)"}`,
                      transition: "border-color 0.2s" }}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: "absolute", right: 12, top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", cursor: "pointer", fontSize: 16, color: C.muted }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>

                {/* Strength bar */}
                {password && (
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
              </div>

              {/* Підтвердження */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: C.muted, marginBottom: 6 }}>{t("profile.confirmPassword")}</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={password2}
                  autoComplete="new-password"
                  placeholder={t("profile.passwordMinLength")}
                  onChange={e => setPassword2(e.target.value)}
                  style={{ width: "100%", background: C.card, borderRadius: 12,
                    padding: "11px 14px", color: C.white, fontFamily: "inherit",
                    fontSize: 14, outline: "none", boxSizing: "border-box",
                    border: `1px solid ${password2 && password !== password2 ? C.red : "rgba(255,255,255,0.1)"}`,
                    transition: "border-color 0.2s" }}
                />
                {password2 && password !== password2 && (
                   <p style={{ fontSize: 11, color: C.red, marginTop: 4 }}>
                     {t("profile.passwordsMismatch")}
                   </p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{ width: "100%",
                  background: loading ? "#1a3d2a" : C.green,
                  color: loading ? "#2a6a44" : C.black,
                  border: "none", borderRadius: 12,
                  padding: "13px 20px", fontFamily: "Syne,sans-serif",
                  fontWeight: 700, fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8 }}>
                 {loading
                   ? <span style={{ width: 18, height: 18,
                       border: "2px solid #2a6a44", borderTopColor: C.green,
                       borderRadius: "50%", animation: "spin 0.7s linear infinite",
                       display: "inline-block" }}/>
                   : t("auth.saveNewPassword")}
              </button>

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          )}
        </div>

        {/* Посилання назад */}
        {!done && (
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: C.muted }}>
            <Link to="/app/login" style={{ color: C.muted, textDecoration: "none" }}>
              ← {t("auth.backToLogin")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
