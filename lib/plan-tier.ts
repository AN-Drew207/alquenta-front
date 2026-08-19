import type { PlanTier } from "@/types/plan";

const TIER_ORDER: Record<PlanTier, number> = {
  STARTER: 0,
  PROFESSIONAL: 1,
  BUSINESS: 2,
  ENTERPRISE: 3,
};

/**
 * Compares an admin's plan tier against a minimum required tier — used to
 * gate PROFESSIONAL+ features (analytics Fase 2: trend chart, ranking,
 * device breakdown) client-side, before ever calling the backend, so a
 * STARTER admin never triggers the 403 `AnalyticsAccessDeniedException` in
 * the first place.
 */
export function isTierAtLeast(
  tier: PlanTier | null | undefined,
  minTier: PlanTier,
): boolean {
  if (!tier) return false;
  return TIER_ORDER[tier] >= TIER_ORDER[minTier];
}
