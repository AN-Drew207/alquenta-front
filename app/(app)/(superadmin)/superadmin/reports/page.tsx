"use client";

import { useTranslations, useFormatter } from "next-intl";
import { toast } from "sonner";
import { useDismissReportMutation, useReports } from "@/hooks/use-reports";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReportReason } from "@/types/reports";

function reasonLabelKey(reason: ReportReason): string {
  switch (reason) {
    case "SCAM":
      return "reportReasonScam";
    case "MISLEADING_INFO":
      return "reportReasonMisleadingInfo";
    case "INAPPROPRIATE_CONTENT":
      return "reportReasonInappropriateContent";
    default:
      return "reportReasonOther";
  }
}

export default function ReportsPage() {
  const t = useTranslations("superadmin");
  const tPropertyDetail = useTranslations("propertyDetail");
  const format = useFormatter();
  const { data: reports, isLoading } = useReports("PENDING");
  const dismissMutation = useDismissReportMutation();

  function handleDismiss(id: string) {
    dismissMutation.mutate(id, {
      onSuccess: () => toast.success(t("reportDismissed")),
      onError: (error) =>
        toast.error(translateApiError(error, t("couldNotDismissReport"))),
    });
  }

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("reportsTitle")}</h1>
        <p className="text-muted-foreground">{t("reportsSubtitle")}</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : !reports || reports.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t("reportsEmptyState")}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columnProperty")}</TableHead>
              <TableHead>{t("columnReporter")}</TableHead>
              <TableHead>{t("columnReason")}</TableHead>
              <TableHead>{t("columnReportedAt")}</TableHead>
              <TableHead className="text-right">
                {t("columnReportActions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  {report.propertyTitle}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{report.reporterName}</span>
                    <span className="text-xs text-muted-foreground">
                      {report.reporterEmail}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <Badge variant="outline">
                      {tPropertyDetail(reasonLabelKey(report.reason))}
                    </Badge>
                    {report.details && (
                      <span className="mt-1 max-w-xs text-xs text-muted-foreground">
                        {report.details}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {format.dateTime(new Date(report.createdAt), {
                    dateStyle: "medium",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={dismissMutation.isPending}
                    onClick={() => handleDismiss(report.id)}
                  >
                    {t("dismissReport")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
