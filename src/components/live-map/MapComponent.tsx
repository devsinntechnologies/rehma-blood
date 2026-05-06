"use client"

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from '@/context/ThemeContext';
import { useMapOverview } from '@/hooks/useMapOverview';

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

// Blood group color mapping
const BLOOD_GROUP_COLORS: Record<string, string> = {
  'A+': '#16a34a',
  'A-': '#16a34a',
  'B+': '#16a34a',
  'B-': '#16a34a',
  'O+': '#16a34a',
  'O-': '#16a34a',
  'AB+': '#16a34a',
  'AB-': '#16a34a',
};

// Request urgency color mapping
const URGENCY_COLORS: Record<string, string> = {
  'critical': '#dc2626',
  'high': '#ea580c',
  'normal': '#3b82f6',
};

export default function MapComponent() {
  const { theme } = useTheme();
  const { donors, requests, currentLocation, status, geolocationError } = useMapOverview();

  if (typeof window === 'undefined') return null;

  const tileUrl = theme === 'dark'
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  // Create markers from API data
  const markers = useMemo(() => {
    const donorMarkers = (donors ?? []).map((donor) => ({
      id: `donor-${donor.id}`,
      pos: [donor.latitude ?? 0, donor.longitude ?? 0] as [number, number],
      label: donor.bloodGroup,
      type: 'donor' as const,
      color: BLOOD_GROUP_COLORS[donor.bloodGroup] || '#16a34a',
      donor,
    }));

    const requestMarkers = (requests ?? []).map((request) => ({
      id: `request-${request.id}`,
      pos: [request.latitude ?? 0, request.longitude ?? 0] as [number, number],
      label: request.bloodGroup,
      type: 'request' as const,
      color: URGENCY_COLORS[request.urgency.toLowerCase()] || '#3b82f6',
      request,
    }));

    return [...donorMarkers, ...requestMarkers];
  }, [donors, requests]);

  const mapCenter: [number, number] = currentLocation.latitude && currentLocation.longitude
    ? [currentLocation.latitude, currentLocation.longitude]
    : [30.3753, 69.3451];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] transition-colors relative">
      {/* Loading indicator */}
      {status === 'loading' && (
        <div className="absolute top-4 left-4 z-[1000] bg-[var(--adm-surface)] border border-[var(--adm-border)] rounded-lg px-4 py-2 text-sm text-[var(--adm-fg)]">
          Loading nearby donors and requests...
        </div>
      )}

      {/* Geolocation error */}
      {geolocationError && (
        <div className="absolute top-4 left-4 z-[1000] bg-red-900/80 border border-red-700 rounded-lg px-4 py-2 text-sm text-red-100 max-w-sm">
          {geolocationError}
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: theme === 'dark' ? '#0a0a0a' : '#f0f0f0' }}
        zoomControl={false}
      >
        <ZoomControl position="topleft" />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
          subdomains={['a', 'b', 'c', 'd']}
        />

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
                    <div className="font-bold text-[var(--adm-fg)]">{marker.donor.fullName}</div>
                    <div className="text-[var(--adm-fg-dim)] text-xs">{marker.donor.city}</div>
                    <div className="text-xs text-[var(--adm-fg)] mt-1">
                      Blood: <span className="font-semibold">{marker.label}</span>
                    </div>
                    <div className="text-xs text-[var(--adm-fg-dim)]">
                      Distance: {marker.donor.distanceKm?.toFixed(1) || 0} km
                    </div>
                    <div className="text-xs text-[var(--adm-fg-dim)]">
                      Available: {marker.donor.availabilityStatus}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-[var(--adm-fg)]">{marker.request.requesterName}</div>
                    <div className="text-xs text-[var(--adm-fg)] mt-1">
                      Blood: <span className="font-semibold">{marker.label}</span>
                    </div>
                    <div className="text-xs text-[var(--adm-fg)] mt-1">
                      Units: {marker.request.requiredUnits}
                    </div>
                    <div className={`text-xs font-semibold mt-1 ${
                      marker.request.urgency.toLowerCase() === 'critical' ? 'text-red-500' :
                      marker.request.urgency.toLowerCase() === 'high' ? 'text-orange-500' :
                      'text-blue-500'
                    }`}>
                      {marker.request.urgency}
                    </div>
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
