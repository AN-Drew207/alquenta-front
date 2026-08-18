/**
 * Approximate geographic centroid per state — only used to center/recenter
 * the location picker map before the admin drags the pin to the exact
 * spot. Not precise enough for anything else.
 */
export const VENEZUELA_STATE_CENTROIDS: Record<string, [number, number]> = {
  Amazonas: [3.5, -66.7],
  Anzoátegui: [8.9, -64.3],
  Apure: [7.5, -69.0],
  Aragua: [10.2, -67.3],
  Barinas: [8.3, -70.3],
  Bolívar: [6.5, -63.5],
  Carabobo: [10.2, -68.0],
  Cojedes: [9.7, -68.6],
  "Delta Amacuro": [8.9, -61.5],
  "Distrito Capital": [10.5, -66.9],
  Falcón: [11.4, -69.7],
  Guárico: [8.9, -66.8],
  Lara: [10.1, -69.8],
  Mérida: [8.6, -71.1],
  Miranda: [10.3, -66.5],
  Monagas: [9.5, -63.2],
  "Nueva Esparta": [11.0, -63.9],
  Portuguesa: [9.2, -69.5],
  Sucre: [10.3, -63.4],
  Táchira: [7.8, -72.2],
  Trujillo: [9.5, -70.5],
  Vargas: [10.6, -66.9],
  Yaracuy: [10.3, -68.8],
  Zulia: [9.9, -71.9],
};

/** Geographic center of Venezuela — fallback before any state is picked. */
export const VENEZUELA_DEFAULT_CENTER: [number, number] = [8.0, -66.0];
