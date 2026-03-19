// src/pages/Billing.jsx  ← окремий chunk (lazy)
import { memo } from "react";
import { Btn }  from "../components/ui/index.jsx";
import { C }    from "../constants.js";

const PLANS = [
  {
    id:       "start",
    name:     "Старт",
    price:    "₴0",
    desc:     "Безкоштовно назавжди",
    features: ["20 URL/день", "1 сайт", "Базова підтримка", "Лог індексації 30 днів"],
  },
  {
    id:       "pro",
    name:     "PRO",
    price:    "₴999",
    desc:     "/місяць",
    popular:  true,
    features: ["100 URL/день", "До 10 сайтів", "Пріоритетна підтримка", "Розклад індексації", "Лог 90 днів"],
  },
  {
    id:       "agency",
    name:     "Агенція",
    price:    "₴3 999",
    desc:     "/місяць",
    features: ["Необмежено URL/день", "Необмежено сайтів", "Виділена підтримка", "API доступ", "Лог необмежено"],
  },
];

export default memo(function Billing({ currentPlan }) {
  return (
    <div>
      <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>
        Підписка
      </h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
        Поточний план: <strong style={{ color: C.white }}>{currentPlan}</strong>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {PLANS.map(p => (
          <PlanCard key={p.id} plan={p} isCurrent={currentPlan === p.id}/>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: 24, background: C.card,
        border: `1px solid ${C.border}`, borderRadius: 16 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, marginBottom: 8 }}>
          Як оновити план?
        </div>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
          Написати в Telegram{" "}
          <a href="https://t.me/indexfastgoogle" target="_blank" rel="noreferrer"
            style={{ color: C.green }}>@indexfastgoogle</a>{" "}
          з вашим email. Оновлення активується протягом 10 хвилин після оплати.
        </p>
      </div>
    </div>
  );
});

const PlanCard = memo(function PlanCard({ plan: p, isCurrent }) {
  return (
    <div style={{ background: p.popular ? "rgba(0,255,136,0.05)" : C.card,
      border: `1px solid ${p.popular ? "rgba(0,255,136,0.2)" : C.border}`,
      borderRadius: 20, padding: 24, position: "relative" }}>

      {p.popular && (
        <div style={{ fontSize: 10, fontWeight: 800, color: C.green,
          letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          ✦ ПОПУЛЯРНИЙ
        </div>
      )}
      {isCurrent && (
        <div style={{ position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 800,
          background: "rgba(0,255,136,0.1)", color: C.green,
          padding: "3px 9px", borderRadius: 100, border: "1px solid rgba(0,255,136,0.2)" }}>
          ✓ Активний
        </div>
      )}

      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>
        {p.name}
      </div>
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontFamily: "Syne,sans-serif", fontSize: 28, fontWeight: 800 }}>{p.price}</span>
        <span style={{ color: C.muted, fontSize: 13, marginLeft: 4 }}>{p.desc}</span>
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginBottom: 24 }}>
        {p.features.map(f => (
          <li key={f} style={{ fontSize: 13, color: C.muted, padding: "6px 0",
            borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: C.green }}>✓</span>{f}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <div style={{ textAlign: "center", fontSize: 13, color: C.green, fontWeight: 700,
          padding: 11, borderRadius: 12, background: "rgba(0,255,136,0.06)" }}>
          Поточний план
        </div>
      ) : (
        <Btn variant={p.popular ? "primary" : "outline"} style={{ width: "100%" }}
          onClick={() => window.open("https://t.me/indexfastgoogle", "_blank")}>
          {p.id === "start" ? "Downgrade" : "Перейти на " + p.name}
        </Btn>
      )}
    </div>
  );
});
