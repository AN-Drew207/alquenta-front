"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/lib/api/auth";
import { CURRENT_USER_QUERY_KEY } from "@/lib/api/query-keys";

export { CURRENT_USER_QUERY_KEY } from "@/lib/api/query-keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
