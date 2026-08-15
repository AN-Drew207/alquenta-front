import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Building2 } from "lucide-react";
import { fetchPublicProfile } from "@/lib/api/profiles";
import { PropertyCard } from "@/components/properties/property-card";
import { API_URL } from "@/lib/env";
import type { Property } from "@/types/property";

async function getPropertiesByAdmin(adminId: string): Promise<Property[]> {
  const res = await fetch(
    `${API_URL}/api/properties?adminId=${adminId}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to load properties");
  }

  return res.json();
}

export default async function AgencyProfilePage({
  params,
}: PageProps<"/agencies/[id]">) {
  const { id } = await params;
  const profile = await fetchPublicProfile(id);

  if (!profile) {
    notFound();
  }

  const properties = await getPropertiesByAdmin(id);
  const t = await getTranslations("agencyProfile");

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12">
      <div className="flex items-center gap-4 border-b border-border pb-8">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Building2 className="size-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">
            {t("listingsCount", { count: properties.length })}
          </p>
        </div>
      </div>

      {properties.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t("noListings")}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
}
