export type Role = "ADMIN" | "CLIENT" | "SUPERADMIN";

export type AccountType = "OWNER" | "AGENCY" | "CLIENT";

export type PropertyType =
  | "HOUSE"
  | "APARTMENT"
  | "COMMERCIAL_SPACE"
  | "OFFICE"
  | "LAND";

// `satisfies Record<PropertyType, true>` forces this to list every member of
// the union (and no extra ones) — a new PropertyType value fails to compile
// here until it's added, instead of silently missing from *_VALUES below.
const PROPERTY_TYPE_KEYS = {
  HOUSE: true,
  APARTMENT: true,
  COMMERCIAL_SPACE: true,
  OFFICE: true,
  LAND: true,
} satisfies Record<PropertyType, true>;
export const PROPERTY_TYPE_VALUES = Object.keys(
  PROPERTY_TYPE_KEYS,
) as PropertyType[];

export type OperationType = "RENT" | "SALE";

const OPERATION_TYPE_KEYS = {
  RENT: true,
  SALE: true,
} satisfies Record<OperationType, true>;
export const OPERATION_TYPE_VALUES = Object.keys(
  OPERATION_TYPE_KEYS,
) as OperationType[];

export type PropertyStatus = "AVAILABLE" | "RENTED_OR_SOLD" | "CANCELLED";

export type NotificationType = "NEW_MESSAGE";

export type NotificationStatus = "PENDING" | "READ";

export type DeviceType = "MOBILE" | "DESKTOP" | "UNKNOWN";

const DEVICE_TYPE_KEYS = {
  MOBILE: true,
  DESKTOP: true,
  UNKNOWN: true,
} satisfies Record<DeviceType, true>;
export const DEVICE_TYPE_VALUES = Object.keys(
  DEVICE_TYPE_KEYS,
) as DeviceType[];
