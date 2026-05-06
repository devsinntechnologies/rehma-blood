"use client";

import React from 'react';
import { MapFilters } from './MapFilters';
import { useMapOverview } from '@/hooks/useMapOverview';

export default function LiveMapSidebar() {
  const {
    donors,
    requests,
    filters,
    setBloodGroupFilter,
    setRadiusFilter,
  } = useMapOverview();

  const safeRequests = requests ?? [];
  const safeDonors = donors ?? [];

  return (
    <div className="w-[280px] shrink-0 bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl p-5 flex flex-col h-full overflow-y-auto custom-scrollbar shadow-lg transition-colors space-y-5">
      {/* Legend */}
      <div>
        <h3 className="text-[11px] text-[var(--adm-fg-dim)] font-bold uppercase tracking-widest mb-5">Legend</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="text-[12.5px] text-[var(--adm-fg-muted)] font-medium">Active Donor</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            <span className="text-[12.5px] text-[var(--adm-fg-muted)] font-medium">Critical Request</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f97316] shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
            <span className="text-[12.5px] text-[var(--adm-fg-muted)] font-medium">High Priority</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
            <span className="text-[12.5px] text-[var(--adm-fg-muted)] font-medium">Normal Request</span>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-[var(--adm-border)]" />

      {/* Filters */}
      <MapFilters
        bloodGroup={filters.bloodGroup}
        radiusKm={filters.radiusKm}
        onBloodGroupChange={setBloodGroupFilter}
        onRadiusChange={setRadiusFilter}
      />

      <div className="h-[1px] bg-[var(--adm-border)]" />

      {/* Open Requests */}
      {safeRequests.length > 0 && (
        <div>
          <h3 className="text-[11px] text-[var(--adm-fg-dim)] font-bold uppercase tracking-widest mb-5">
            Open Requests ({safeRequests.length})
          </h3>
          <div className="flex flex-col gap-3">
            {safeRequests.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] p-2.5 rounded-xl hover:border-[var(--adm-fg-faint)] transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-[12px] font-bold text-[var(--adm-fg)]">{request.requesterName}</span>
                  <span className="text-[10px] text-[var(--adm-fg-dim)] font-medium">
                    {request.urgency}
                  </span>
                </div>
                <div className="blood-badge h-5 px-1.5 text-[9px]">
                  {request.bloodGroup}
                </div>
              </div>
            ))}
            {safeRequests.length > 5 && (
              <p className="text-xs text-[var(--adm-fg-dim)] text-center py-2">
                +{safeRequests.length - 5} more requests
              </p>
            )}
          </div>
        </div>
      )}

      {/* No Requests Message */}
      {safeRequests.length === 0 && (
        <div className="bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-lg p-4 text-center">
          <p className="text-xs text-[var(--adm-fg-dim)]">No blood requests in this area</p>
        </div>
      )}

      <div className="h-[1px] bg-[var(--adm-border)]" />

      {/* Available Donors */}
      {safeDonors.length > 0 && (
        <div>
          <h3 className="text-[11px] text-[var(--adm-fg-dim)] font-bold uppercase tracking-widest mb-5">
            Available Donors ({safeDonors.length})
          </h3>
          <div className="flex flex-col gap-3">
            {safeDonors.slice(0, 5).map((donor) => (
              <div
                key={donor.id}
                className="flex items-center justify-between bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] p-2.5 rounded-xl hover:border-[var(--adm-fg-faint)] transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-[12px] font-bold text-[var(--adm-fg)]">{donor.fullName}</span>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--adm-fg-dim)]">
                    <span>{donor.city}</span>
                    {donor.distanceKm !== undefined && (
                      <>
                        <span>•</span>
                        <span>{donor.distanceKm.toFixed(1)} km</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="blood-badge h-5 px-1.5 text-[9px]">
                  {donor.bloodGroup}
                </div>
              </div>
            ))}
            {safeDonors.length > 5 && (
              <p className="text-xs text-[var(--adm-fg-dim)] text-center py-2">
                +{safeDonors.length - 5} more donors
              </p>
            )}
          </div>
        </div>
      )}

      {/* No Donors Message */}
      {safeDonors.length === 0 && (
        <div className="bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-lg p-4 text-center">
          <p className="text-xs text-[var(--adm-fg-dim)]">No available donors in this area</p>
        </div>
      )}
    </div>
  );
}
