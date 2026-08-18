import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PropertyCard } from "@/components/properties/property-card";
import { PaginationControls } from "@/components/properties/pagination-controls";
import { serverFetch } from "@/lib/api/server-fetch";
import { operationSlugToType, stateSlugToName } from "@/lib/slugs";
import type { Property } from "@/types/property";
import type { OperationType } from "@/types/enums";

const PAGE_SIZE = 12;

function parseParams(operacion: string, estado: string) {
  const operationType = operationSlugToType(operacion);
  const state = stateSlugToName(estado);
  if (!operationType || !state) return null;
  return { operationType, state };
}

async function getProperties(
  operationType: OperationType,
  state: string,
): Promise<Property[]> {
  const search = new URLSearchParams({ operationType, state });
  const res = await serverFetch(
    `/api/properties?${search.toString()}`,
    "No se pudieron cargar las propiedades.",
  );
  return res.json();
}

export async function generateMetadata({
  params,
}: PageProps<"/[operacion]/[estado]">) {
  const { operacion, estado } = await params;
  const parsed = parseParams(operacion, estado);
  if (!parsed) return {};

  const t = await getTranslations("landing");
  const args = { operation: parsed.operationType, state: parsed.state };
  return {
    title: t("metaTitle", args),
    description: t("metaDescription", args),
  };
}

export default async function OperationStateLandingPage({
  params,
  searchParams,
}: PageProps<"/[operacion]/[estado]">) {
  const { operacion, estado } = await params;
  const parsed = parseParams(operacion, estado);
  if (!parsed) notFound();
  const { operationType, state } = parsed;

  const sp = await searchParams;
  const pageParam = typeof sp.page === "string" ? sp.page : undefined;

  const properties = await getProperties(operationType, state);
  const t = await getTranslations("landing");

  const totalCount = properties.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number(pageParam) || 1),
  );
  const paginatedProperties = properties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function pageHref(page: number) {
    const basePath = `/${operacion}/${estado}`;
    return page > 1 ? `${basePath}?page=${page}` : basePath;
  }

  const filtersHref = `/?operationType=${operationType}&state=${encodeURIComponent(state)}`;

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">
        {t("heading", { operation: operationType, state })}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {t("intro", { operation: operationType, state, count: totalCount })}
      </p>
      <Link
        href={filtersHref}
        className="mt-1 inline-block text-sm text-primary hover:underline"
      >
        {t("viewWithFilters")}
      </Link>

      {totalCount === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t("noResults", { operation: operationType, state })}
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </main>
  );
}
