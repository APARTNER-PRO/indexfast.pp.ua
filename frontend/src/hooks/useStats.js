// src/hooks/useStats.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client.js";

// ── Query keys — централізовано щоб легко інвалідувати
export const KEYS = {
  stats:  ["stats"],
  sites:  ["sites"],
  logs:   (params) => ["logs", params],
  job:    (id)     => ["job",  id],
};

// ── Головні дані дашборду
//    staleTime: 30s — не рефетчимо якщо дані свіжі
//    refetchOnWindowFocus: true — оновлюємо коли юзер повертається на вкладку
export function useStats() {
  return useQuery({
    queryKey:           KEYS.stats,
    queryFn:            () => apiClient.stats(),
    staleTime:          30_000,
    refetchInterval:    60_000,   // фоновий рефреш кожну хвилину
    refetchOnWindowFocus: true,
    retry:              2,
    retryDelay:         (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
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
