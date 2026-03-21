// src/api/client.js
const BASE = import.meta?.env?.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// ── Стан оновлення токена
// Один Promise для всіх паралельних запитів — не робимо кілька refresh одночасно
let _refreshPromise = null;

function getToken()    { return localStorage.getItem("access_token");  }
function getRefresh()  { return localStorage.getItem("refresh_token"); }

function saveTokens(access, refresh) {
  localStorage.setItem("access_token",  access);
  localStorage.setItem("refresh_token", refresh);
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// ── Оновлюємо access_token через refresh_token
// Повертає новий access_token або null якщо не вдалось
async function refreshAccessToken() {
  const refreshToken = getRefresh();
  if (!refreshToken) return null;

  try {
    const res  = await fetch(`${BASE}/auth/refresh.php`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;

    const data = await res.json().catch(() => null);
    if (!data?.access_token) return null;

    saveTokens(data.access_token, data.refresh_token ?? refreshToken);
    return data.access_token;
  } catch {
    return null;
  }
}

// ── Редіректимо на login з повідомленням
function redirectToLogin(reason = "") {
  clearTokens();
  // Зберігаємо поточний URL щоб повернутись після логіну
  const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
  const msg      = reason ? `&msg=${encodeURIComponent(reason)}` : "";
  window.location.href = `/app/login?redirect=${returnTo}${msg}`;
}

// ── Головна функція запиту
export async function apiFetch(path, opts = {}, _isRetry = false) {
  const token = getToken();

  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers ?? {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  // ── 401: спробуємо оновити токен один раз
  if (res.status === 401 && !_isRetry) {
    // Якщо вже є активний refresh — чекаємо його замість нового запиту
    if (!_refreshPromise) {
      _refreshPromise = refreshAccessToken().finally(() => {
        _refreshPromise = null;
      });
    }

    const newToken = await _refreshPromise;

    if (newToken) {
      // Токен оновлено — повторюємо оригінальний запит
      return apiFetch(path, opts, true);
    } else {
      // Refresh теж не вдався — logout
      redirectToLogin("Сесія закінчилась. Увійдіть знову.");
      return;
    }
  }

  // ── 401 після retry — остаточний logout
  if (res.status === 401 && _isRetry) {
    redirectToLogin("Сесія закінчилась. Увійдіть знову.");
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || `HTTP ${res.status}`, res.status);
  }

  return data;
}

// ── Ендпоінти
export const apiClient = {
  // Auth
  login:      (body) => apiFetch("/auth/login.php",    { method: "POST", body }),
  register:   (body) => apiFetch("/auth/register.php", { method: "POST", body }),
  forgot:       (body) => apiFetch("/auth/forgot.php",        { method: "POST", body }),
  verifyEmail:  (body) => apiFetch("/auth/verify-email.php", { method: "POST", body }),
  resendVerify:  ()     => apiFetch("/auth/resend-verify.php",  { method: "POST" }),
  updateProfile: (body) => apiFetch("/user/profile.php",       { method: "PATCH", body }),
  reset:      (body) => apiFetch("/auth/reset.php",    { method: "POST", body }),
  refresh:    ()     => apiFetch("/auth/refresh.php",  { method: "POST",
                          body: { refresh_token: getRefresh() } }),
  logout:     ()     => {
    const rt = getRefresh();
    // fire-and-forget — не чекаємо відповіді
    fetch(`${BASE}/auth/logout.php`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ refresh_token: rt }),
    }).catch(() => {});
  },
  // Dashboard
  stats:      ()     => apiFetch("/dashboard/stats.php"),
  // Sites
  sites:      ()     => apiFetch("/sites/index.php"),
  addSite:    (body) => apiFetch("/sites/index.php",   { method: "POST",   body }),
  deleteSite: (id)   => apiFetch("/sites/delete.php",  { method: "DELETE", body: { site_id: id } }),
  toggleSite: (id)   => apiFetch("/sites/toggle.php",  { method: "PATCH",  body: { site_id: id } }),
  // Indexing
  runIndex:   (body) => apiFetch("/indexing/run.php",   { method: "POST", body }),
  jobStatus:  (id)   => apiFetch(`/indexing/status.php?job_id=${id}`),
  logs:       (p={}) => apiFetch("/indexing/logs.php?" + new URLSearchParams(p)),
};
