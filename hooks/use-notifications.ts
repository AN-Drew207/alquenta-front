"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyNotifications } from "@/lib/api/notifications";

export function useMyNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchMyNotifications,
  });
}
