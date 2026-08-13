import { getTranslations } from "next-intl/server";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PaginationControls } from "@/components/properties/pagination-controls";
import { HomeHero } from "@/components/home/home-hero";
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
}

async function getProperties(params: PropertySearchParams): Promise<Property[]> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/properties?${search.toString()}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to load properties");
  }

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

  const allProperties = await getProperties({
    type: readParam(params, "type"),
    operationType: readParam(params, "operationType"),
    state: readParam(params, "state"),
    municipality: readParam(params, "municipality"),
    minPrice: readParam(params, "minPrice"),
    maxPrice: readParam(params, "maxPrice"),
    bedrooms: readParam(params, "bedrooms"),
    bathrooms: readParam(params, "bathrooms"),
    parkingSpaces: readParam(params, "parkingSpaces"),
  });
  const t = await getTranslations("home");

  const searchQuery = readParam(params, "search")?.trim().toLowerCase();
  const properties = searchQuery
    ? allProperties.filter((property) => property.title.toLowerCase().includes(searchQuery))
    : allProperties;

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

  return (
    <main className="flex-1">
      <HomeHero />

      <div className="mx-auto max-w-6xl px-4 pb-8">
        <div className="mb-6 flex flex-col gap-4">
          <PropertyFilters />
          <p className="text-sm text-muted-foreground">
            {t("totalAvailable", { count: totalCount })}
          </p>
        </div>

        {properties.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">{t("noResults")}</p>
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
      </div>
    </main>
  );
}
