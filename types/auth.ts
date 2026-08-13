import type { AccountType, Role } from "./enums";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string | null;
  showPhoneOnListings: boolean;
}

export interface UpdateProfileInput {
  phone?: string | null;
  showPhoneOnListings?: boolean;
}

export interface PublicProfile {
  id: string;
  name: string;
  role: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface NotificationPrefs {
  newMessage: boolean;
  threadReply: boolean;
  unanswered: boolean;
  weeklyDigest: boolean;
  listingExpiring: boolean;
  product: boolean;
  channels: {
    email: boolean;
    inApp: boolean;
    whatsapp: boolean;
  };
  quietFrom: string;
  quietTo: string;
}

export interface PrivacyPrefs {
  publicProfile: boolean;
  showLocation: boolean;
  showLastSeen: boolean;
  showResponseTime: boolean;
  whoCanMessage: "ANYONE" | "VERIFIED_EMAIL" | "FULLY_VERIFIED";
  filterSpam: boolean;
}

export interface GeneralPrefs {
  locale: "es" | "en" | "pt";
  currency: "USD" | "VES" | "EUR";
  theme: "light" | "dark" | "system";
}

export interface Profile {
  id: string;
  email: string;
  pendingEmail: string | null;
  emailVerified: boolean;
  name: string;
  username: string | null;
  role: Role | "SUPERADMIN";
  accountType: AccountType;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  phone: string | null;
  altPhone: string | null;
  phoneVerified: boolean;
  showPhoneOnListings: boolean;
  allowCalls: boolean;
  showEmail: boolean;
  notificationPrefs: NotificationPrefs;
  privacyPrefs: PrivacyPrefs;
  generalPrefs: GeneralPrefs;
  twoFactorEnabled: boolean;
  deactivatedAt: string | null;
  completeness: number;
}

export interface Session {
  id: string;
  userAgent: string | null;
  ip: string | null;
  createdAt: string;
  lastActiveAt: string;
  current: boolean;
}
