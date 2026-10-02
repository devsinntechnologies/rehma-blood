"use client"

import React, { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BaseTileLayer from "@/components/live-map/BaseTileLayer";
import L from 'leaflet';
import { useTheme } from '@/context/ThemeContext';
import type { MapOverview } from '@/hooks/useMapOverview';
import { formatUrgency, isUrgent } from '@/lib/requestStatus';

// Define the custom icon creator
const createCustomIcon = (color: string, label: string) => {
  const fontSize = label.length <= 2 ? '14' : label.length === 3 ? '12' : '11';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative; width: 44px; height: 54px; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));">
        <div style="
          width: 38px; 
          height: 38px; 
          background-color: ${color}; 
          border: 3.5px solid #ffffff; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          color: #ffffff;
          font-family: Inter, system-ui, sans-serif;
          font-size: ${fontSize}px;
          font-weight: 800;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
        ">
          ${label}
        </div>
        <div style="
          width: 0; 
          height: 0; 
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 10px solid #ffffff;
          margin-top: -2px;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
        "></div>
        <div style="
          width: 0; 
          height: 0; 
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 8px solid ${color};
          margin-top: -11px;
          z-index: 1;
        "></div>
      </div>
    `,
    iconSize: [44, 54],
    iconAnchor: [22, 46],
    popupAnchor: [0, -46],
  });
};

const DONOR_COLOR = '#16a34a';
const URGENT_COLOR = '#dc2626';
const NORMAL_COLOR = '#3b82f6';

/** Frames every marker after each data change; falls back to the search centre when there are none. */
function FitToMarkers({ points, center, zoom }: { points: [number, number][]; center: [number, number]; zoom: number }) {
  const map = useMap();
  const key = points.map((point) => point.join(',')).join('|');

  useEffect(() => {
    const frame = () => {
      // The container may have been resized by layout after Leaflet first measured it.
      map.invalidateSize();
      if (points.length === 0) {
        map.setView(center, zoom);
      } else if (points.length === 1) {
        map.setView(points[0], 12);
      } else {
        map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 13 });
      }
    };
    frame();
    // Re-frame once layout has settled (sidebar, header and fonts can still shift the container).
    const timer = window.setTimeout(frame, 300);
    return () => window.clearTimeout(timer);
    // `key` captures point changes; re-running on every render would fight the user's panning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key, center[0], center[1], zoom]);

  return null;
}

export default function MapComponent({ map }: { map: MapOverview }) {
  const { theme } = useTheme();
  const { donors, requests, center, centeredOnAdmin, filters, status, error } = map;


  const markers = useMemo(() => {
    const donorMarkers = filters.layer === 'requests' ? [] : donors
      .filter((donor) => donor.latitude != null && donor.longitude != null)
      .map((donor) => ({
        id: `donor-${donor.id}`,
        pos: [donor.latitude as number, donor.longitude as number] as [number, number],
        label: donor.bloodGroup ?? '?',
        type: 'donor' as const,
        color: DONOR_COLOR,
        donor,
      }));

    const requestMarkers = filters.layer === 'donors' ? [] : requests
      .filter((request) => request.latitude != null && request.longitude != null)
      .map((request) => ({
        id: `request-${request.id}`,
        pos: [request.latitude, request.longitude] as [number, number],
        label: request.bloodGroup,
        type: 'request' as const,
        color: isUrgent(request.urgency) ? URGENT_COLOR : NORMAL_COLOR,
        request,
      }));

    return [...donorMarkers, ...requestMarkers];
  }, [donors, requests, filters.layer]);

  const mapCenter: [number, number] = [center.latitude, center.longitude];
  const defaultZoom = centeredOnAdmin ? 11 : 5;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] transition-colors relative">
      {status === 'loading' && (
        <div className="absolute top-4 left-14 z-[1000] bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-lg px-4 py-2 text-sm text-[var(--adm-fg)] shadow">
          Loading donors and requests...
        </div>
      )}

      {status === 'failed' && (
        <div className="absolute top-4 left-14 z-[1000] bg-red-900/90 border border-red-700 rounded-lg px-4 py-2 text-sm text-red-100 max-w-sm flex items-center gap-3">
          <span>{error ?? 'Failed to load the map.'}</span>
          <button type="button" onClick={map.refresh} className="underline font-semibold shrink-0">Retry</button>
        </div>
      )}

      {status === 'succeeded' && markers.length === 0 && (
        <div className="absolute top-4 left-14 z-[1000] bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-lg px-4 py-2 text-sm text-[var(--adm-fg-dim)] shadow">
          Nothing to show for these filters.
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: theme === 'dark' ? '#0a0a0a' : '#f0f0f0' }}
        zoomControl={false}
      >
        <ZoomControl position="topleft" />
        <BaseTileLayer dark={theme === "dark"} />
        <FitToMarkers points={markers.map((marker) => marker.pos)} center={mapCenter} zoom={defaultZoom} />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.pos}
            icon={createCustomIcon(marker.color, marker.label)}
          >
            <Popup className="custom-popup">
              <div className="p-2 text-sm">
                {marker.type === 'donor' ? (
                  <>
                    <div className="font-bold">{marker.donor.fullName}</div>
                    {marker.donor.city && <div className="text-xs opacity-70">{marker.donor.city}</div>}
                    <div className="text-xs mt-1">
                      Blood: <span className="font-semibold">{marker.label}</span>
                    </div>
                    {marker.donor.phone && <div className="text-xs">Phone: {marker.donor.phone}</div>}
                    {centeredOnAdmin && Number.isFinite(marker.donor.distanceKm) && (
                      <div className="text-xs opacity-70">Distance: {marker.donor.distanceKm.toFixed(1)} km</div>
                    )}
                    <div className="text-xs opacity-70">{marker.donor.availabilityStatus}</div>
                  </>
                ) : (
                  <>
                    <div className="font-bold">{marker.request.requesterName ?? `Request #${marker.request.id}`}</div>
                    <div className="text-xs mt-1">
                      Blood: <span className="font-semibold">{marker.label}</span> · {marker.request.requiredUnits} unit{marker.request.requiredUnits === 1 ? '' : 's'}
                    </div>
                    <div className={`text-xs font-semibold mt-1 ${isUrgent(marker.request.urgency) ? 'text-red-500' : 'text-blue-500'}`}>
                      {formatUrgency(marker.request.urgency)}
                    </div>
                    {marker.request.notes && <div className="text-xs mt-1 opacity-80">{marker.request.notes}</div>}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
