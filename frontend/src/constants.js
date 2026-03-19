// src/constants.js
export const C = {
  black:   "#050508",
  dark:    "#0a0a10",
  card:    "#0f0f18",
  card2:   "#131320",
  border:  "rgba(255,255,255,0.06)",
  border2: "rgba(255,255,255,0.11)",
  green:   "#00ff88",
  green2:  "#00c96a",
  red:     "#ff4d6d",
  gold:    "#ffd060",
  blue:    "#4d9fff",
  white:   "#f0f0f8",
  muted:   "#6a6a85",
};

export const PLAN_COLORS = {
  start:  C.muted,
  pro:    C.green,
  agency: C.gold,
};

export const NAV_ITEMS = [
  { id: "overview", icon: "◈", label: "Огляд"     },
  { id: "sites",    icon: "⊞", label: "Мої сайти" },
  { id: "logs",     icon: "≡", label: "Логи"       },
  { id: "billing",  icon: "◇", label: "Підписка"  },
];
