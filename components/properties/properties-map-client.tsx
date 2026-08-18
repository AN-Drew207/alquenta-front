"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@/types/property";

// next/dynamic with ssr:false can't be called directly inside a Server
// Component (app/page.tsx) — this client-only wrapper is the boundary that
// makes it legal, since Leaflet touches `window`/`document` at mount time.
const PropertiesMap = dynamic(
  () => import("./properties-map").then((m) => m.PropertiesMap),
  { ssr: false, loading: () => <Skeleton className="h-[70vh] w-full rounded-2xl" /> },
);

export function PropertiesMapClient({ properties }: { properties: Property[] }) {
  return <PropertiesMap properties={properties} />;
}
