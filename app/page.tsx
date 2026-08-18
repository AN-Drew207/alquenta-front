import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { List, Map as MapIcon } from "lucide-react";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PaginationControls } from "@/components/properties/pagination-controls";
import { PropertiesMapClient } from "@/components/properties/properties-map-client";
import { ExploreByState } from "@/components/home/explore-by-state";
import { HomeHero } from "@/components/home/home-hero";
import { serverFetch } from "@/lib/api/server-fetch";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

const PAGE_SIZE = 12;

interface PropertySearchParams {
  type?: string;
  operationType?: string;
  state?: string;
  municipality?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  parkingSpaces?: string;
  search?: string;
  /** Combined UI value from PropertyFilters — translated to sortBy/sortOrder below. */
  sort?: string;
}

// Maps the single dropdown value PropertyFilters puts in the URL to the two
// query params the API actually takes.
const SORT_TO_API: Record<string, { sortBy: string; sortOrder: string }> = {
  price_asc: { sortBy: "price", sortOrder: "asc" },
  price_desc: { sortBy: "price", sortOrder: "desc" },
  area_desc: { sortBy: "squareMeters", sortOrder: "desc" },
};

async function getProperties(params: PropertySearchParams): Promise<Property[]> {
  const { sort, ...rest } = params;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(rest)) {
    if (value) search.set(key, value);
  }
  const apiSort = sort ? SORT_TO_API[sort] : undefined;
  if (apiSort) {
    search.set("sortBy", apiSort.sortBy);
    search.set("sortOrder", apiSort.sortOrder);
  }

  const res = await serverFetch(
    `/api/properties?${search.toString()}`,
    "No se pudieron cargar las propiedades.",
  );

  return res.json();
}

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  return typeof params[key] === "string" ? params[key] : undefined;
}

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;

  const properties = await getProperties({
    type: readParam(params, "type"),
    operationType: readParam(params, "operationType"),
    state: readParam(params, "state"),
    municipality: readParam(params, "municipality"),
    minPrice: readParam(params, "minPrice"),
    maxPrice: readParam(params, "maxPrice"),
    bedrooms: readParam(params, "bedrooms"),
    bathrooms: readParam(params, "bathrooms"),
    parkingSpaces: readParam(params, "parkingSpaces"),
    search: readParam(params, "search"),
    sort: readParam(params, "sort"),
  });
  const t = await getTranslations("home");

  const totalCount = properties.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number(readParam(params, "page")) || 1),
  );
  const paginatedProperties = properties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function pageHref(page: number) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string" && key !== "page") search.set(key, value);
    }
    if (page > 1) search.set("page", String(page));
    const query = search.toString();
    return query ? `/?${query}` : "/";
  }

  function viewHref(view: "list" | "map") {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string" && key !== "page" && key !== "view") {
        search.set(key, value);
      }
    }
    if (view === "map") search.set("view", "map");
    const query = search.toString();
    return query ? `/?${query}` : "/";
  }

  const view = readParam(params, "view") === "map" ? "map" : "list";

  const hasActiveFilters = [
    "type",
    "operationType",
    "state",
    "municipality",
    "minPrice",
    "maxPrice",
    "bedrooms",
    "bathrooms",
    "parkingSpaces",
    "search",
  ].some((key) => Boolean(readParam(params, key)));

  return (
    <main className="flex-1">
      <HomeHero />

      <div className="mx-auto max-w-6xl px-4 pb-8">
        <div className="mb-6 flex flex-col gap-4">
          <PropertyFilters />
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t("totalAvailable", { count: totalCount })}
            </p>
            <div className="flex shrink-0 gap-1 rounded-full border border-border bg-card p-1">
              <Link
                href={viewHref("list")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <List className="size-4" />
                {t("viewList")}
              </Link>
              <Link
                href={viewHref("map")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  view === "map"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <MapIcon className="size-4" />
                {t("viewMap")}
              </Link>
            </div>
          </div>
        </div>

        {properties.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">{t("noResults")}</p>
        ) : view === "map" ? (
          <PropertiesMapClient properties={properties} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              buildHref={pageHref}
            />
          </>
        )}

        {!hasActiveFilters && <ExploreByState properties={properties} />}
      </div>
    </main>
  );
}
