import { api } from "./client";
import type { CreateReportInput, Report, ReportStatus } from "@/types/reports";

export async function createReport(input: CreateReportInput): Promise<void> {
  await api.post("/reports", input);
}

export async function fetchReports(status?: ReportStatus): Promise<Report[]> {
  const { data } = await api.get<Report[]>("/reports", {
    params: status ? { status } : undefined,
  });
  return data;
}

export async function dismissReport(id: string): Promise<void> {
  await api.patch(`/reports/${id}/dismiss`);
}
