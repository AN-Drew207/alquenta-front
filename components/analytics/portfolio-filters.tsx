"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useOperationTypeLabels,
  usePropertyStatusLabels,
  usePropertyTypeLabels,
} from "@/lib/i18n/labels";
import { VENEZUELA_STATES } from "@/lib/data/venezuela-locations";
import type { OperationType, PropertyStatus, PropertyType } from "@/types/enums";

const ALL_TYPES = "all";
const ANY = "any";

type FilterKey = "type" | "operationType" | "status" | "state" | "from" | "to";

/**
 * ENTERPRISE-only (Fase 4) — narrows the portfolio aggregate on
 * GET /analytics/summary via query params on the /analytics URL itself,
 * same pattern as PropertyFilters. AnalyticsPage reads these same params to
 * build the AnalyticsSummaryFilters it passes to useAnalyticsSummary; an
 * empty query here reproduces Fase 1's unfiltered behavior exactly.
 */
export function PortfolioFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("analytics");
  const propertyTypeLabels = usePropertyTypeLabels();
  const operationTypeLabels = useOperationTypeLabels();
  const propertyStatusLabels = usePropertyStatusLabels();

  const values: Record<FilterKey, string> = {
    type: searchParams.get("type") ?? ALL_TYPES,
    operationType: searchParams.get("operationType") ?? ALL_TYPES,
    status: searchParams.get("status") ?? ALL_TYPES,
    state: searchParams.get("state") ?? ANY,
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
  };

  const hasActiveFilter = (Object.keys(values) as FilterKey[]).some((key) => {
    if (key === "from" || key === "to") return values[key] !== "";
    return values[key] !== ALL_TYPES && values[key] !== ANY;
  });

  function updateParams(next: Partial<Record<FilterKey, string>>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const key of Object.keys(values) as FilterKey[]) {
      const value = next[key] ?? values[key];
      const isEmpty = value === "" || value === ALL_TYPES || value === ANY;
      if (isEmpty) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.push(`/analytics?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-3">
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">
          {t("filterTypeLabel")}
        </Label>
        <Select
          value={values.type}
          onValueChange={(value) => updateParams({ type: value ?? undefined })}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder={t("filterAllTypes")}>
              {(value: string) =>
                value === ALL_TYPES
                  ? t("filterAllTypes")
                  : propertyTypeLabels[value as PropertyType]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TYPES}>{t("filterAllTypes")}</SelectItem>
            {(Object.keys(propertyTypeLabels) as PropertyType[]).map((key) => (
              <SelectItem key={key} value={key}>
                {propertyTypeLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">
          {t("filterOperationTypeLabel")}
        </Label>
        <Select
          value={values.operationType}
          onValueChange={(value) =>
            updateParams({ operationType: value ?? undefined })
          }
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder={t("filterAllOperations")}>
              {(value: string) =>
                value === ALL_TYPES
                  ? t("filterAllOperations")
                  : operationTypeLabels[value as OperationType]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TYPES}>
              {t("filterAllOperations")}
            </SelectItem>
            {(Object.keys(operationTypeLabels) as OperationType[]).map(
              (key) => (
                <SelectItem key={key} value={key}>
                  {operationTypeLabels[key]}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">
          {t("filterStatusLabel")}
        </Label>
        <Select
          value={values.status}
          onValueChange={(value) => updateParams({ status: value ?? undefined })}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder={t("filterAllStatuses")}>
              {(value: string) =>
                value === ALL_TYPES
                  ? t("filterAllStatuses")
                  : propertyStatusLabels[value as PropertyStatus]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TYPES}>
              {t("filterAllStatuses")}
            </SelectItem>
            {(Object.keys(propertyStatusLabels) as PropertyStatus[]).map(
              (key) => (
                <SelectItem key={key} value={key}>
                  {propertyStatusLabels[key]}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">
          {t("filterStateLabel")}
        </Label>
        <Select
          value={values.state}
          onValueChange={(value) => updateParams({ state: value ?? undefined })}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder={t("filterAnyState")}>
              {(value: string) => (value === ANY ? t("filterAnyState") : value)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>{t("filterAnyState")}</SelectItem>
            {VENEZUELA_STATES.map((state) => (
              <SelectItem key={state.name} value={state.name}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">
          {t("filterFromLabel")}
        </Label>
        <Input
          type="date"
          value={values.from}
          onChange={(event) => updateParams({ from: event.target.value })}
          className="h-9 w-36"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">
          {t("filterToLabel")}
        </Label>
        <Input
          type="date"
          value={values.to}
          onChange={(event) => updateParams({ to: event.target.value })}
          className="h-9 w-36"
        />
      </div>

      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9"
          onClick={() => router.push("/analytics")}
        >
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
