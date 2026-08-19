"use client";

import { useTranslations } from "next-intl";
import { Eye, MessageSquare, Percent } from "lucide-react";
import { useAnalyticsSummary } from "@/hooks/use-analytics";
import { useMyFullProfile } from "@/hooks/use-profile";
import { isTierAtLeast } from "@/lib/plan-tier";
import { StatCard } from "@/components/dashboard/stat-card";
import { TierUpsellBanner } from "@/components/analytics/tier-upsell-banner";
import { RankingTable } from "@/components/analytics/ranking-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { translateApiError } from "@/lib/api/client";

export default function AnalyticsPage() {
  const t = useTranslations("analytics");
  const { data: summary, isLoading, isError, error } = useAnalyticsSummary();
  const { data: profile, isLoading: isProfileLoading } = useMyFullProfile();
  const hasRankingAccess = isTierAtLeast(profile?.plan?.tier, "PROFESSIONAL");

  const hasData = Boolean(
    summary && (summary.totalViews > 0 || summary.totalContacts > 0),
  );

  const stats = summary
    ? [
        { label: t("totalViews"), value: summary.totalViews, icon: Eye, tone: "accent" as const },
        { label: t("totalContacts"), value: summary.totalContacts, icon: MessageSquare, tone: "neutral" as const },
        {
          label: t("conversionRate"),
          value: `${(summary.conversionRate * 100).toFixed(1)}%`,
          icon: Percent,
          tone: "neutral" as const,
        },
      ]
    : [];

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {translateApiError(error, t("couldNotLoadSummary"))}
          </CardContent>
        </Card>
      ) : !hasData ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("emptyState")}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              tone={stat.tone}
            />
          ))}
        </div>
      )}

      <div className="mt-6">
        {isProfileLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : hasRankingAccess ? (
          <RankingTable />
        ) : (
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
        )}
      </div>
    </main>
  );
}
