"use client";

import { useTranslations } from "next-intl";
import { useFavorites } from "@/hooks/use-favorites";
import { PropertyCard } from "@/components/properties/property-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesPage() {
  const t = useTranslations("favorites");
  const { data: properties, isLoading } = useFavorites();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : !properties || properties.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
}
