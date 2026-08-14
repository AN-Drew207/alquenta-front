import { z } from "zod";

/**
 * Shared Zod schemas for the /profile feature. These mirror the backend
 * validation rules so the client rejects obviously-invalid input before a
 * round trip, without trying to duplicate every server-side check (e.g.
 * username uniqueness, or "new password must differ from current" which
 * requires the current password hash and can only be verified server-side).
 *
 * Backend sources of truth:
 * - api/src/modules/auth/presentation/http/dto/patch-profile-request.dto.ts
 * - api/src/modules/auth/application/use-cases/change-password/*
 *
 * The error `message`s below are plain-English defaults for standalone use
 * (e.g. quick console/dev checks). Section components built in later steps
 * are free to compose these schemas with next-intl translated messages
 * instead (e.g. via `.refine`/`superRefine` wrapping, or by re-mapping
 * `error.issues` to translation keys when rendering).
 */

// ---------------------------------------------------------------------------
// firstName / lastName
// Backend: @MinLength(2) @MaxLength(40) @Matches(/^[\p{L}\s]+$/u)
// ---------------------------------------------------------------------------

const LETTERS_AND_SPACES_REGEX = /^[\p{L}\s]+$/u;

export const firstNameSchema = z
  .string()
  .trim()
  .min(2, "First name must be at least 2 characters")
  .max(40, "First name must be at most 40 characters")
  .regex(LETTERS_AND_SPACES_REGEX, "First name must contain letters and spaces only");

export const lastNameSchema = z
  .string()
  .trim()
  .min(2, "Last name must be at least 2 characters")
  .max(40, "Last name must be at most 40 characters")
  .regex(LETTERS_AND_SPACES_REGEX, "Last name must contain letters and spaces only");

// ---------------------------------------------------------------------------
// displayName
// Backend: @MinLength(1) @MaxLength(60)
// ---------------------------------------------------------------------------

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Display name is required")
  .max(60, "Display name must be at most 60 characters");

// ---------------------------------------------------------------------------
// username
// Backend: /^[a-z0-9_]{3,24}$/ plus a reserved-word check
// (RESERVED_USERNAMES in patch-profile-request.dto.ts)
// ---------------------------------------------------------------------------

const USERNAME_REGEX = /^[a-z0-9_]{3,24}$/;

export const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "root",
  "api",
  "auth",
  "profile",
  "account",
  "alquenta",
  "support",
  "help",
  "null",
  "undefined",
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username.toLowerCase());
}

/** A non-empty, already-lowercased username value. */
export const usernameSchema = z
  .string()
  .regex(
    USERNAME_REGEX,
    "Username must be 3-24 characters: lowercase letters, numbers, and underscores only",
  )
  .refine((value) => !isReservedUsername(value), {
    message: "This username is reserved",
  });

/** Nullable username field (as edited on the public profile form): empty clears it. */
export const nullableUsernameSchema = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((value) => (value ? value.toLowerCase() : null))
  .pipe(z.union([z.null(), usernameSchema]));

// ---------------------------------------------------------------------------
// bio
// Backend: @MaxLength(280), nullable
// ---------------------------------------------------------------------------

export const bioSchema = z
  .string()
  .max(280, "Bio must be at most 280 characters")
  .nullable()
  .optional();

// ---------------------------------------------------------------------------
// phone (WhatsApp) / altPhone
// Reasonable E.164-ish check. Also rejects the common mistake of keeping the
// local trunk-prefix "0" right after the country code (e.g. typing
// "+58 0412 1234567" instead of "+58 412 1234567").
// ---------------------------------------------------------------------------

const PHONE_E164_REGEX = /^\+[1-9]\d{6,14}$/;

function stripPhoneFormatting(value: string): string {
  return value.replace(/[\s\-().]/g, "");
}

/**
 * Country calling codes are 1-3 digits. Without a full country-code table we
 * can't know the exact boundary, so this checks every plausible boundary
 * (1, 2, or 3 digits after the "+") and flags it if a "0" sits right there
 * with enough digits left to be a real subscriber number. This intentionally
 * only validates against the specific known mistake — it does not attempt to
 * fully-validate real-world phone numbers (that would require a
 * library like libphonenumber-js).
 */
function hasLeadingZeroAfterCountryCode(e164Value: string): boolean {
  const digits = e164Value.replace(/^\+/, "");
  return [1, 2, 3].some((countryCodeLength) => {
    if (digits.length <= countryCodeLength) return false;
    const rest = digits.slice(countryCodeLength);
    return rest.startsWith("0") && rest.length - 1 >= 6;
  });
}

const phoneValueSchema = z
  .string()
  .transform(stripPhoneFormatting)
  .refine((value) => PHONE_E164_REGEX.test(value), {
    message: "Enter a valid phone number in international format, e.g. +584121234567",
  })
  .refine((value) => !hasLeadingZeroAfterCountryCode(value), {
    message: "Remove the leading 0 after the country code, e.g. +584121234567, not +580412...",
  });

/** Nullable/optional phone field: empty clears it. */
export const phoneSchema = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((value) => (value ? value : null))
  .pipe(z.union([z.null(), phoneValueSchema]));

// ---------------------------------------------------------------------------
// website
// Backend: @IsUrl({ require_protocol: true }), nullable. The client adds a
// missing scheme (e.g. "instagram.com/foo" -> "https://instagram.com/foo")
// before validating, so users don't have to type "https://" themselves.
// ---------------------------------------------------------------------------

const URL_SCHEME_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;

function ensureUrlScheme(value: string): string {
  return URL_SCHEME_REGEX.test(value) ? value : `https://${value}`;
}

const websiteValueSchema = z
  .string()
  .transform(ensureUrlScheme)
  .pipe(z.url({ message: "Enter a valid website URL" }));

/** Nullable/optional website field: empty clears it. */
export const websiteSchema = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((value) => (value ? value : null))
  .pipe(z.union([z.null(), websiteValueSchema]));

// ---------------------------------------------------------------------------
// password (new password only — the security section's own schema handles
// "current password" / confirmation / "must differ from current" checks,
// the last of which can only be verified server-side)
// ---------------------------------------------------------------------------

export const newPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one digit");

// ---------------------------------------------------------------------------
// Composed, per-section object schemas
// ---------------------------------------------------------------------------

/** Fields edited on the public-profile section of /profile. */
export const publicProfileSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  displayName: displayNameSchema,
  username: nullableUsernameSchema,
  bio: bioSchema,
  city: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => (value ? value : null)),
  state: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => (value ? value : null)),
  website: websiteSchema,
  avatarUrl: z.string().nullable().optional(),
});

export type PublicProfileFormValues = z.infer<typeof publicProfileSchema>;

/** Fields edited on the contact section of /profile. */
export const contactSchema = z.object({
  phone: phoneSchema,
  altPhone: phoneSchema,
  showWhatsapp: z.boolean(),
  allowCalls: z.boolean(),
  showEmail: z.boolean(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
