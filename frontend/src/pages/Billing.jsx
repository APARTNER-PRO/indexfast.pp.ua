// src/pages/Billing.jsx  ← окремий chunk (lazy)
import { memo } from "react";
import React from "react";
import { Btn }  from "../components/ui/index.jsx";
import { C }    from "../constants.js";

const PLANS = [
  {
    id:       "start",
    name:     "Старт",
    price:    "₴0",
    desc:     "Безкоштовно назавжди",
    features: [
      "20 URL/день",
      "1 сайт",
      "Sitemap Index підтримка",
      "Базова підтримка",
      "Стандартна швидкість обробки",
    ],
  },
  {
    id:       "pro",
    name:     "PRO",
    price:    "₴999",
    desc:     "/місяць",
    popular:  true,
    paddlePrices: [
      {
        id:       "pri_01kpy78kbrnk3pzxc9grpe2ye3",
        label:    "PRO",
        amount:   99900,
        currency: "UAH",
        interval: "month",
      },
    ],
    features: [
      "500 URL/день",
      "До 5 сайтів",
      "Sitemap Index підтримка",
      "Швидша індексація та обробка",
      "Web інтерфейс",
      "Розклад індексації",
      "Лог індексації",
    ],
  },
  {
    id:       "agency",
    name:     "Агенція",
    price:    "₴3 999",
    desc:     "/місяць",
    paddlePrices: [
      {
        id:       "pri_01kpy7am19g27zn99w8k74qdxq",
        label:    "Agency",
        amount:   399900,
        currency: "UAH",
        interval: "month",
      },
    ],
    features: [
      "5 000 URL/день",
      "До 25 сайтів",
      "Sitemap Index підтримка",
      "Web + Webhooks",
      "White-label звіти",
      "Авто-запуск за розкладом",
      "Повний API доступ",
      "Пріоритетна підтримка 24/7",
    ],
  },
  {
    id:          "enterprise",
    name:        "Enterprise",
    price:       "Індивідуально",
    desc:        "під ваші потреби",
    enterprise:  true,
    features:    [
      "Необмежено URL/день",
      "Необмежено сайтів",
      "Кілька Service Account",
      "Виділений воркер",
      "Інтеграція під ключ",
      "SLA та гарантії uptime",
      "Персональний менеджер",
      "Кастомні звіти",
    ],
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

// ── Paddle client-side token (замінити на свій з Paddle Dashboard)
const PADDLE_TOKEN = "live_0a4f99caf91b0e11e5ba3044e7a";

// ── Paddle SDK ініціалізація (лазі — тільки при першому кліку)
let paddleLoaded = false;
function loadPaddle() {
  return new Promise((resolve) => {
    if (paddleLoaded) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    s.onload = () => {
      window.Paddle.Initialize({ token: PADDLE_TOKEN });
      paddleLoaded = true;
      resolve();
    };
    document.head.appendChild(s);
  });
}

// ── Компонент вибору тарифу через Paddle
function PaddlePlanSelector({ prices, planName, popular }) {
  const [step,      setStep]     = React.useState("idle");
  const [priceList, setPriceList] = React.useState(prices); // ціни з пропсів
  const [selected,  setSelected] = React.useState(prices[0]?.id ?? null);
  const [errMsg,    setErrMsg]   = React.useState("");

  const btnStyle = (active) => ({
    width: "100%", border: "none", borderRadius: 12,
    padding: "12px 20px", cursor: "pointer",
    fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 14,
    transition: "all 0.2s",
    background: popular ? "#00ff88" : "transparent",
    color:      popular ? "#050508" : "#00ff88",
    outline:    popular ? "none" : "2px solid rgba(0,255,136,0.4)",
    opacity:    active ? 1 : 0.7,
  });

  // Крок 1: показуємо список цін (вони вже відомі з пропсів)
  function handleOpen() {
    if (prices.length === 1) {
      handleBuyDirect(prices[0].id);
    } else {
      setStep("select");
    }
  }

  async function handleBuyDirect(priceId) {
    setStep("paying");
    try {
      await loadPaddle();
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: { displayMode: "overlay", theme: "dark", locale: "uk" },
      });
      setStep("idle");
    } catch (e) {
      setErrMsg("Помилка відкриття оплати");
      setStep("error");
    }
  }

  // Крок 2: відкриваємо Paddle Checkout
  async function handleBuy() {
    if (!selected) return;
    handleBuyDirect(selected);
  }

  // Форматуємо ціну
  function formatPrice(p) {
    const num = p.amount / 100;
    const sym = { USD: "$", EUR: "€", UAH: "₴", GBP: "£" }[p.currency] ?? p.currency + " ";
    const per = p.interval === "year" ? "рік" : "місяць";
    return `${sym}${num.toLocaleString("uk-UA")} / ${per}`;
  }

  // idle
  if (step === "idle") {
    return (
      <button onClick={handleOpen} style={btnStyle(true)}>
        Придбати {planName} →
      </button>
    );
  }

  // error
  if (step === "error") {
    return (
      <div>
        <p style={{ fontSize: 12, color: "#ff4d6d", marginBottom: 8, textAlign: "center" }}>
          {errMsg}
        </p>
        <button onClick={handleOpen} style={btnStyle(true)}>
          Спробувати ще раз
        </button>
      </div>
    );
  }

  // select — вибір тарифу
  if (step === "select" || step === "paying") {
    return (
      <div>
        {/* Список цін */}
        <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {priceList.map(p => (
            <label key={p.id}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                border: `1px solid ${selected === p.id ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.08)"}`,
                background: selected === p.id ? "rgba(0,255,136,0.06)" : "rgba(255,255,255,0.02)",
                transition: "all 0.15s",
              }}>
              <input type="radio" name={`paddle-${p.id}`}
                value={p.id} checked={selected === p.id}
                onChange={() => setSelected(p.id)}
                style={{ accentColor: "#00ff88" }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f0f8" }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 11, color: "#7a7a95", marginTop: 1 }}>
                  {formatPrice(p)}
                </div>
              </div>
              {p.interval === "year" && (
                <span style={{ fontSize: 10, background: "rgba(0,255,136,0.1)",
                  color: "#00ff88", padding: "2px 7px", borderRadius: 100,
                  fontWeight: 700, letterSpacing: "0.05em" }}>
                  ЗНИЖКА
                </span>
              )}
            </label>
          ))}
        </div>

        {/* Кнопки */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setStep("idle")}
            style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "10px", cursor: "pointer", color: "#7a7a95",
              fontSize: 13, fontFamily: "Syne,sans-serif" }}>
            Назад
          </button>
          <button onClick={handleBuy} disabled={!selected || step === "paying"}
            style={{ ...btnStyle(true), flex: 2, padding: "10px",
              opacity: step === "paying" ? 0.7 : 1,
              cursor: step === "paying" ? "wait" : "pointer" }}>
            {step === "paying" ? "Відкриваємо оплату..." : "Оплатити →"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const PlanCard = memo(function PlanCard({ plan: p, isCurrent }) {
  const isEnterprise = p.enterprise;
  const purple = "#9370db";
  return (
    <div style={{
      background: p.popular ? "rgba(0,255,136,0.05)" : isEnterprise ? "rgba(147,112,219,0.04)" : C.card,
      border: `1px solid ${p.popular ? "rgba(0,255,136,0.2)" : isEnterprise ? "rgba(147,112,219,0.3)" : C.border}`,
      borderRadius: 20, padding: 24, position: "relative" }}>

      {p.popular && (
        <div style={{ fontSize: 10, fontWeight: 800, color: C.green,
          letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          ✦ ПОПУЛЯРНИЙ
        </div>
      )}
      {isEnterprise && (
        <div style={{ fontSize: 10, fontWeight: 800, color: purple,
          letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          ◈ CUSTOM
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
        <span style={{ fontFamily: "Syne,sans-serif",
          fontSize: isEnterprise ? 20 : 28, fontWeight: 800,
          color: isEnterprise ? purple : C.white }}>{p.price}</span>
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
        <div style={{ textAlign: "center", fontSize: 13, color: isEnterprise ? purple : C.green,
          fontWeight: 700, padding: 11, borderRadius: 12,
          background: isEnterprise ? "rgba(147,112,219,0.08)" : "rgba(0,255,136,0.06)" }}>
          Поточний план
        </div>
      ) : isEnterprise ? (
        <button onClick={() => window.open("https://t.me/indexfastgoogle?text=Хочу%20дізнатись%20про%20Enterprise%20план", "_blank")}
          style={{ width: "100%", background: "rgba(147,112,219,0.1)",
            border: "2px solid rgba(147,112,219,0.4)", borderRadius: 12,
            padding: "12px 20px", color: purple, fontFamily: "Syne,sans-serif",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            transition: "all 0.2s" }}>
          Зв'язатись →
        </button>
      ) : (
        <>
          {/* Стара кнопка через Telegram — закоментована, залишена для відновлення
          <Btn variant={p.popular ? "primary" : "outline"} style={{ width: "100%" }}
            onClick={() => window.open("https://t.me/indexfastgoogle", "_blank")}>
            {p.id === "start" ? "Downgrade" : "Перейти на " + p.name}
          </Btn>
          */}

          {/* Нова кнопка через Paddle */}
          {p.paddlePrices?.length ? (
            <PaddlePlanSelector prices={p.paddlePrices} planName={p.name} popular={p.popular}/>
          ) : p.id === "start" ? (
            <div style={{ textAlign: "center", fontSize: 13, color: C.muted,
              padding: 11, borderRadius: 12, background: "rgba(255,255,255,0.03)" }}>
              Безкоштовний план
            </div>
          ) : (
            <Btn variant="outline" style={{ width: "100%" }}
              onClick={() => window.open("https://t.me/indexfastgoogle", "_blank")}>
              {"Перейти на " + p.name}
            </Btn>
          )}
        </>
      )}
    </div>
  );
});
