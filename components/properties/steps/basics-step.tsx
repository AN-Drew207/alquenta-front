"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOperationTypeLabels, usePropertyTypeLabels } from "@/lib/i18n/labels";
import type { OperationType, PropertyType } from "@/types/enums";
import type { PropertyWizardValues } from "../property-wizard";

export function BasicsStep() {
  const t = useTranslations("myProperties");
  const propertyTypeLabels = usePropertyTypeLabels();
  const operationTypeLabels = useOperationTypeLabels();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PropertyWizardValues>();

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">{t("fieldTitle")}</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">{t("fieldDescription")}</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>{t("fieldType")}</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: PropertyType) => propertyTypeLabels[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(propertyTypeLabels) as PropertyType[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {propertyTypeLabels[key]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t("fieldOperation")}</Label>
          <Controller
            control={control}
            name="operationType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: OperationType) => operationTypeLabels[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(operationTypeLabels) as OperationType[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {operationTypeLabels[key]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
