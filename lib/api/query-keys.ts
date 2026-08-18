// Query keys shared between client hooks and server-side prefetching (RSC
// can't import from a "use client" file's exports safely, so keys that need
// to match across that boundary live here instead).
export const CURRENT_USER_QUERY_KEY = ["auth", "me"] as const;
