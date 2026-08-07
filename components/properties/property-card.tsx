import Link from "next/link";
import { Bed, Bath, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OPERATION_TYPE_LABELS } from "@/lib/constants";
import type { Property } from "@/types/property";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function PropertyCard({ property }: { property: Property }) {
  const cover = property.images[0];

  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-border bg-card p-1.5">
      <Link href={`/properties/${property.id}`} className="relative block">
        <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <span className="absolute top-2.5 right-2.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
          {OPERATION_TYPE_LABELS[property.operationType]}
        </span>
      </Link>

      <div className="flex flex-col gap-3 px-2.5 pt-5 pb-2.5">
        <h3 className="text-base leading-tight font-medium">{property.title}</h3>

        <div className="flex items-end gap-1">
          <span className="text-xl font-bold tracking-wide text-foreground">
            {formatPrice(property.price)}
          </span>
          {property.operationType === "RENT" && (
            <span className="pb-0.5 text-sm font-medium text-muted-foreground">
              / month
            </span>
          )}
        </div>

        <div className="flex flex-wrap justify-between gap-2 rounded-xl bg-muted px-5 py-2">
          {property.bedrooms !== null && (
            <div className="flex flex-col items-center gap-0.5">
              <Bed className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {property.bedrooms}
              </span>
            </div>
          )}
          {property.bathrooms !== null && (
            <div className="flex flex-col items-center gap-0.5">
              <Bath className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {property.bathrooms}
              </span>
            </div>
          )}
          {property.squareMeters !== null && (
            <div className="flex flex-col items-center gap-0.5">
              <Ruler className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {property.squareMeters}m²
              </span>
            </div>
          )}
        </div>

        <Button
          nativeButton={false}
          render={<Link href={`/properties/${property.id}`} />}
          className="w-full rounded-full font-semibold"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
