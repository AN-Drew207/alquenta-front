import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { serverFetch } from "@/lib/api/server-fetch";
import { operationTypeToSlug, stateNameToSlug } from "@/lib/slugs";
import type { Property } from "@/types/property";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: path === "" ? "daily" : "monthly",
      priority,
    }),
  );

  let properties: Property[] = [];
  try {
    const res = await serverFetch("/api/properties", "");
    properties = await res.json();
  } catch {
    // A backend hiccup shouldn't take down the whole sitemap — serve the
    // static pages instead of erroring the route.
  }

  const propertyEntries: MetadataRoute.Sitemap = properties.map(
    (property) => ({
      url: `${SITE_URL}/properties/${property.id}`,
      lastModified: new Date(property.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  // Only list operation+state combos that currently have at least one
  // listing — an indexed page with zero results is thin content, not a
  // useful crawl target.
  const combos = new Set(
    properties.map(
      (property) =>
        `${operationTypeToSlug(property.operationType)}/${stateNameToSlug(property.state)}`,
    ),
  );
  const landingEntries: MetadataRoute.Sitemap = Array.from(combos).map(
    (path) => ({
      url: `${SITE_URL}/${path}`,
      changeFrequency: "daily",
      priority: 0.7,
    }),
  );

  return [...staticEntries, ...propertyEntries, ...landingEntries];
}
