import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { operationTypeToSlug, stateNameToSlug } from "@/lib/slugs";
import type { Property } from "@/types/property";

/**
 * Internal links into the /[operacion]/[estado] SEO landing pages — only
 * shown on the unfiltered home page (see caller), so `properties` here is
 * the full available catalog, not whatever the current search narrowed it
 * to. Search engines discover these pages primarily through this section,
 * not the sitemap alone.
 */
export async function ExploreByState({ properties }: { properties: Property[] }) {
  if (properties.length === 0) return null;

  const t = await getTranslations("landing");
  const byState = new Map<string, { RENT: number; SALE: number }>();
  for (const property of properties) {
    const counts = byState.get(property.state) ?? { RENT: 0, SALE: 0 };
    counts[property.operationType]++;
    byState.set(property.state, counts);
  }

  const states = Array.from(byState.entries())
    .map(([state, counts]) => ({
      state,
      total: counts.RENT + counts.SALE,
      dominantOperation: counts.SALE > counts.RENT ? "SALE" : "RENT",
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="mt-10 border-t border-border pt-6">
      <h2 className="text-sm font-semibold text-muted-foreground">
        {t("exploreByState")}
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {states.map(({ state, dominantOperation }) => (
          <Link
            key={state}
            href={`/${operationTypeToSlug(dominantOperation as "RENT" | "SALE")}/${stateNameToSlug(state)}`}
            className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {state}
          </Link>
        ))}
      </div>
    </div>
  );
}
