/**
 * Single source of truth for environment-driven config. Every other module
 * should import from here instead of reading `process.env.NEXT_PUBLIC_*`
 * directly, so there is exactly one place that knows the variable names.
 *
 * These are all `NEXT_PUBLIC_*` values: Next.js inlines them at build time,
 * so this file must keep referencing `process.env.NEXT_PUBLIC_X` literally
 * (no dynamic lookups) for the inlining to work.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to ` +
        `.env.local (or set it in the Vercel project settings) and fill it in.`,
    );
  }
  return value;
}

/** Base URL of the backend API, no trailing slash, without "/api". */
export const API_URL = required(
  "NEXT_PUBLIC_API_URL",
  process.env.NEXT_PUBLIC_API_URL,
).replace(/\/+$/, "");

/** Which deployment tier this build is running as. Defaults to "development". */
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? "development";

export const IS_PRODUCTION = APP_ENV === "production";
