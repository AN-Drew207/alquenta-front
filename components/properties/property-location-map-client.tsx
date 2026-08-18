"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// next/dynamic with ssr:false can't be called directly inside a Server
// Component (app/properties/[id]/page.tsx) — this client-only wrapper is the
// boundary that makes it legal, since Leaflet touches `window`/`document` at
// mount time (same pattern as properties-map-client.tsx).
const PropertyLocationMap = dynamic(
  () => import("./property-location-map").then((m) => m.PropertyLocationMap),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full rounded-lg" /> },
);

export function PropertyLocationMapClient({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  return <PropertyLocationMap latitude={latitude} longitude={longitude} />;
}
