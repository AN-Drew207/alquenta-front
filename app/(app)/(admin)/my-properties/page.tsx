"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMyProperties } from "@/hooks/use-properties";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MyPropertyCard } from "@/components/properties/my-property-card";

export default function MyPropertiesPage() {
  const t = useTranslations("myProperties");
  const { data: properties, isLoading } = useMyProperties();

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

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="aspect-4/3 w-full rounded-2xl" />
          ))}
        </div>
      ) : !properties || properties.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t("emptyState")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <MyPropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
}
