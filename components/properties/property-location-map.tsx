"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { createPropertyMarkerIcon } from "./map-marker-icon";

const markerIcon = createPropertyMarkerIcon();

/**
 * Static, read-only pin for the property detail page — unlike
 * location-picker.tsx (wizard, draggable) or properties-map.tsx (catalog,
 * many pins + popups), this just centers on one property's coordinates.
 */
export function PropertyLocationMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  return (
    <div className="h-72 w-full overflow-hidden rounded-lg border border-border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
