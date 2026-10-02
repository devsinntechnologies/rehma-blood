"use client";

import React from 'react';
import { Globe2, LocateFixed } from 'lucide-react';
import type { MapOverview } from '@/hooks/useMapOverview';
import { ALL_AREAS_RADIUS_KM } from '@/store/mapSlice';
import { formatUrgency, isUrgent } from '@/lib/requestStatus';

const RADIUS_OPTIONS = [10, 25, 50, 100, 250];

const sectionTitle = 'text-[11px] text-[var(--adm-fg-dim)] font-bold uppercase tracking-widest mb-4';
const listItem =
  'flex items-center justify-between gap-2 bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] p-2.5 rounded-xl shadow-sm';

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-lg p-4 text-center">
      <p className="text-xs text-[var(--adm-fg-dim)]">{children}</p>
    </div>
  );
}

export default function LiveMapSidebar({ map }: { map: MapOverview }) {
  const { donors, requests, filters, centeredOnAdmin } = map;
  const showDonors = filters.layer !== 'requests';
  const showRequests = filters.layer !== 'donors';

  return (
    <div className="w-full lg:w-[280px] shrink-0 bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl p-5 flex flex-col lg:h-full overflow-y-auto custom-scrollbar shadow-lg transition-colors space-y-5">
      <div>
        <h3 className={sectionTitle}>Legend</h3>
        <div className="flex flex-col gap-3">
          {[
            ['#16a34a', 'Available donor'],
            ['#dc2626', 'Urgent request'],
            ['#3b82f6', 'Normal request'],
          ].map(([color, label]) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[12.5px] text-[var(--adm-fg-muted)] font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-[var(--adm-border)]" />

      <div>
        <h3 className={sectionTitle}>Area</h3>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={map.showAllAreas}
              aria-pressed={!centeredOnAdmin}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[12px] font-semibold border transition-all ${
                !centeredOnAdmin ? 'bg-[#dc2626] border-[#dc2626] text-white' : 'border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:bg-[var(--adm-hover)]'
              }`}
            >
              <Globe2 size={13} /> All areas
            </button>
            <button
              type="button"
              onClick={map.locateMe}
              aria-pressed={centeredOnAdmin}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[12px] font-semibold border transition-all ${
                centeredOnAdmin ? 'bg-[#dc2626] border-[#dc2626] text-white' : 'border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:bg-[var(--adm-hover)]'
              }`}
            >
              <LocateFixed size={13} /> Near me
            </button>
          </div>
          {centeredOnAdmin && (
            <label className="flex items-center justify-between gap-2 text-[12px] text-[var(--adm-fg-dim)]">
              Radius
              <select
                value={filters.radiusKm === ALL_AREAS_RADIUS_KM ? '' : filters.radiusKm}
                onChange={(event) => map.setRadius(Number(event.target.value))}
                className="rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-2 py-1.5 text-[12px] font-semibold text-[var(--adm-fg)] focus:outline-none"
              >
                {RADIUS_OPTIONS.map((km) => (
                  <option key={km} value={km} className="bg-[var(--adm-surface)]">
                    {km} km
                  </option>
                ))}
              </select>
            </label>
          )}
          {map.geolocationError && <p className="text-[11px] text-amber-500">{map.geolocationError}</p>}
        </div>
      </div>

      {showRequests && (
        <>
          <div className="h-[1px] bg-[var(--adm-border)]" />
          <div>
            <h3 className={sectionTitle}>Open Requests ({requests.length})</h3>
            {requests.length === 0 ? (
              <EmptyNote>No open blood requests in this area</EmptyNote>
            ) : (
              <div className="flex flex-col gap-3">
                {requests.slice(0, 5).map((request) => (
                  <div key={request.id} className={listItem}>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[12px] font-bold text-[var(--adm-fg)] truncate">{request.requesterName ?? `Request #${request.id}`}</span>
                      <span className={`text-[10px] font-semibold ${isUrgent(request.urgency) ? 'text-red-500' : 'text-blue-500'}`}>
                        {formatUrgency(request.urgency)} · {request.requiredUnits} unit{request.requiredUnits === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="blood-badge h-5 px-1.5 text-[9px] shrink-0">{request.bloodGroup}</div>
                  </div>
                ))}
                {requests.length > 5 && <p className="text-xs text-[var(--adm-fg-dim)] text-center py-1">+{requests.length - 5} more on the map</p>}
              </div>
            )}
          </div>
        </>
      )}

      {showDonors && (
        <>
          <div className="h-[1px] bg-[var(--adm-border)]" />
          <div>
            <h3 className={sectionTitle}>Available Donors ({donors.length})</h3>
            {donors.length === 0 ? (
              <EmptyNote>No available donors in this area</EmptyNote>
            ) : (
              <div className="flex flex-col gap-3">
                {donors.slice(0, 5).map((donor) => (
                  <div key={donor.id} className={listItem}>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[12px] font-bold text-[var(--adm-fg)] truncate">{donor.fullName}</span>
                      <span className="text-[10px] text-[var(--adm-fg-dim)] truncate">
                        {[donor.city, centeredOnAdmin && Number.isFinite(donor.distanceKm) ? `${donor.distanceKm.toFixed(1)} km away` : null]
                          .filter(Boolean)
                          .join(' • ') || 'Location shared'}
                      </span>
                    </div>
                    <div className="blood-badge h-5 px-1.5 text-[9px] shrink-0">{donor.bloodGroup}</div>
                  </div>
                ))}
                {donors.length > 5 && <p className="text-xs text-[var(--adm-fg-dim)] text-center py-1">+{donors.length - 5} more on the map</p>}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
