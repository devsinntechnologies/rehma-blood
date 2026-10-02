"use client";

import { TileLayer } from "react-leaflet";

/**
 * OpenStreetMap base layer. (CARTO basemaps, used before, now require an API key and render
 * "API KEY REQUIRED" tiles.) Dark mode inverts the tiles with CSS rather than relying on a keyed
 * dark tile service.
 */
export default function BaseTileLayer({ dark }: { dark: boolean }) {
  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      maxZoom={19}
      className={dark ? "adm-dark-tiles" : undefined}
    />
  );
}
