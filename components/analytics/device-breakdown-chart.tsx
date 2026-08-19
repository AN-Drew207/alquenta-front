"use client";

import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useDeviceTypeLabels } from "@/lib/i18n/labels";
import type { AnalyticsDeviceBreakdownEntry } from "@/types/analytics";

/**
 * Horizontal bar breakdown, same visual pattern as
 * components/dashboard/type-breakdown-chart.tsx. `data` always has exactly
 * 3 entries (MOBILE/DESKTOP/UNKNOWN) — rendered in whatever order the
 * backend returns them.
 */
export function DeviceBreakdownChart({
  data,
}: {
  data: AnalyticsDeviceBreakdownEntry[];
}) {
  const t = useTranslations("analytics");
  const deviceTypeLabels = useDeviceTypeLabels();

  const chartConfig = {
    count: {
      label: t("deviceBreakdownCount"),
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  const hasData = data.some((entry) => entry.count > 0);
  const chartData = data.map((entry) => ({
    device: entry.deviceType,
    label: deviceTypeLabels[entry.deviceType],
    count: entry.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("deviceBreakdownTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            {t("deviceBreakdownEmptyState")}
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 12, top: 4, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                type="category"
                dataKey="label"
                tickLine={false}
                axisLine={false}
                width={90}
                stroke="var(--muted-foreground)"
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={4}
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
