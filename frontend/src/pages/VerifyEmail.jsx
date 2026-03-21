// src/pages/VerifyEmail.jsx  ← lazy chunk
import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { apiClient } from "../api/client.js";
import { C }         from "../constants.js";

export default function VerifyEmail() {
  const [searchParams]    = useSearchParams();
  const navigate          = useNavigate();
  const token             = searchParams.get("token") || "";

  const [state, setState] = useState("loading"); // loading | success | error | no_token
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) { setState("no_token"); return; }

    // Відправляємо токен на сервер
    apiClient.verifyEmail({ token })
      .then(() => {
        setState("success");
        // Через 3с — редірект на dashboard
        setTimeout(() => navigate("/app/dashboard?verified=1", { replace: true }), 3000);
      })
      .catch(e => {
        setState("error");
        setError(e.message || "Посилання недійсне або прострочене.");
      });
  }, [token]);

  async function handleResend() {
    setResending(true);
    try {
      await apiClient.resendVerify();
      setResent(true);
    } catch {
      // тихо ігноруємо
    } finally {
      setResending(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.black,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

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
          borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>

          {/* ── Завантаження */}
          {state === "loading" && (
            <>
              <div style={{ marginBottom: 20 }}>
                <span style={{ display: "inline-block", width: 40, height: 40,
                  border: `3px solid rgba(0,255,136,0.2)`, borderTopColor: C.green,
                  borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
                fontSize: 20, marginBottom: 8 }}>Підтверджуємо email...</h2>
              <p style={{ color: C.muted, fontSize: 14 }}>Зачекайте кілька секунд</p>
            </>
          )}

          {/* ── Успіх */}
          {state === "success" && (
            <>
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
                fontSize: 22, marginBottom: 12, color: C.green }}>
                Email підтверджено!
              </h2>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                Ваш email успішно підтверджено.<br/>
                Зараз переходимо до кабінету...
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{ width: 8, height: 8, borderRadius: "50%",
                    background: C.green, opacity: 0.4 + i * 0.3,
                    animation: `pulse ${0.6 + i * 0.2}s ease-in-out infinite alternate` }}/>
                ))}
              </div>
              <style>{`@keyframes pulse { to { opacity: 1; } }`}</style>
            </>
          )}

          {/* ── Помилка */}
          {state === "error" && (
            <>
              <div style={{ fontSize: 52, marginBottom: 16 }}>❌</div>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
                fontSize: 20, marginBottom: 12 }}>Не вдалось підтвердити</h2>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 24,
                lineHeight: 1.6 }}>{error}</p>

              {!resent ? (
                <button onClick={handleResend} disabled={resending}
                  style={{ width: "100%", background: C.green, color: C.black,
                    border: "none", borderRadius: 12, padding: "13px 20px",
                    fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 14,
                    cursor: resending ? "not-allowed" : "pointer", marginBottom: 12,
                    opacity: resending ? 0.7 : 1 }}>
                  {resending ? "Надсилаємо..." : "Надіслати лист повторно"}
                </button>
              ) : (
                <div style={{ background: "rgba(0,255,136,0.08)",
                  border: "1px solid rgba(0,255,136,0.2)", borderRadius: 12,
                  padding: "12px 16px", marginBottom: 12,
                  fontSize: 14, color: C.green }}>
                  ✓ Лист надіслано! Перевірте пошту.
                </div>
              )}

              <Link to="/app/login"
                style={{ display: "block", color: C.muted, fontSize: 13,
                  textDecoration: "none", marginTop: 8 }}>
                ← Повернутись до входу
              </Link>
            </>
          )}

          {/* ── Немає токена */}
          {state === "no_token" && (
            <>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🔗</div>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800,
                fontSize: 20, marginBottom: 12 }}>Недійсне посилання</h2>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                Посилання для підтвердження некоректне.<br/>
                Перевірте лист або запросіть нове посилання.
              </p>
              <Link to="/app/login"
                style={{ display: "inline-block", background: C.green, color: C.black,
                  borderRadius: 12, padding: "12px 28px",
                  fontFamily: "Syne,sans-serif", fontWeight: 700,
                  fontSize: 14, textDecoration: "none" }}>
                До входу
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
