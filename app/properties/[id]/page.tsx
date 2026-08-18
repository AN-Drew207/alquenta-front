import { notFound } from "next/navigation";
import Link from "next/link";
import { Bed, Bath, Car, Ruler, MapPin, Building2, CalendarDays } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { ContactBox } from "@/components/properties/contact-box";
import { ShareButton } from "@/components/properties/share-button";
import { FavoriteButton } from "@/components/properties/favorite-button";
import { ReportPropertyDialog } from "@/components/properties/report-property-dialog";
import { WhatsappRevealCard } from "@/components/properties/whatsapp-reveal-card";
import { BackButton } from "@/components/ui/back-button";
import { fetchPublicProfile } from "@/lib/api/profiles";
import {
  getOperationTypeLabels,
  getPropertyTypeLabels,
} from "@/lib/i18n/labels.server";
import { cn } from "@/lib/utils";
import { serverFetch } from "@/lib/api/server-fetch";
import type { Property } from "@/types/property";

async function getProperty(id: string): Promise<Property | null> {
  const res = await serverFetch(
    `/api/properties/${id}`,
    "No se pudo cargar la propiedad.",
  );

  if (res.status === 404) {
    return null;
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
  const publisher = await fetchPublicProfile(property.adminId);

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

          <div className="mt-2 flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <div className="flex shrink-0 items-center gap-2">
              <FavoriteButton
                propertyId={property.id}
                className="bg-transparent hover:bg-accent"
              />
              <ShareButton title={property.title} />
            </div>
          </div>
          <p className="mt-1 flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4" />
            {property.address}, {property.municipality}, {property.state}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {t("publishedOn", {
              date: format.dateTime(new Date(property.createdAt), {
                dateStyle: "long",
              }),
            })}
          </p>

          <p className="mt-4 flex items-end gap-1">
            <span className="text-3xl font-bold">
              {format.number(property.price, {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })}
            </span>
            {property.operationType === "RENT" && (
              <span className="pb-0.5 text-base font-medium text-muted-foreground">
                {t("perMonth")}
              </span>
            )}
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

        <div className="space-y-4">
          {property.hasWhatsappContact && property.contactRevealToken && (
            <WhatsappRevealCard
              propertyId={property.id}
              contactRevealToken={property.contactRevealToken}
            />
          )}

          {publisher && (
            <Card>
              <CardContent className="py-4">
                <p className="text-xs text-muted-foreground">
                  {t("publishedBy")}
                </p>
                <Link
                  href={`/agencies/${publisher.id}`}
                  className="mt-1 flex items-center gap-2.5 hover:underline"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Building2 className="size-4.5" />
                  </span>
                  <span className="font-medium">{publisher.name}</span>
                </Link>
              </CardContent>
            </Card>
          )}

          <ContactBox
            propertyId={property.id}
            propertyTitle={property.title}
            adminId={property.adminId}
            available={property.status === "AVAILABLE"}
            status={property.status}
            operationType={property.operationType}
          />

          <ReportPropertyDialog propertyId={property.id} adminId={property.adminId} />
        </div>
      </div>
    </main>
  );
}
