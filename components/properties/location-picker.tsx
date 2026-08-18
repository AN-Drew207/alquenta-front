"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { useTranslations } from "next-intl";
import {
  VENEZUELA_DEFAULT_CENTER,
  VENEZUELA_STATE_CENTROIDS,
} from "@/lib/data/venezuela-state-centroids";
import { createPropertyMarkerIcon } from "./map-marker-icon";

const markerIcon = createPropertyMarkerIcon();

function ClickToPlace({ onPlace }: { onPlace: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onPlace(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

/**
 * Draggable-pin location picker for the property wizard. Centered on the
 * selected state until the admin places a pin — after that, the state
 * selector no longer recenters the map, so switching state/municipality
 * text fields doesn't yank an already-placed pin's viewport around.
 */
export function LocationPicker({
  latitude,
  longitude,
  state,
  onChange,
}: {
  latitude: number | null;
  longitude: number | null;
  state: string;
  onChange: (lat: number, lng: number) => void;
}) {
  const t = useTranslations("myProperties");
  const mapRef = useRef<LeafletMap | null>(null);
  const hasPin = latitude !== null && longitude !== null;

  const initialCenter =
    latitude !== null && longitude !== null
      ? ([latitude, longitude] as [number, number])
      : (VENEZUELA_STATE_CENTROIDS[state] ?? VENEZUELA_DEFAULT_CENTER);
  const initialZoom = hasPin ? 15 : state ? 9 : 6;

  useEffect(() => {
    if (hasPin || !mapRef.current) return;
    const center = VENEZUELA_STATE_CENTROIDS[state] ?? VENEZUELA_DEFAULT_CENTER;
    mapRef.current.setView(center, state ? 9 : 6);
  }, [state, hasPin]);

  return (
    <div className="space-y-1.5">
      <p className="text-sm text-muted-foreground">{t("locationPickerHint")}</p>
      <div className="h-70 w-full overflow-hidden rounded-lg border border-border">
        <MapContainer
          ref={mapRef}
          center={initialCenter}
          zoom={initialZoom}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlace onPlace={onChange} />
          {hasPin && (
            <Marker
              position={[latitude, longitude]}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const marker = event.target as LeafletMarker;
                  const position = marker.getLatLng();
                  onChange(position.lat, position.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
