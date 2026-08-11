"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyNotifications } from "@/lib/api/notifications";

export function useMyNotifications(enabled = true) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchMyNotifications,
    enabled,
  });
}
