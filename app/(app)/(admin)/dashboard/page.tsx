"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Building2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useMyProperties } from "@/hooks/use-properties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { TypeBreakdownChart } from "@/components/dashboard/type-breakdown-chart";
import { ListingsOverTimeChart } from "@/components/dashboard/listings-over-time-chart";
import { RecentListingsTable } from "@/components/dashboard/recent-listings-table";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: properties, isLoading } = useMyProperties();

  const total = properties?.length ?? 0;
  const available = properties?.filter((p) => p.status === "AVAILABLE").length ?? 0;
  const rentedOrSold =
    properties?.filter((p) => p.status === "RENTED_OR_SOLD").length ?? 0;
  const cancelled = properties?.filter((p) => p.status === "CANCELLED").length ?? 0;

  const stats = [
    { label: t("totalListings"), value: total, icon: Building2, tone: "accent" as const },
    { label: t("available"), value: available, icon: CheckCircle2, tone: "neutral" as const },
    { label: t("rentedSold"), value: rentedOrSold, icon: Clock, tone: "neutral" as const },
    { label: t("cancelled"), value: cancelled, icon: XCircle, tone: "neutral" as const },
  ];

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button nativeButton={false} render={<Link href="/my-properties/new" />}>
          {t("publishProperty")}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TypeBreakdownChart properties={properties ?? []} />
            <ListingsOverTimeChart properties={properties ?? []} />
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">{t("recentListings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentListingsTable properties={properties ?? []} />
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
