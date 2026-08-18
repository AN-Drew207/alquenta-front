"use client";

import { useTranslations } from "next-intl";
import { buildLabels } from "./build-labels";
import type {
  NotificationStatus,
  OperationType,
  PropertyStatus,
  PropertyType,
  Role,
} from "@/types/enums";
import { OPERATION_TYPE_VALUES, PROPERTY_TYPE_VALUES } from "@/types/enums";

export function usePropertyTypeLabels(): Record<PropertyType, string> {
  const t = useTranslations("enums.propertyType");
  return buildLabels(PROPERTY_TYPE_VALUES, t);
}

export function useOperationTypeLabels(): Record<OperationType, string> {
  const t = useTranslations("enums.operationType");
  return buildLabels(OPERATION_TYPE_VALUES, t);
}

export function usePropertyStatusLabels(): Record<PropertyStatus, string> {
  const t = useTranslations("enums.propertyStatus");
  return {
    AVAILABLE: t("AVAILABLE"),
    RENTED_OR_SOLD: t("RENTED_OR_SOLD"),
    CANCELLED: t("CANCELLED"),
  };
}

export function useRoleLabels(): Record<Role, string> {
  const t = useTranslations("enums.role");
  return {
    ADMIN: t("ADMIN"),
    CLIENT: t("CLIENT"),
    SUPERADMIN: t("SUPERADMIN"),
  };
}

export function useNotificationStatusLabels(): Record<NotificationStatus, string> {
  const t = useTranslations("enums.notificationStatus");
  return {
    PENDING: t("PENDING"),
    READ: t("READ"),
  };
}
