"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchAnalyticsSummary,
  fetchPropertyAnalyticsSummary,
  recordPropertyView,
} from "@/lib/api/analytics";

/**
 * Fire-and-forget: records a property page view. Best-effort ping (rate
 * limited server-side) — errors are swallowed here, never surfaced to the
 * visitor (no toast), see components/properties/view-tracker.tsx.
 */
export function useRecordPropertyView() {
  return useMutation({
    mutationFn: (propertyId: string) => recordPropertyView(propertyId),
    onError: () => {
      // Intentionally silent — a failed view ping must never bother a visitor.
    },
  });
}

/**
 * A single property's analytics (owner-only). Not consumed anywhere in
 * Fase 1 — kept for the Fase 2 per-property drill-down page, which will
 * gate `enabled` on "logged-in ADMIN viewing their own property".
 */
export function usePropertyAnalyticsSummary(propertyId: string, enabled = true) {
  return useQuery({
    queryKey: ["analytics", "properties", propertyId, "summary"],
    queryFn: () => fetchPropertyAnalyticsSummary(propertyId),
    enabled: Boolean(propertyId) && enabled,
  });
}

/** Portfolio-wide summary across all of the admin's properties. */
export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: fetchAnalyticsSummary,
  });
}
