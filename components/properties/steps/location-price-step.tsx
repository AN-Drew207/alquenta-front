"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PriceInput } from "@/components/ui/price-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VENEZUELA_STATES, getMunicipalities } from "@/lib/data/venezuela-locations";
import type { PropertyWizardValues } from "../property-wizard";

export function LocationPriceStep() {
  const t = useTranslations("myProperties");
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PropertyWizardValues>();

  const selectedState = watch("state");
  const municipalities = getMunicipalities(selectedState);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="address">{t("fieldAddress")}</Label>
          <Input id="address" {...register("address")} />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="state">{t("fieldState")}</Label>
          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue("municipality", "");
                }}
              >
                <SelectTrigger id="state" className="w-full">
                  <SelectValue placeholder={t("statePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {VENEZUELA_STATES.map((state) => (
                    <SelectItem key={state.name} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="municipality">{t("fieldMunicipality")}</Label>
        <Controller
          control={control}
          name="municipality"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={!selectedState}
            >
              <SelectTrigger id="municipality" className="w-full">
                <SelectValue placeholder={t("municipalityPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {municipalities.map((municipality) => (
                  <SelectItem key={municipality} value={municipality}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.municipality && (
          <p className="text-sm text-destructive">{errors.municipality.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="price">{t("fieldPrice")}</Label>
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <PriceInput id="price" value={field.value ?? ""} onValueChange={field.onChange} />
          )}
        />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="bedrooms">{t("fieldBedrooms")}</Label>
          <Input id="bedrooms" type="number" min={0} {...register("bedrooms")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bathrooms">{t("fieldBathrooms")}</Label>
          <Input id="bathrooms" type="number" min={0} {...register("bathrooms")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="parkingSpaces">{t("fieldParkingSpaces")}</Label>
          <Input id="parkingSpaces" type="number" min={0} {...register("parkingSpaces")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="squareMeters">{t("fieldSquareMeters")}</Label>
          <Input
            id="squareMeters"
            type="number"
            min={0}
            {...register("squareMeters")}
          />
        </div>
      </div>
    </div>
  );
}
