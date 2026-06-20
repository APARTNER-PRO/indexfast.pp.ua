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
// ── Таймаути для різних типів запитів (мс)
const TIMEOUTS = {
  default:  20_000,  // 20с — стандартні запити
  slow:     45_000,  // 45с — run indexing (парсинг sitemap + запис в БД)
  fast:     10_000,  // 10с — refresh token (критичний)
};

// ── Створює fetch з AbortController таймаутом
function fetchWithTimeout(url, opts = {}, timeoutMs = TIMEOUTS.default) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), timeoutMs);

  return fetch(url, { ...opts, signal: ctrl.signal })
    .finally(() => clearTimeout(tid));
}

async function refreshAccessToken() {
  const refreshToken = getRefresh();
  if (!refreshToken) return null;

  try {
    const res = await fetchWithTimeout(
      `${BASE}/auth/refresh.php`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ refresh_token: refreshToken }),
      },
      TIMEOUTS.fast
    );
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
  // Зберігаємо повідомлення в sessionStorage (не в URL — щоб не показувалось при прямому переході)
  if (reason) sessionStorage.setItem("auth_msg", reason);
  // Зберігаємо поточний URL щоб повернутись після логіну
  const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.href = `/app/login?redirect=${returnTo}`;
}

// ── Головна функція запиту
export async function apiFetch(path, opts = {}, _isRetry = false) {
  const token = getToken();

  // Повільні ендпоінти отримують більший таймаут
  const isSlow = path.includes("/indexing/run") || path.includes("/gsc/");
  const timeout = opts._timeout ?? (isSlow ? TIMEOUTS.slow : TIMEOUTS.default);

    const method = (opts.method ?? "GET").toUpperCase();
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers ?? {}),
    };
    if (opts.body !== undefined || ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      headers["Content-Type"] = "application/json";
    }

    let res;
    try {
      res = await fetchWithTimeout(`${BASE}${path}`, {
        ...opts,
        method,
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      }, timeout);
    } catch (e) {
    // AbortError — таймаут
    if (e.name === "AbortError") {
      throw new ApiError("Сервер не відповідає. Перевірте з'єднання.", 0);
    }
    // Мережева помилка
    throw new ApiError("Помилка мережі. Перевірте з'єднання.", 0);
  }

  // ── 415: спробуємо повторити запит без заголовка Content-Type один раз
  if (res.status === 415 && !_isRetry) {
    const newOpts = { ...opts };
    if (newOpts.headers) {
      const cleanHeaders = { ...newOpts.headers };
      delete cleanHeaders['Content-Type'];
      delete cleanHeaders['content-type'];
      newOpts.headers = cleanHeaders;
    }
    return apiFetch(path, newOpts, true);
  }

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
  // GSC Import
  gscRedirect: ()     => {
    const token = getToken();
    window.location.href = (import.meta?.env?.VITE_API_URL ?? "/api") + "/gsc/redirect.php?token=" + token;
  },
  gscSites:    ()     => apiFetch("/gsc/sites.php"),
  gscSitemaps: (url)   => apiFetch(`/gsc/sitemaps.php?url=${encodeURIComponent(url)}`),
  gscChart:    (siteIds, days = 30) => apiFetch(
    `/gsc/chart.php?site_ids=${encodeURIComponent(siteIds.join(','))}&days=${days}`,
    { _timeout: 300_000 }
  ),
  gscMetrics:  (siteIds, days = 28) => apiFetch(
    `/gsc/metrics.php?site_ids=${encodeURIComponent(siteIds.join(','))}&days=${days}`,
    { _timeout: 60_000 }
  ),
  // Dashboard
  stats:      ()     => apiFetch("/dashboard/stats.php"),
  // Sites
  sites:      ()     => apiFetch("/sites/index.php"),
  addSite:    (body) => apiFetch("/sites/index.php",   { method: "POST",   body }),
  deleteSite:  (id)   => apiFetch("/sites/delete.php",  { method: "DELETE", body: { site_id: id } }),
  updateSite:  (body) => apiFetch("/sites/update.php",  { method: "PATCH",  body }),
  toggleSite: (id)   => apiFetch("/sites/toggle.php",  { method: "PATCH",  body: { site_id: id } }),
  // Indexing
  runIndex:   (body) => apiFetch("/indexing/run.php",   { method: "POST", body }),
  jobStatus:  (id)   => apiFetch(`/indexing/status.php?job_id=${id}`),
  logs:       (p={}) => apiFetch("/indexing/logs.php?" + new URLSearchParams(p)),
};
