// src/hooks/useLogs.js
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client.js";
import { KEYS } from "./useStats.js";

// ── Логи з пагінацією, фільтром по статусу і сайту
//    keepPreviousData: true — не мигає під час переходу між сторінками
export function useLogs({ siteId, status, limit = 50, offset = 0 } = {}) {
  const params = {};
  if (siteId) params.site_id = siteId;
  if (status) params.status  = status;
  params.limit  = limit;
  params.offset = offset;

  return useQuery({
    queryKey:          KEYS.logs(params),
    queryFn:           () => apiClient.logs(params).then(r => r.data),
    staleTime:         15_000,
    placeholderData:   (prev) => prev,   // keepPreviousData аналог в v5
    refetchInterval:   30_000,
  });
}
