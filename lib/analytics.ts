/**
 * Placeholder event tracker — no analytics provider is wired up yet (no
 * Plausible/PostHog/GA in this project). This exists so call sites don't
 * have to change when one gets picked; today it just logs, which at least
 * makes events visible in the browser console during development.
 *
 * First real call site: "contact_initiated" in use-conversations.ts, per
 * the roadmap's Fase 0 — without it there's no way to measure whether any
 * later change actually moves the funnel.
 */
export function track(event: string, properties?: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[analytics] ${event}`, properties ?? {});
  }
}
