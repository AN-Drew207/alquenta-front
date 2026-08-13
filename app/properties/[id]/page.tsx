import { notFound } from "next/navigation";
import { Bed, Bath, Car, Ruler, MapPin } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { ContactBox } from "@/components/properties/contact-box";
import { BackButton } from "@/components/ui/back-button";
import {
  getOperationTypeLabels,
  getPropertyTypeLabels,
} from "@/lib/i18n/labels.server";
import { cn } from "@/lib/utils";
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

export default async function PropertyDetailPage({
  params,
}: PageProps<"/properties/[id]">) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const t = await getTranslations("propertyDetail");
  const format = await getFormatter();
  const propertyTypeLabels = await getPropertyTypeLabels();
  const operationTypeLabels = await getOperationTypeLabels();

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <BackButton className="mb-4" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} alt={property.title} />

          <div className="mt-6 flex items-center gap-2">
            <Badge variant="secondary">
              {propertyTypeLabels[property.type]}
            </Badge>
            <Badge
              className={cn(
                "border-transparent text-white",
                property.operationType === "RENT"
                  ? "bg-primary"
                  : "bg-blue-600",
              )}
            >
              {operationTypeLabels[property.operationType]}
            </Badge>
          </div>

          <h1 className="mt-2 text-2xl font-bold">{property.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4" />
            {property.address}, {property.municipality}, {property.state}
          </p>

          <p className="mt-4 text-3xl font-bold">
            {format.number(property.price, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground sm:grid-cols-4">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Ruler className="size-4 shrink-0" /> {property.squareMeters ?? 0}
              m²
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Bed className="size-4 shrink-0" />{" "}
              {t("bedrooms", { count: property.bedrooms ?? 0 })}
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Bath className="size-4 shrink-0" />{" "}
              {t("bathrooms", { count: property.bathrooms ?? 0 })}
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Car className="size-4 shrink-0" />{" "}
              {t("parkingSpaces", { count: property.parkingSpaces ?? 0 })}
            </span>
          </div>

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed">
            {property.description}
          </p>

          {property.videos.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {property.videos.map((video) => (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  key={video}
                  src={video}
                  controls
                  className="aspect-video w-full rounded-lg bg-muted"
                />
              ))}
            </div>
          )}
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
