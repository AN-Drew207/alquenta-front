export type Role = "ADMIN" | "CLIENT";

export type PropertyType =
  | "HOUSE"
  | "APARTMENT"
  | "COMMERCIAL_SPACE"
  | "OFFICE"
  | "LAND";

export type OperationType = "RENT" | "SALE";

export type PropertyStatus = "AVAILABLE" | "RENTED_OR_SOLD" | "CANCELLED";

export type NotificationType = "NEW_MESSAGE";

export type NotificationStatus = "PENDING" | "READ";
