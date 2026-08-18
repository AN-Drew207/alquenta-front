import { cookies } from "next/headers";
import { API_URL } from "@/lib/env";
import type { AuthenticatedUser } from "@/types/auth";

/**
 * RSC-only counterpart to fetchCurrentUser (./auth.ts) — the axios client
 * relies on the browser's cookie jar (withCredentials), which doesn't exist
 * server-side, so this forwards the incoming request's cookies manually.
 * Used to prefetch the session in the root layout so SiteHeader/ContactBox
 * don't render a loading skeleton before hydration resolves the same query
 * client-side (they share CURRENT_USER_QUERY_KEY).
 */
export async function fetchCurrentUserServer(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (res.status === 401) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`fetchCurrentUserServer failed: ${res.status}`);
  }

  return res.json();
}
