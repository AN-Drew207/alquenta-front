import type { DeviceType, OperationType, PropertyStatus, PropertyType } from "./enums";

// Maps to PropertyAnalyticsSummaryResponseDto, shared by both summary
// endpoints (`/analytics/properties/:id/summary` and `/analytics/summary`).
export interface AnalyticsSummary {
  totalViews: number;
  totalContacts: number;
  conversionRate: number;
}

// Maps to PortfolioAnalyticsSummaryQueryDto — Fase 4's optional filters on
// `GET /analytics/summary`. ENTERPRISE-only: passing any of these bumps the
// backend's access gate from STARTER+ to ENTERPRISE, so only build this
// object when the caller already confirmed the admin's tier client-side (see
// isTierAtLeast in app/(app)/(admin)/analytics/page.tsx). `from`/`to` are
// plain "YYYY-MM-DD" strings from a native date input, valid ISO 8601.
export interface AnalyticsSummaryFilters {
  type?: PropertyType;
  operationType?: OperationType;
  state?: string;
  status?: PropertyStatus;
  from?: string;
  to?: string;
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
