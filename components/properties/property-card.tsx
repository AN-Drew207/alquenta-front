import Link from "next/link";
import { Bed, Bath, Ruler, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  OPERATION_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/constants";
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
    <Card className="overflow-hidden py-0 gap-0">
      <Link href={`/properties/${property.id}`}>
        <div className="aspect-video w-full bg-muted flex items-center justify-center overflow-hidden">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm text-muted-foreground">No image</span>
          )}
        </div>
      </Link>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {PROPERTY_TYPE_LABELS[property.type]}
          </Badge>
          <Badge variant="outline">
            {OPERATION_TYPE_LABELS[property.operationType]}
          </Badge>
        </div>
        <Link href={`/properties/${property.id}`}>
          <h3 className="mt-2 font-semibold leading-tight hover:underline">
            {property.title}
          </h3>
        </Link>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {property.city}
        </p>
        <p className="mt-2 text-lg font-bold">{formatPrice(property.price)}</p>
      </CardContent>
      <CardFooter className="flex items-center gap-3 pb-4 text-sm text-muted-foreground">
        {property.bedrooms !== null && (
          <span className="flex items-center gap-1">
            <Bed className="size-3.5" /> {property.bedrooms}
          </span>
        )}
        {property.bathrooms !== null && (
          <span className="flex items-center gap-1">
            <Bath className="size-3.5" /> {property.bathrooms}
          </span>
        )}
        {property.squareMeters !== null && (
          <span className="flex items-center gap-1">
            <Ruler className="size-3.5" /> {property.squareMeters}m²
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
