// Maps to PropertyAnalyticsSummaryResponseDto, shared by both summary
// endpoints (`/analytics/properties/:id/summary` and `/analytics/summary`).
export interface AnalyticsSummary {
  totalViews: number;
  totalContacts: number;
  conversionRate: number;
}
