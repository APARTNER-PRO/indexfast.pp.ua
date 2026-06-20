// src/hooks/useStats.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client.js";

// ── Query keys — централізовано щоб легко інвалідувати
export const KEYS = {
  stats:  ["stats"],
  sites:  ["sites"],
  logs:   (params) => ["logs", params],
  job:    (id)     => ["job",  id],
  gsc:    ["gsc-sites"],
  gscMetrics: (siteIds, days) => ["gsc-metrics", siteIds, days],
  gscChart:   (siteIds, days) => ["gsc-chart",   siteIds, days],
};

// ── Головні дані дашборду
//    staleTime: 30s — не рефетчимо якщо дані свіжі
//    refetchOnWindowFocus: true — оновлюємо коли юзер повертається на вкладку
export function useStats() {
  return useQuery({
    queryKey:           KEYS.stats,
    queryFn:            () => apiClient.stats(),
    staleTime:          30_000,
    refetchInterval:    (query) => {
      const data = query?.state?.data;
      const error = query?.state?.error;
      // Якщо з'єднання тільки встановлюється (немає даних) або була помилка, опитуємо частіше (кожні 10 секунд)
      if (!data || error || !data.user) {
        return 10_000;
      }
      // Коли дані успішно отримано, опитуємо значно рідше (кожні 5 хвилин)
      return 300_000;
    },
    refetchOnWindowFocus: true,
    retry:              2,
    retryDelay:         (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
  });
}

// ── Отримання сайтів з Google Search Console
export function useGscSites(enabled = false) {
  return useQuery({
    queryKey: KEYS.gsc,
    queryFn:  () => apiClient.gscSites(),
    enabled:  enabled,
    staleTime: 60_000,
    retry: false, // не ретраїмо якщо 403
  });
}

export function useGscMetrics(siteIds = [], days = 28, enabled = true) {
  return useQuery({
    queryKey: KEYS.gscMetrics(siteIds, days),
    queryFn:  () => apiClient.gscMetrics(siteIds, days),
    enabled:  enabled && siteIds.length > 0,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    retry: false,
  });
}

export function useGscChart(siteIds = [], days = 30, enabled = true) {
  return useQuery({
    queryKey: ["gsc-chart", siteIds, days],
    queryFn:  () => apiClient.gscChart(siteIds, days),
    enabled:  enabled && siteIds.length > 0,
    staleTime: 10 * 60_000,
    retry: false,
  });
}

export function useGscQueries(siteIds = [], days = 30, limit = 100, enabled = true) {
  return useQuery({
    queryKey: ["gsc-queries", siteIds, days, limit],
    queryFn:  () => apiClient.gscQueries(siteIds, days, limit),
    enabled:  enabled && siteIds.length > 0,
    staleTime: 10 * 60_000,
    retry: false,
  });
}

export function useGscPages(siteIds = [], days = 30, limit = 100, enabled = true) {
  return useQuery({
    queryKey: ["gsc-pages", siteIds, days, limit],
    queryFn:  () => apiClient.gscPages(siteIds, days, limit),
    enabled:  enabled && siteIds.length > 0,
    staleTime: 10 * 60_000,
    retry: false,
  });
}

// ── Мутація: додати сайт
export function useAddSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => apiClient.addSite(body),
    onSuccess: () => {
      // Інвалідуємо stats і sites — дані застаріли
      qc.invalidateQueries({ queryKey: KEYS.stats });
      qc.invalidateQueries({ queryKey: KEYS.sites });
    },
  });
}

// ── Мутація: видалити сайт
export function useDeleteSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (siteId) => apiClient.deleteSite(siteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.stats });
    },
  });
}

// ── Мутація: запустити індексацію
export function useRunIndex() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => apiClient.runIndex(body),
    onSuccess: () => {
      // Оновимо stats через 3с (воркер ще не встиг запустити)
      setTimeout(() => qc.invalidateQueries({ queryKey: KEYS.stats }), 3000);
    },
  });
}

// ── Мутація: пауза / активація сайту
export function useToggleSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (siteId) => apiClient.toggleSite(siteId),
    // Optimistic update — одразу міняємо статус в кеші без очікування сервера
    onMutate: async (siteId) => {
      await qc.cancelQueries({ queryKey: KEYS.stats });
      const prev = qc.getQueryData(KEYS.stats);
      qc.setQueryData(KEYS.stats, (old) => {
        if (!old) return old;
        return {
          ...old,
          sites: old.sites.map(s =>
            s.id === siteId
              ? { ...s, status: s.status === "active" ? "paused" : "active" }
              : s
          ),
        };
      });
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      // Rollback при помилці
      if (ctx?.prev) qc.setQueryData(KEYS.stats, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEYS.stats });
    },
  });
}
