"use client";

import React from "react";
import { X, MapPin, Mail, Droplets, BadgeCheck } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTheme } from "@/context/ThemeContext";
import type { Donor } from "@/store/donorsSlice";

const createDonorIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `
      <div style="width: 28px; height: 28px; border-radius: 50%; background: ${color}; border: 3px solid #fff; box-shadow: 0 8px 18px rgba(0,0,0,0.24);"></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

export default function DonorLocationModal({ donor, onClose }: { donor: Donor | null; onClose: () => void }) {
  const { theme } = useTheme();

  if (!donor || donor.latitude == null || donor.longitude == null) {
    return null;
  }

  const tileUrl = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-[color:var(--adm-border)] bg-[var(--adm-surface)] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--adm-border)] p-6 md:p-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--adm-fg-dim)]">Donor Location</p>
            <h2 className="mt-2 text-[24px] font-bold text-[var(--adm-fg)]">{donor.fullName}</h2>
            <p className="mt-1 text-[14px] text-[var(--adm-fg-dim)]">{donor.bloodGroup} donor · {donor.claimStatus}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--adm-fg-dim)] transition-colors hover:bg-[var(--adm-hover)] hover:text-[var(--adm-fg)]"
            aria-label="Close donor location dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
          <div className="border-b border-[color:var(--adm-border)] p-6 md:p-7 lg:border-b-0 lg:border-r">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--adm-fg-dim)]">
                  <BadgeCheck size={14} /> Profile
                </div>
                <div className="mt-3 space-y-2 text-[14px] text-[var(--adm-fg)]">
                  <p className="font-semibold">{donor.email}</p>
                  <p>{donor.phone}</p>
                  <p>{donor.promoCode}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--adm-fg-dim)]">
                  <Droplets size={14} /> Availability
                </div>
                <div className="mt-3 space-y-2 text-[14px] text-[var(--adm-fg)]">
                  <p>{donor.isActive ? "Active" : "Inactive"}</p>
                  <p>{donor.isAvailable ? "Available" : "Unavailable"}</p>
                  <p>{donor.isClaimed ? "Claimed" : "Not claimed"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--adm-fg-dim)]">
                  <MapPin size={14} /> Coordinates
                </div>
                <div className="mt-3 space-y-2 text-[14px] text-[var(--adm-fg)]">
                  <p>Latitude: {donor.latitude.toFixed(6)}</p>
                  <p>Longitude: {donor.longitude.toFixed(6)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--adm-fg-dim)]">
                  <Mail size={14} /> Meta
                </div>
                <div className="mt-3 space-y-2 text-[14px] text-[var(--adm-fg)]">
                  <p>Created: {new Date(donor.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(donor.updatedAt).toLocaleDateString()}</p>
                  <p>Linked user: {donor.linkedUserId ?? "None"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-[420px] p-4 md:p-5">
            <div className="h-full overflow-hidden rounded-[22px] border border-[color:var(--adm-border)]">
              <MapContainer
                center={[donor.latitude, donor.longitude]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%", background: theme === "dark" ? "#0a0a0a" : "#f0f0f0" }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url={tileUrl}
                  subdomains={['a', 'b', 'c', 'd']}
                />
                <Marker
                  position={[donor.latitude, donor.longitude]}
                  icon={createDonorIcon("#dc2626")}
                >
                  <Popup>
                    <div className="p-1">
                      <div className="font-bold">{donor.fullName}</div>
                      <div className="text-sm text-gray-500">{donor.bloodGroup} · {donor.phone}</div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}