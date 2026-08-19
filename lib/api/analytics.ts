import { api } from "./client";
import type {
  AnalyticsDeviceBreakdownEntry,
  AnalyticsRankingEntry,
  AnalyticsSummary,
  AnalyticsTrendPoint,
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

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { data } = await api.get<AnalyticsSummary>("/analytics/summary");
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
