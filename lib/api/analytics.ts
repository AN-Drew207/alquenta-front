import { api } from "./client";
import { API_URL } from "@/lib/env";
import type {
  AnalyticsBenchmark,
  AnalyticsDeviceBreakdownEntry,
  AnalyticsRankingEntry,
  AnalyticsSummary,
  AnalyticsSummaryFilters,
  AnalyticsTrendPoint,
  PropertyAnalyticsExportFormat,
} from "@/types/analytics";

export async function recordPropertyView(propertyId: string): Promise<void> {
  await api.post<{ ok: true }>(`/analytics/properties/${propertyId}/view`);
}

export async function fetchPropertyAnalyticsSummary(
  propertyId: string,
): Promise<AnalyticsSummary> {
  const { data } = await api.get<AnalyticsSummary>(
    `/analytics/properties/${propertyId}/summary`,
  );
  return data;
}

export async function fetchAnalyticsSummary(
  filters?: AnalyticsSummaryFilters,
): Promise<AnalyticsSummary> {
  const { data } = await api.get<AnalyticsSummary>("/analytics/summary", {
    params: filters,
  });
  return data;
}

export async function fetchPropertyAnalyticsTrend(
  propertyId: string,
): Promise<AnalyticsTrendPoint[]> {
  const { data } = await api.get<AnalyticsTrendPoint[]>(
    `/analytics/properties/${propertyId}/trend`,
  );
  return data;
}

export async function fetchAnalyticsRanking(): Promise<AnalyticsRankingEntry[]> {
  const { data } = await api.get<AnalyticsRankingEntry[]>("/analytics/ranking");
  return data;
}

export async function fetchPropertyAnalyticsDeviceBreakdown(
  propertyId: string,
): Promise<AnalyticsDeviceBreakdownEntry[]> {
  const { data } = await api.get<AnalyticsDeviceBreakdownEntry[]>(
    `/analytics/properties/${propertyId}/device-breakdown`,
  );
  return data;
}

export async function fetchPropertyAnalyticsBenchmark(
  propertyId: string,
): Promise<AnalyticsBenchmark> {
  const { data } = await api.get<AnalyticsBenchmark>(
    `/analytics/properties/${propertyId}/benchmark`,
  );
  return data;
}

/**
 * Absolute backend URL for a property's analytics export — meant to be used
 * straight as an `<a href>` (plain browser navigation, not axios), so the
 * response's `Content-Disposition: attachment` triggers a native download
 * with the httpOnly session cookie riding along same-site. Never fetch this
 * with `api`/blob — that would need extra plumbing for nothing.
 */
export function getPropertyAnalyticsExportUrl(
  propertyId: string,
  format: PropertyAnalyticsExportFormat,
): string {
  return `${API_URL}/api/analytics/properties/${propertyId}/export?format=${format}`;
}
