// src/hooks/useJobPoller.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef }        from "react";
import { apiClient }                from "../api/client.js";
import { KEYS }                     from "./useStats.js";

const TERMINAL = new Set(["done", "failed", "cancelled"]);

// ── Polling статусу job через react-query
//    refetchInterval вимикається автоматично коли job завершено
export function useJobPoller(jobId, { onFinished } = {}) {
  const qc           = useQueryClient();
  const prevStatus   = useRef(null);

  const query = useQuery({
    queryKey:        KEYS.job(jobId),
    queryFn:         () => apiClient.jobStatus(jobId).then(r => r.data?.job),
    enabled:         !!jobId,
    staleTime:       0,                // завжди вважати застарілим
    refetchInterval: (data) => {
      // Зупиняємо polling коли job завершено
      if (!data || TERMINAL.has(data.status)) return false;
      // Частіше на початку, рідше якщо довго висить
      return data.status === "processing" ? 2_000 : 5_000;
    },
    refetchIntervalInBackground: false, // не поллити коли вкладка не активна
    retry: 3,
  });

  // Викликаємо onFinished один раз при переході в термінальний стан
  useEffect(() => {
    const job = query.data;
    if (!job) return;
    if (TERMINAL.has(job.status) && !TERMINAL.has(prevStatus.current)) {
      onFinished?.(job);
      // Інвалідуємо stats щоб оновились лічильники
      qc.invalidateQueries({ queryKey: KEYS.stats });
    }
    prevStatus.current = job.status;
  }, [query.data?.status]);

  return {
    job:       query.data ?? null,
    isPolling: !!jobId && !TERMINAL.has(query.data?.status),
    isLoading: query.isLoading,
  };
}
