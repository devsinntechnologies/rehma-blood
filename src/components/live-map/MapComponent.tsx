"use client"

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from '@/context/ThemeContext';

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

const markers = [
  { id: 1, pos: [33.6844, 73.0479] as [number, number], label: 'O-', type: 'donor', color: '#16a34a' },
  { id: 2, pos: [31.5204, 74.3587] as [number, number], label: 'A+', type: 'donor', color: '#16a34a' },
  { id: 3, pos: [34.0151, 71.5249] as [number, number], label: 'B-', type: 'donor', color: '#16a34a' },
  { id: 4, pos: [34.1986, 73.2327] as [number, number], label: 'AB-', type: 'donor', color: '#16a34a' },
  { id: 5, pos: [33.9755, 72.7441] as [number, number], label: 'O+', type: 'donor', color: '#16a34a' },
  { id: 6, pos: [31.4181, 73.0776] as [number, number], label: 'A+', type: 'high_priority', color: '#ea580c' },
  { id: 7, pos: [30.1575, 71.5249] as [number, number], label: 'O+', type: 'critical', color: '#dc2626' },
  { id: 8, pos: [24.8607, 67.0011] as [number, number], label: 'A-', type: 'normal', color: '#3b82f6' },
  { id: 9, pos: [31.5546, 74.3572] as [number, number], label: 'B+', type: 'donor', color: '#16a34a' },
];

export default function MapComponent() {
  const { theme } = useTheme();

  if (typeof window === 'undefined') return null;

  const tileUrl = theme === 'dark'
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] transition-colors">
      <MapContainer
        center={[30.3753, 69.3451]}
        zoom={5}
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
              <div className="p-1">
                <span className="font-bold">{marker.label}</span>
                <span className="text-gray-500 text-sm block capitalize">{marker.type.replace('_', ' ')}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
