import type { DeviceType } from "./enums";

// Maps to PropertyAnalyticsSummaryResponseDto, shared by both summary
// endpoints (`/analytics/properties/:id/summary` and `/analytics/summary`).
export interface AnalyticsSummary {
  totalViews: number;
  totalContacts: number;
  conversionRate: number;
}

// Maps to one entry of `GET /analytics/properties/:id/trend`'s array
// response, ordered ascending by `day` (ISO calendar date, e.g. "2026-08-18").
// PROFESSIONAL+ only, owner-only.
export interface AnalyticsTrendPoint {
  day: string;
  viewCount: number;
  contactCount: number;
}

// Maps to one entry of `GET /analytics/ranking`'s array response — already
// sorted by the backend (views desc, ties by conversion desc). Render in the
// order given, don't re-sort. PROFESSIONAL+ only, portfolio-wide.
export interface AnalyticsRankingEntry {
  propertyId: string;
  title: string;
  totalViews: number;
  totalContacts: number;
  conversionRate: number;
}

// Maps to one entry of `GET /analytics/properties/:id/device-breakdown`'s
// array response — always exactly 3 entries. PROFESSIONAL+ only, owner-only.
export interface AnalyticsDeviceBreakdownEntry {
  deviceType: DeviceType;
  count: number;
}

// Maps to PropertyAnalyticsBenchmarkResponseDto
// (`GET /analytics/properties/:id/benchmark`). BUSINESS+ only, owner-only.
// `available: false` when fewer than 5 comparable listings exist (same
// state+type+operationType, AVAILABLE, excluding the caller's own
// properties) — every other field is only present when `available` is true,
// modeled as a discriminated union so callers can't read them unguarded.
export type AnalyticsBenchmark =
  | { available: false }
  | {
      available: true;
      comparableCount: number;
      avgViews: number;
      avgContacts: number;
      propertyViews: number;
      propertyContacts: number;
    };

export type PropertyAnalyticsExportFormat = "csv" | "pdf";
