"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReport, dismissReport, fetchReports } from "@/lib/api/reports";
import type { CreateReportInput, ReportStatus } from "@/types/reports";

export function useReports(status?: ReportStatus) {
  return useQuery({
    queryKey: ["reports", status ?? "all"],
    queryFn: () => fetchReports(status),
  });
}

export function useCreateReportMutation() {
  return useMutation({
    mutationFn: (input: CreateReportInput) => createReport(input),
  });
}

export function useDismissReportMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dismissReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
