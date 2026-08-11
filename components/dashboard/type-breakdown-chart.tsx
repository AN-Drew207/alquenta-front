"use client";

import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { usePropertyTypeLabels } from "@/lib/i18n/labels";
import type { PropertyType } from "@/types/enums";
import type { Property } from "@/types/property";

export function TypeBreakdownChart({ properties }: { properties: Property[] }) {
  const t = useTranslations("dashboard");
  const propertyTypeLabels = usePropertyTypeLabels();

  const chartConfig = {
    count: {
      label: t("listings"),
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  const data = (Object.keys(propertyTypeLabels) as PropertyType[])
    .map((type) => ({
      type,
      label: propertyTypeLabels[type],
      count: properties.filter((p) => p.type === type).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("listingsByType")}</CardTitle>
      </CardHeader>
      <CardContent>
        {properties.length === 0 ? (
          <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            {t("noListingsYet")}
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <BarChart
              data={data}
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
                width={110}
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
