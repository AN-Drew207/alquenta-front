"use client";

import { useTranslations } from "next-intl";
import type {
  NotificationStatus,
  OperationType,
  PropertyStatus,
  PropertyType,
  Role,
} from "@/types/enums";

export function usePropertyTypeLabels(): Record<PropertyType, string> {
  const t = useTranslations("enums.propertyType");
  return {
    HOUSE: t("HOUSE"),
    APARTMENT: t("APARTMENT"),
    COMMERCIAL_SPACE: t("COMMERCIAL_SPACE"),
    OFFICE: t("OFFICE"),
    LAND: t("LAND"),
  };
}

export function useOperationTypeLabels(): Record<OperationType, string> {
  const t = useTranslations("enums.operationType");
  return {
    RENT: t("RENT"),
    SALE: t("SALE"),
  };
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
  };
}

export function useNotificationStatusLabels(): Record<NotificationStatus, string> {
  const t = useTranslations("enums.notificationStatus");
  return {
    PENDING: t("PENDING"),
    READ: t("READ"),
  };
}
