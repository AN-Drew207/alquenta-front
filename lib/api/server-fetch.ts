import { API_URL } from "@/lib/env";
import { translateApiError, type ApiError } from "./client";

/**
 * fetch wrapper for Server Components — the axios client in ./client.ts
 * assumes a browser/interactive request context and isn't a fit for RSC's
 * fetch-based caching, so this exists separately. It mirrors that client's
 * error translation (translateApiError) so a failed request reads the same
 * Spanish message whether it happened during SSR or a client-side mutation.
 *
 * Returns the raw Response so callers can still special-case 404 themselves
 * (several of them treat "not found" as a valid `null` result, not an
 * error) — only throws for other non-ok statuses.
 */
export async function serverFetch(
  path: string,
  fallbackMessage: string,
): Promise<Response> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });

  if (!res.ok && res.status !== 404) {
    const body: { message?: string; error?: string } | null = await res
      .json()
      .catch(() => null);
    const apiError: ApiError = {
      statusCode: res.status,
      message: body?.message ?? res.statusText,
      error: body?.error ?? "UnknownError",
    };
    throw new Error(translateApiError(apiError, fallbackMessage));
  }

  return res;
}
