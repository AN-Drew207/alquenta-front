"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useOperationTypeLabels,
  usePropertyStatusLabels,
  usePropertyTypeLabels,
} from "@/lib/i18n/labels";
import { formatPriceDisplay } from "@/lib/format/price";
import type { PropertyStatus } from "@/types/enums";
import type { PropertyWizardValues } from "../property-wizard";

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function ReviewStep({ showStatus }: { showStatus: boolean }) {
  const t = useTranslations("myProperties");
  const propertyTypeLabels = usePropertyTypeLabels();
  const operationTypeLabels = useOperationTypeLabels();
  const propertyStatusLabels = usePropertyStatusLabels();
  const { watch, control } = useFormContext<PropertyWizardValues>();
  const values = watch();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border px-4 text-sm">
        <ReviewRow label={t("fieldTitle")} value={values.title} />
        <ReviewRow label={t("fieldType")} value={propertyTypeLabels[values.type]} />
        <ReviewRow
          label={t("fieldOperation")}
          value={operationTypeLabels[values.operationType]}
        />
        <ReviewRow
          label={t("fieldAddress")}
          value={`${values.address}, ${values.municipality}, ${values.state}`}
        />
        <ReviewRow label={t("fieldPrice")} value={`$${formatPriceDisplay(values.price)}`} />
        {values.parkingSpaces && (
          <ReviewRow label={t("fieldParkingSpaces")} value={values.parkingSpaces} />
        )}
        <ReviewRow label={t("photos")} value={values.images?.length ?? 0} />
        <ReviewRow label={t("videos")} value={values.videos?.length ?? 0} />
      </div>

      {showStatus && (
        <div className="space-y-1.5">
          <Label>{t("fieldStatus")}</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: PropertyStatus) => propertyStatusLabels[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(propertyStatusLabels) as PropertyStatus[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {propertyStatusLabels[key]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}
    </div>
  );
}
