import { PropertyCard } from "@/components/properties/property-card";
import { PropertyFilters } from "@/components/properties/property-filters";
import type { Property } from "@/types/property";

async function getProperties(params: {
  type?: string;
  city?: string;
}): Promise<Property[]> {
  const search = new URLSearchParams();
  if (params.type) search.set("type", params.type);
  if (params.city) search.set("city", params.city);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/properties?${search.toString()}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to load properties");
  }

  return res.json();
}

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const type = typeof params.type === "string" ? params.type : undefined;
  const city = typeof params.city === "string" ? params.city : undefined;

  const properties = await getProperties({ type, city });

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Find your next property</h1>
          <p className="text-muted-foreground">
            Browse available listings from independent owners and agencies.
          </p>
        </div>
        <PropertyFilters />
      </div>

      {properties.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No properties match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
}
