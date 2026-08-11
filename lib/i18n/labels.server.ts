import { getTranslations } from "next-intl/server";
import type { OperationType, PropertyType } from "@/types/enums";

export async function getPropertyTypeLabels(): Promise<Record<PropertyType, string>> {
  const t = await getTranslations("enums.propertyType");
  return {
    HOUSE: t("HOUSE"),
    APARTMENT: t("APARTMENT"),
    COMMERCIAL_SPACE: t("COMMERCIAL_SPACE"),
    OFFICE: t("OFFICE"),
    LAND: t("LAND"),
  };
}

export async function getOperationTypeLabels(): Promise<Record<OperationType, string>> {
  const t = await getTranslations("enums.operationType");
  return {
    RENT: t("RENT"),
    SALE: t("SALE"),
  };
}
