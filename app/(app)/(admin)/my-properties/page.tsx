"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMyProperties } from "@/hooks/use-properties";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MyPropertyCard } from "@/components/properties/my-property-card";
import { PropertyFilters } from "@/components/properties/property-filters";
import type { OperationType, PropertyType } from "@/types/enums";

const ALL_TYPES = "all";
const ANY = "any";

export default function MyPropertiesPage() {
  const t = useTranslations("myProperties");
  const { data: properties, isLoading } = useMyProperties();
  const searchParams = useSearchParams();

  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const type = searchParams.get("type") ?? ALL_TYPES;
  const operationType = searchParams.get("operationType") ?? ALL_TYPES;
  const state = searchParams.get("state") ?? ANY;
  const municipality = searchParams.get("municipality") ?? ANY;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const bedrooms = searchParams.get("bedrooms");
  const bathrooms = searchParams.get("bathrooms");
  const parkingSpaces = searchParams.get("parkingSpaces");

  const filteredProperties = useMemo(() => {
    if (!properties) return properties;

    return properties.filter((property) => {
      if (search && !property.title.toLowerCase().includes(search)) return false;
      if (type !== ALL_TYPES && property.type !== (type as PropertyType)) return false;
      if (
        operationType !== ALL_TYPES &&
        property.operationType !== (operationType as OperationType)
      )
        return false;
      if (state !== ANY && property.state !== state) return false;
      if (municipality !== ANY && property.municipality !== municipality) return false;
      if (minPrice && property.price < Number(minPrice)) return false;
      if (maxPrice && property.price > Number(maxPrice)) return false;
      if (bedrooms && (property.bedrooms ?? 0) < Number(bedrooms)) return false;
      if (bathrooms && (property.bathrooms ?? 0) < Number(bathrooms)) return false;
      if (parkingSpaces && (property.parkingSpaces ?? 0) < Number(parkingSpaces))
        return false;
      return true;
    });
  }, [
    properties,
    search,
    type,
    operationType,
    state,
    municipality,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    parkingSpaces,
  ]);

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button nativeButton={false} render={<Link href="/my-properties/new" />}>
          {t("publishProperty")}
        </Button>
      </div>

      {!isLoading && properties && properties.length > 0 && (
        <div className="mb-6">
          <PropertyFilters basePath="/my-properties" />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="aspect-4/3 w-full rounded-2xl" />
          ))}
        </div>
      ) : !properties || properties.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t("emptyState")}</p>
      ) : filteredProperties && filteredProperties.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t("noSearchResults")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties?.map((property) => (
            <MyPropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
}
