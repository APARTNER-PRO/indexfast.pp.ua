// src/hooks/useLogs.js
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client.js";
import { KEYS } from "./useStats.js";

export function useLogs({ siteId, status, dateFrom, dateTo, limit = 50, offset = 0 } = {}) {
  const params = {};
  if (siteId)   params.site_id   = siteId;
  if (status)   params.status    = status;
  if (dateFrom) params.date_from = dateFrom;
  if (dateTo)   params.date_to   = dateTo;
  params.limit  = limit;
  params.offset = offset;

  return useQuery({
    queryKey:        KEYS.logs(params),
    queryFn:         () => apiClient.logs(params),
    staleTime:       15_000,
    placeholderData: (prev) => prev,
    refetchInterval: 30_000,
  });
}
