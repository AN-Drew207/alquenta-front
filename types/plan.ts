export type PlanTier = "STARTER" | "PROFESSIONAL" | "BUSINESS" | "ENTERPRISE";

// Maps to PlanResponseDto (`GET /plans`).
export interface Plan {
  id: string;
  tier: PlanTier;
  name: string;
  monthlyPriceUsd: number;
  activeListingsLimit: number | null;
}
