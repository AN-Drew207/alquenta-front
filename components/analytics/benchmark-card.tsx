"use client";

import { useTranslations } from "next-intl";
import { TrendingDown, TrendingUp } from "lucide-react";
import { usePropertyAnalyticsBenchmark } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { translateApiError } from "@/lib/api/client";

/**
 * BUSINESS+ only — the parent page decides whether to mount this at all
 * based on the admin's plan tier, so the query here always runs. When
 * `available` is false (fewer than 5 comparable listings — same
 * state+type+operationType, AVAILABLE, excluding the admin's own
 * properties), this renders an explicit empty state rather than hiding the
 * card, so it never looks broken/missing.
 */
export function BenchmarkCard({ propertyId }: { propertyId: string }) {
  const t = useTranslations("analytics");
  const {
    data: benchmark,
    isLoading,
    isError,
    error,
  } = usePropertyAnalyticsBenchmark(propertyId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("benchmarkTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : isError ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {translateApiError(error, t("couldNotLoadBenchmark"))}
          </p>
        ) : !benchmark?.available ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("benchmarkEmptyState")}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <BenchmarkStat
                label={t("benchmarkViews")}
                propertyValue={benchmark.propertyViews}
                avgValue={benchmark.avgViews}
                aboveAverageLabel={t("benchmarkAboveAverage")}
                belowAverageLabel={t("benchmarkBelowAverage")}
              />
              <BenchmarkStat
                label={t("benchmarkContacts")}
                propertyValue={benchmark.propertyContacts}
                avgValue={benchmark.avgContacts}
                aboveAverageLabel={t("benchmarkAboveAverage")}
                belowAverageLabel={t("benchmarkBelowAverage")}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t("benchmarkComparableCount", {
                count: benchmark.comparableCount,
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BenchmarkStat({
  label,
  propertyValue,
  avgValue,
  aboveAverageLabel,
  belowAverageLabel,
}: {
  label: string;
  propertyValue: number;
  avgValue: number;
  aboveAverageLabel: string;
  belowAverageLabel: string;
}) {
  const t = useTranslations("analytics");
  const isAboveAverage = propertyValue >= avgValue;

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold tracking-tight">
        {propertyValue.toLocaleString()}
      </p>
      <p className="text-xs text-muted-foreground">
        {t("benchmarkAverageValue", { avg: avgValue.toLocaleString() })}
      </p>
      <Badge variant={isAboveAverage ? "success" : "warning"} className="w-fit">
        {isAboveAverage ? (
          <TrendingUp className="size-3" />
        ) : (
          <TrendingDown className="size-3" />
        )}
        {isAboveAverage ? aboveAverageLabel : belowAverageLabel}
      </Badge>
    </div>
  );
}
