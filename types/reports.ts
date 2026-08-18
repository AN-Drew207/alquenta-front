export type ReportReason =
  | "SCAM"
  | "MISLEADING_INFO"
  | "INAPPROPRIATE_CONTENT"
  | "OTHER";

export type ReportStatus = "PENDING" | "DISMISSED";

// Maps to CreateReportRequestDto (`POST /reports`).
export interface CreateReportInput {
  propertyId: string;
  reason: ReportReason;
  details?: string;
}

// Maps to ReportResponseDto (`GET /reports`, SUPERADMIN only).
export interface Report {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterEmail: string;
  reporterName: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
}
