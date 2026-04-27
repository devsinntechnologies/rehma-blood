"use client"

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from '@/context/ThemeContext';

// Define the custom icon creator
const createCustomIcon = (color: string, label: string) => {
  const fontSize = label.length <= 2 ? '12' : label.length === 3 ? '10' : '8.5';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative; width: 42px; height: 52px; display: flex; justify-content: center; align-items: flex-start; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));">
        <svg viewBox="0 0 42 52" width="42" height="52" style="overflow:visible; position:absolute; top:0; left:0;">
          <circle cx="21" cy="19" r="17" fill="${color}" stroke="#ffffff" stroke-width="3.5"/>
          <rect x="14" y="32" width="14" height="5" fill="${color}"/>
          <polygon points="14,33 28,33 21,48" fill="${color}"/>
        </svg>
        <div style="position:absolute; top:10px; left:0; right:0; text-align:center; color:#ffffff; font-size:${fontSize}px; font-weight:900; letter-spacing:-0.3px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          ${label}
        </div>
      </div>
    `,
    iconSize: [42, 52],
    iconAnchor: [21, 48],
    popupAnchor: [0, -48],
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
