// src/components/LanguageSwitcher.jsx
import { useState, useRef, useEffect } from "react";
import i18n from "../i18n/index.js";
import { apiClient } from "../api/client.js";

const LANGS = [
  { code: "uk", label: "UA" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
  { code: "ru", label: "RU" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "pl", label: "PL" },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = i18n.language || localStorage.getItem("lang") || "uk";
  const activeLang = LANGS.find(l => current.startsWith(l.code)) || LANGS[0];

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const switchTo = async (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    try {
      await apiClient.updateProfile({ lang: code }).catch(() => {});
    } catch { /* noop */ }
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        title={activeLang.label}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 10px", borderRadius: 10, border: "none", cursor: "pointer",
          fontSize: 12, fontWeight: 700, fontFamily: "inherit",
          background: "rgba(255,255,255,0.04)",
          color: "#f0f0f8",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
      >
        <span>{activeLang.label}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" style={{ marginLeft: 2, opacity: 0.6 }}>
          <path d="M0 0 L5 6 L10 0" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          background: "#131320", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, padding: 4, minWidth: 120,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          {LANGS.map(lang => {
            const active = current.startsWith(lang.code);
            return (
              <button
                key={lang.code}
                onClick={() => switchTo(lang.code)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                  background: active ? "rgba(0,255,136,0.12)" : "transparent",
                  color: active ? "#00ff88" : "#8a8aa0",
                  transition: "all 0.12s", textAlign: "left", width: "100%",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span>{lang.label}</span>
                {active && <span style={{ marginLeft: "auto", fontSize: 11 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
