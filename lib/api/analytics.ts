import { api } from "./client";
import type { AnalyticsSummary } from "@/types/analytics";

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
