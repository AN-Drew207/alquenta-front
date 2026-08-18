"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type Map as LeafletMap } from "leaflet";
import { useFormatter, useTranslations } from "next-intl";
import { useOperationTypeLabels } from "@/lib/i18n/labels";
import { VENEZUELA_DEFAULT_CENTER } from "@/lib/data/venezuela-state-centroids";
import { createPropertyMarkerIcon } from "./map-marker-icon";
import type { Property } from "@/types/property";

const markerIcon = createPropertyMarkerIcon();

type LocatedProperty = Property & { latitude: number; longitude: number };

export function PropertiesMap({ properties }: { properties: Property[] }) {
  const t = useTranslations("home");
  const format = useFormatter();
  const operationTypeLabels = useOperationTypeLabels();
  const mapRef = useRef<LeafletMap | null>(null);

  const located = properties.filter(
    (property): property is LocatedProperty =>
      property.latitude !== null && property.longitude !== null,
  );

  useEffect(() => {
    if (!mapRef.current) return;
    if (located.length === 0) return;
    if (located.length === 1) {
      mapRef.current.setView([located[0].latitude, located[0].longitude], 14);
      return;
    }
    const bounds = L.latLngBounds(
      located.map((property) => [property.latitude, property.longitude]),
    );
    mapRef.current.fitBounds(bounds, { padding: [32, 32] });
    // Re-fit whenever the located set changes (new filters applied).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [located.length, located.map((p) => p.id).join(",")]);

  return (
    <div className="flex flex-col gap-2">
      {located.length < properties.length && (
        <p className="text-sm text-muted-foreground">
          {t("mapUnlocatedNotice", {
            count: properties.length - located.length,
          })}
        </p>
      )}
      <div className="h-[70vh] w-full overflow-hidden rounded-2xl border border-border">
        <MapContainer
          ref={mapRef}
          center={VENEZUELA_DEFAULT_CENTER}
          zoom={6}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {located.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={markerIcon}
            >
              <Popup minWidth={200}>
                <Link
                  href={`/properties/${property.id}`}
                  className="flex flex-col gap-1.5 no-underline"
                >
                  {property.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="aspect-4/3 w-full rounded-md object-cover"
                    />
                  )}
                  <span className="text-sm leading-tight font-medium text-foreground">
                    {property.title}
                  </span>
                  <span className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-semibold text-foreground">
                      {format.number(property.price, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {operationTypeLabels[property.operationType]}
                    </span>
                  </span>
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
