// src/components/LanguageSwitcher.jsx
import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "uk",  label: "UA", flag: "🇺🇦" },
  { code: "en",  label: "EN", flag: "🇬🇧" },
  { code: "es",  label: "ES", flag: "🇪🇸" },
  { code: "pt",  label: "PT", flag: "🇵🇹" },
  { code: "ru",  label: "RU", flag: "🇷🇺" },
  { code: "de",  label: "DE", flag: "🇩🇪" },
  { code: "fr",  label: "FR", flag: "🇫🇷" },
  { code: "pl",  label: "PL", flag: "🇵🇱" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const switchTo = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
  };

  return (
    <div style={{
      display: "flex", gap: 4, alignItems: "center",
      background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 3,
    }}>
      {LANGS.map(lang => {
        const active = i18n.language === lang.code || (i18n.resolvedLanguage && i18n.resolvedLanguage.startsWith(lang.code));
        return (
          <button
            key={lang.code}
            onClick={() => switchTo(lang.code)}
            title={lang.label}
            style={{
              padding: "5px 8px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700, fontFamily: "inherit",
              background: active ? "rgba(0,255,136,0.15)" : "transparent",
              color: active ? "#00ff88" : "#6a6a85",
              transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 4,
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 14 }}>{lang.flag}</span>
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
