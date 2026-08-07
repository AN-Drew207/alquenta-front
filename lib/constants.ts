import type {
  NotificationStatus,
  NotificationType,
  OperationType,
  PropertyStatus,
  PropertyType,
  Role,
} from "@/types/enums";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  CLIENT: "Client",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  HOUSE: "House",
  APARTMENT: "Apartment",
  COMMERCIAL_SPACE: "Commercial space",
  OFFICE: "Office",
  LAND: "Land",
};

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  RENT: "For rent",
  SALE: "For sale",
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  AVAILABLE: "Available",
  RENTED_OR_SOLD: "Rented / Sold",
  CANCELLED: "Cancelled",
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  NEW_MESSAGE: "New message",
  NEW_OFFER: "New offer",
};

export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatus, string> = {
  PENDING: "Unread",
  READ: "Read",
};
