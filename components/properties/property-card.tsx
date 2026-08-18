"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { Bed, Bath, Car, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/properties/favorite-button";
import { useOperationTypeLabels } from "@/lib/i18n/labels";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

export function PropertyCard({ property }: { property: Property }) {
  const t = useTranslations("home");
  const format = useFormatter();
  const operationTypeLabels = useOperationTypeLabels();
  const cover = property.images[0];

  return (
    <div className="group flex flex-col gap-0 rounded-2xl border border-border bg-card p-1.5 transition-all duration-500 ease-(--nos-ease-out) hover:-translate-y-1.5 hover:shadow-(--nos-shadow-lg)">
      <div className="relative">
        <Link href={`/properties/${property.id}`} className="block">
          <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={property.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-(--nos-ease-out) group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                {t("noImage")}
              </div>
            )}
          </div>
        </Link>
        <span
          className={cn(
            "absolute top-2.5 right-2.5 rounded-full px-3 py-1.5 text-xs font-medium text-white",
            property.operationType === "RENT" ? "bg-primary" : "bg-blue-600",
          )}
        >
          {operationTypeLabels[property.operationType]}
        </span>
        <FavoriteButton
          propertyId={property.id}
          className="absolute top-2.5 left-2.5"
        />
      </div>

      <div className="flex flex-col gap-3 px-2.5 pt-5 pb-2.5">
        <h3 className="text-base leading-tight font-medium">{property.title}</h3>

        <div className="flex items-end gap-1">
          <span className="text-xl font-bold tracking-wide text-foreground">
            {format.number(property.price, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </span>
          {property.operationType === "RENT" && (
            <span className="pb-0.5 text-sm font-medium text-muted-foreground">
              {t("perMonth")}
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 rounded-xl bg-muted px-2 py-2">
          <div className="flex flex-col items-center gap-0.5">
            <Ruler className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {property.squareMeters ?? 0}m²
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Bed className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {property.bedrooms ?? 0}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Bath className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {property.bathrooms ?? 0}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Car className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {property.parkingSpaces ?? 0}
            </span>
          </div>
        </div>

        <Button
          nativeButton={false}
          render={<Link href={`/properties/${property.id}`} />}
          className="w-full rounded-full font-semibold"
        >
          {t("viewDetails")}
        </Button>
      </div>
    </div>
  );
}
