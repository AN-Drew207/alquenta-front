"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { useMyProperties } from "@/hooks/use-properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MyPropertyCard } from "@/components/properties/my-property-card";

export default function MyPropertiesPage() {
  const t = useTranslations("myProperties");
  const { data: properties, isLoading } = useMyProperties();
  const [search, setSearch] = useState("");

  const filteredProperties = useMemo(() => {
    if (!properties) return properties;
    const query = search.trim().toLowerCase();
    if (!query) return properties;
    return properties.filter((property) =>
      property.title.toLowerCase().includes(query),
    );
  }, [properties, search]);

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
        <div className="relative mb-6 max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-9"
          />
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
