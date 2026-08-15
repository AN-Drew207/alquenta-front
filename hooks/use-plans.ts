"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/lib/api/plans";

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });
}
