"use client";

import { useLocale, useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Property } from "@/types/property";

const MONTHS_SHOWN = 6;

function lastMonths(count: number, locale: string): { key: string; label: string }[] {
  const result: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString(locale, { month: "short" }),
    });
  }
  return result;
}

export function ListingsOverTimeChart({ properties }: { properties: Property[] }) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const chartConfig = {
    count: {
      label: t("listings"),
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  const months = lastMonths(MONTHS_SHOWN, locale);
  const data = months.map(({ key, label }) => ({
    month: label,
    count: properties.filter((p) => {
      const created = new Date(p.createdAt);
      return `${created.getFullYear()}-${created.getMonth()}` === key;
    }).length,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("listingsOverTime")}</CardTitle>
      </CardHeader>
      <CardContent>
        {properties.length === 0 ? (
          <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            {t("noListingsYet")}
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <AreaChart data={data} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
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
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Area
                dataKey="count"
                type="monotone"
                stroke="var(--color-count)"
                strokeWidth={2}
                fill="var(--color-count)"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
