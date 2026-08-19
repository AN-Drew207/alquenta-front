"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import {
  usePropertyAnalyticsDeviceBreakdown,
  usePropertyAnalyticsTrend,
} from "@/hooks/use-analytics";
import { useMyFullProfile } from "@/hooks/use-profile";
import { useProperty } from "@/hooks/use-properties";
import { isTierAtLeast } from "@/lib/plan-tier";
import { translateApiError } from "@/lib/api/client";
import { getPropertyAnalyticsExportUrl } from "@/lib/api/analytics";
import { AnalyticsTrendChart } from "@/components/analytics/analytics-trend-chart";
import { BenchmarkCard } from "@/components/analytics/benchmark-card";
import { DeviceBreakdownChart } from "@/components/analytics/device-breakdown-chart";
import { TierUpsellBanner } from "@/components/analytics/tier-upsell-banner";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyAnalyticsPage() {
  const t = useTranslations("analytics");
  const params = useParams<{ propertyId: string }>();

  const { data: property, isLoading: isPropertyLoading } = useProperty(
    params.propertyId,
  );
  const { data: profile, isLoading: isProfileLoading } = useMyFullProfile();
  const hasAccess = isTierAtLeast(profile?.plan?.tier, "PROFESSIONAL");
  const hasBusinessAccess = isTierAtLeast(profile?.plan?.tier, "BUSINESS");

  const {
    data: trend,
    isLoading: isTrendLoading,
    isError: isTrendError,
    error: trendError,
  } = usePropertyAnalyticsTrend(params.propertyId, hasAccess);

  const {
    data: deviceBreakdown,
    isLoading: isDeviceLoading,
    isError: isDeviceError,
    error: deviceError,
  } = usePropertyAnalyticsDeviceBreakdown(params.propertyId, hasAccess);

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <BackButton className="mb-4" />

      <div className="mb-6">
        {isPropertyLoading ? (
          <Skeleton className="h-8 w-64" />
        ) : (
          <h1 className="text-2xl font-bold">
            {property?.title ?? t("drilldownTitle")}
          </h1>
        )}
        <p className="text-muted-foreground">{t("drilldownSubtitle")}</p>
      </div>

      {isProfileLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : !hasAccess ? (
        <TierUpsellBanner
          title={t("upsellTitle")}
          description={t("upsellDescription", { tier: "PROFESSIONAL" })}
          items={[
            t("upsellTrendCharts"),
            t("upsellRanking"),
            t("upsellDeviceBreakdown"),
            t("upsellBenchmarking"),
            t("upsellAlerts"),
            t("upsellExport"),
          ]}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {isTrendLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : isTrendError ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {translateApiError(trendError, t("couldNotLoadTrend"))}
                </CardContent>
              </Card>
            ) : (
              <AnalyticsTrendChart data={trend ?? []} />
            )}

            {isDeviceLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : isDeviceError ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {translateApiError(deviceError, t("couldNotLoadDeviceBreakdown"))}
                </CardContent>
              </Card>
            ) : (
              <DeviceBreakdownChart data={deviceBreakdown ?? []} />
            )}
          </div>

          <div className="mt-4">
            {hasBusinessAccess ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <BenchmarkCard propertyId={params.propertyId} />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t("exportTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      {t("exportDescription")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={
                          <a
                            href={getPropertyAnalyticsExportUrl(
                              params.propertyId,
                              "csv",
                            )}
                          />
                        }
                      >
                        <Download className="size-4" />
                        {t("exportCsv")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={
                          <a
                            href={getPropertyAnalyticsExportUrl(
                              params.propertyId,
                              "pdf",
                            )}
                          />
                        }
                      >
                        <Download className="size-4" />
                        {t("exportPdf")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <TierUpsellBanner
                title={t("upsellTitle")}
                description={t("upsellDescription", { tier: "BUSINESS" })}
                items={[t("upsellBenchmarking"), t("upsellExport")]}
              />
            )}
          </div>
        </>
      )}
    </main>
  );
}
