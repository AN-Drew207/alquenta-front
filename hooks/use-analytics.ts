"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchAnalyticsRanking,
  fetchAnalyticsSummary,
  fetchPropertyAnalyticsBenchmark,
  fetchPropertyAnalyticsDeviceBreakdown,
  fetchPropertyAnalyticsSummary,
  fetchPropertyAnalyticsTrend,
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

/**
 * A single property's daily view/contact trend (owner-only, PROFESSIONAL+).
 * `enabled` lets callers gate the request on the admin's plan tier so a
 * STARTER admin never triggers the 403 in the first place.
 */
export function usePropertyAnalyticsTrend(propertyId: string, enabled = true) {
  return useQuery({
    queryKey: ["analytics", "properties", propertyId, "trend"],
    queryFn: () => fetchPropertyAnalyticsTrend(propertyId),
    enabled: Boolean(propertyId) && enabled,
  });
}

/**
 * Portfolio-wide ranking across all of the admin's properties
 * (PROFESSIONAL+). Already sorted by the backend — consume as-is.
 */
export function useAnalyticsRanking(enabled = true) {
  return useQuery({
    queryKey: ["analytics", "ranking"],
    queryFn: fetchAnalyticsRanking,
    enabled,
  });
}

/**
 * A single property's device breakdown (owner-only, PROFESSIONAL+). Same
 * `enabled` gating rationale as usePropertyAnalyticsTrend above.
 */
export function usePropertyAnalyticsDeviceBreakdown(
  propertyId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["analytics", "properties", propertyId, "device-breakdown"],
    queryFn: () => fetchPropertyAnalyticsDeviceBreakdown(propertyId),
    enabled: Boolean(propertyId) && enabled,
  });
}

/**
 * A single property's views/contacts benchmarked against comparable
 * listings (owner-only, BUSINESS+). Same `enabled` gating rationale as
 * usePropertyAnalyticsTrend above — the parent page gates on the admin's
 * plan tier so a sub-BUSINESS admin never triggers the 403 in the first
 * place.
 */
export function usePropertyAnalyticsBenchmark(propertyId: string, enabled = true) {
  return useQuery({
    queryKey: ["analytics", "properties", propertyId, "benchmark"],
    queryFn: () => fetchPropertyAnalyticsBenchmark(propertyId),
    enabled: Boolean(propertyId) && enabled,
  });
}
