"use client";

import { useLocale, useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AnalyticsTrendPoint } from "@/types/analytics";

function formatDay(day: string, locale: string): string {
  // `day` is an ISO calendar date ("2026-08-18") — parse as local, not UTC,
  // so it doesn't shift a day depending on the visitor's timezone.
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

/**
 * Two-series trend (views + contacts) over the `day` x-axis. Window length
 * (30d/90d/full history) is resolved server-side by tier — this component
 * just renders whatever the backend returns, ordered ascending.
 */
export function AnalyticsTrendChart({ data }: { data: AnalyticsTrendPoint[] }) {
  const t = useTranslations("analytics");
  const locale = useLocale();

  const chartConfig = {
    viewCount: {
      label: t("trendViews"),
      color: "var(--chart-1)",
    },
    contactCount: {
      label: t("trendContacts"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("trendTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            {t("trendEmptyState")}
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={data} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="day"
                tickFormatter={(value: string) => formatDay(value, locale)}
                tickLine={false}
                axisLine={false}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={28}
                stroke="var(--muted-foreground)"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatDay(String(value), locale)}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="viewCount"
                type="monotone"
                stroke="var(--color-viewCount)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="contactCount"
                type="monotone"
                stroke="var(--color-contactCount)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
