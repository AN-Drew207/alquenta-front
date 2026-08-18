import { getTranslations } from "next-intl/server";
import { buildLabels } from "./build-labels";
import { OPERATION_TYPE_VALUES, PROPERTY_TYPE_VALUES } from "@/types/enums";
import type { OperationType, PropertyType } from "@/types/enums";

export async function getPropertyTypeLabels(): Promise<
  Record<PropertyType, string>
> {
  const t = await getTranslations("enums.propertyType");
  return buildLabels(PROPERTY_TYPE_VALUES, t);
}

export async function getOperationTypeLabels(): Promise<
  Record<OperationType, string>
> {
  const t = await getTranslations("enums.operationType");
  return buildLabels(OPERATION_TYPE_VALUES, t);
}
