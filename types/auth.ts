import type { AccountType, Role } from "./enums";

// Maps to UserResponseDto (`GET /auth/me`, `PATCH /auth/me`). This backend
// response shape still uses `name`/`showWhatsapp` — it was NOT renamed to
// `displayName` alongside the `/profile` endpoint.
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string | null;
  showWhatsapp: boolean;
}

// Maps to UpdateProfileRequestDto (`PATCH /auth/me`).
export interface UpdateProfileInput {
  phone?: string | null;
  showWhatsapp?: boolean;
}

// Maps to PublicProfileResponseDto (`GET /auth/:id`, public, no auth
// required). Still uses `name`, unrelated to the `/profile` displayName rename.
export interface PublicProfile {
  id: string;
  name: string;
  role: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Maps to RegisterRequestDto (`POST /auth/register`). Still uses `name`.
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface GeneralPrefs {
  locale: "es" | "en" | "pt";
  theme: "light" | "dark" | "system";
}

export interface ProfileCompletion {
  pct: number;
  missing: string[];
}

// Maps to ProfileResponseDto (`GET /profile`, `PATCH /profile`).
export interface Profile {
  id: string;
  email: string;
  pendingEmail: string | null;
  emailVerified: boolean;
  displayName: string;
  firstName: string;
  lastName: string;
  username: string | null;
  role: Role;
  accountType: AccountType;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  phone: string | null;
  altPhone: string | null;
  showWhatsapp: boolean;
  allowCalls: boolean;
  showEmail: boolean;
  generalPrefs: GeneralPrefs;
  deactivatedAt: string | null;
  createdAt: string;
  completion: ProfileCompletion;
}

export interface Session {
  id: string;
  userAgent: string | null;
  ip: string | null;
  createdAt: string;
  lastActiveAt: string;
  current: boolean;
}
