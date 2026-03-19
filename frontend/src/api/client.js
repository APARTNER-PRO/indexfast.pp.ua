// src/api/client.js
const BASE = import.meta?.env?.VITE_API_URL ?? "/api";

function getToken() {
  return localStorage.getItem("access_token");
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch(path, opts = {}) {
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

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/auth.html";
    return;
  }

  if (!res.ok) {
    throw new ApiError(data.message || `HTTP ${res.status}`, res.status);
  }

  return data;
}

// ── Ендпоінти
export const apiClient = {
  stats:      ()     => apiFetch("/dashboard/stats.php"),
  sites:      ()     => apiFetch("/sites/index.php"),
  addSite:    (body) => apiFetch("/sites/index.php",  { method: "POST",   body }),
  deleteSite: (id)   => apiFetch("/sites/delete.php", { method: "DELETE", body: { site_id: id } }),
  runIndex:   (body) => apiFetch("/indexing/run.php",  { method: "POST",   body }),
  jobStatus:  (id)   => apiFetch(`/indexing/status.php?job_id=${id}`),
  toggleSite: (siteId) => apiFetch("/sites/toggle.php", { method: "PATCH", body: { site_id: siteId } }),
  logs:       (params = {}) =>
    apiFetch("/indexing/logs.php?" + new URLSearchParams(params)),
};
