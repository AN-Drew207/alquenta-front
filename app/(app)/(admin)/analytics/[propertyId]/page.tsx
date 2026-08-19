"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  usePropertyAnalyticsDeviceBreakdown,
  usePropertyAnalyticsTrend,
} from "@/hooks/use-analytics";
import { useMyFullProfile } from "@/hooks/use-profile";
import { useProperty } from "@/hooks/use-properties";
import { isTierAtLeast } from "@/lib/plan-tier";
import { translateApiError } from "@/lib/api/client";
import { AnalyticsTrendChart } from "@/components/analytics/analytics-trend-chart";
import { DeviceBreakdownChart } from "@/components/analytics/device-breakdown-chart";
import { TierUpsellBanner } from "@/components/analytics/tier-upsell-banner";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyAnalyticsPage() {
  const t = useTranslations("analytics");
  const params = useParams<{ propertyId: string }>();

  const { data: property, isLoading: isPropertyLoading } = useProperty(
    params.propertyId,
  );
  const { data: profile, isLoading: isProfileLoading } = useMyFullProfile();
  const hasAccess = isTierAtLeast(profile?.plan?.tier, "PROFESSIONAL");

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
          description={t("upsellDescription")}
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
      )}
    </main>
  );
}
