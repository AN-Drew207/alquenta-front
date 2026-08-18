import { notFound } from "next/navigation";
import { getTranslations, getFormatter } from "next-intl/server";
import { BadgeCheck, Building2, Globe, Mail, Phone } from "lucide-react";
import { fetchPublicProfile } from "@/lib/api/profiles";
import { PropertyCard } from "@/components/properties/property-card";
import { serverFetch } from "@/lib/api/server-fetch";
import type { Property } from "@/types/property";
import type { AdminResponseStats } from "@/types/messaging";

async function getPropertiesByAdmin(adminId: string): Promise<Property[]> {
  const res = await serverFetch(
    `/api/properties?adminId=${adminId}`,
    "No se pudieron cargar las propiedades.",
  );

  return res.json();
}

async function getAdminResponseStats(
  adminId: string,
): Promise<AdminResponseStats> {
  const res = await serverFetch(
    `/api/conversations/admins/${adminId}/response-stats`,
    "No se pudieron cargar las estadísticas de respuesta.",
  );

  return res.json();
}

function formatResponseTime(
  minutes: number,
  t: (key: string, values: Record<string, number>) => string,
): string {
  if (minutes < 60) return t("minutesShort", { count: Math.round(minutes) });
  if (minutes < 1440) return t("hoursShort", { count: Math.round(minutes / 60) });
  return t("daysShort", { count: Math.round(minutes / 1440) });
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
  const stats = await getAdminResponseStats(id);
  const t = await getTranslations("agencyProfile");
  const format = await getFormatter();

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12">
      <div className="flex items-start gap-4 border-b border-border pb-8">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt=""
            className="size-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Building2 className="size-7" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="flex items-center gap-1.5 text-2xl font-bold">
            {profile.name}
            {profile.isVerified && (
              <BadgeCheck
                className="size-5 text-primary"
                aria-label={t("verifiedBadge")}
              />
            )}
          </h1>
          <p className="text-muted-foreground">
            {t("listingsCount", { count: properties.length })}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("memberSince", {
              date: format.dateTime(new Date(profile.memberSince), {
                dateStyle: "long",
              }),
            })}
          </p>

          {stats.sampleSize > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("responseRate", { rate: Math.round(stats.responseRate * 100) })}
              {stats.averageResponseMinutes !== null &&
                ` · ${t("averageResponseTime", {
                  time: formatResponseTime(stats.averageResponseMinutes, t),
                })}`}
            </p>
          )}

          {profile.bio && (
            <p className="mt-3 max-w-prose text-sm">{profile.bio}</p>
          )}

          {(profile.website || profile.phone || profile.email) && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Globe className="size-4" />
                  {t("visitWebsite")}
                </a>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="size-4" />
                  {profile.phone}
                </span>
              )}
              {profile.email && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="size-4" />
                  {profile.email}
                </span>
              )}
            </div>
          )}
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
