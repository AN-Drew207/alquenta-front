import { notFound } from "next/navigation";
import { Bed, Bath, Ruler, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { ContactBox } from "@/components/properties/contact-box";
import {
  OPERATION_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/constants";
import type { Property } from "@/types/property";

async function getProperty(id: string): Promise<Property | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`,
    { cache: "no-store" },
  );

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error("Failed to load property");
  }

  return res.json();
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function PropertyDetailPage({
  params,
}: PageProps<"/properties/[id]">) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} alt={property.title} />

          <div className="mt-6 flex items-center gap-2">
            <Badge variant="secondary">
              {PROPERTY_TYPE_LABELS[property.type]}
            </Badge>
            <Badge variant="outline">
              {OPERATION_TYPE_LABELS[property.operationType]}
            </Badge>
          </div>

          <h1 className="mt-2 text-2xl font-bold">{property.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4" />
            {property.address}, {property.city}
          </p>

          <p className="mt-4 text-3xl font-bold">
            {formatPrice(property.price)}
          </p>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            {property.bedrooms !== null && (
              <span className="flex items-center gap-1">
                <Bed className="size-4" /> {property.bedrooms} bedrooms
              </span>
            )}
            {property.bathrooms !== null && (
              <span className="flex items-center gap-1">
                <Bath className="size-4" /> {property.bathrooms} bathrooms
              </span>
            )}
            {property.squareMeters !== null && (
              <span className="flex items-center gap-1">
                <Ruler className="size-4" /> {property.squareMeters}m²
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed">
            {property.description}
          </p>
        </div>

        <div>
          <ContactBox
            propertyId={property.id}
            adminId={property.adminId}
            available={property.status === "AVAILABLE"}
          />
        </div>
      </div>
    </main>
  );
}
