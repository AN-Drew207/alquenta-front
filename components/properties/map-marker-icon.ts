import L from "leaflet";

/**
 * Custom pin instead of Leaflet's default marker images — those ship as
 * relative-path PNGs that don't resolve under Next's bundler without extra
 * config. An inline SVG divIcon sidesteps that entirely and lets the pin
 * pick up the app's --primary color.
 */
export function createPropertyMarkerIcon({ muted = false }: { muted?: boolean } = {}) {
  const color = muted ? "var(--muted-foreground)" : "var(--primary)";
  return L.divIcon({
    className: "",
    html: `
      <svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,.35))">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 23 15 23s15-12.5 15-23C30 6.7 23.3 0 15 0z" fill="${color}" />
        <circle cx="15" cy="15" r="6" fill="white" />
      </svg>
    `,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -36],
  });
}
