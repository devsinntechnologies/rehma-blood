import React from 'react';
import { Users, HeartPulse, Siren } from 'lucide-react';
import type { MapOverview } from '@/hooks/useMapOverview';
import { isUrgent } from '@/lib/requestStatus';

function Stat({ icon, value, label, tone }: { icon: React.ReactNode; value: number | string; label: string; tone: string }) {
  return (
    <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl flex items-center px-4 py-2.5 gap-4 shadow-sm">
      <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${tone}`}>{icon}</div>
      <div className="flex flex-col items-start pr-2">
        <span className="text-[18px] font-bold text-[var(--adm-fg)] leading-none">{value}</span>
        <span className="text-[11px] text-[var(--adm-fg-dim)] mt-1 font-medium">{label}</span>
      </div>
    </div>
  );
}

export default function LiveMapHeader({ map }: { map: MapOverview }) {
  const loaded = map.status === 'succeeded';
  const urgent = map.requests.filter((request) => isUrgent(request.urgency)).length;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-[24px] font-bold text-[var(--adm-fg)] mb-1">Live Map</h1>
        <p className="text-[14px] text-[var(--adm-fg-faint)]">
          {map.centeredOnAdmin
            ? `Available donors and open requests within ${map.filters.radiusKm} km of you`
            : 'Available donors and open blood requests across Pakistan'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Stat icon={<Users size={16} />} value={loaded ? map.donors.length : '—'} label="Available donors" tone="bg-[#064e3b20] text-[#10b981] border-[#10b98130]" />
        <Stat icon={<HeartPulse size={16} />} value={loaded ? map.requests.length : '—'} label="Open requests" tone="bg-[#1e3a8a20] text-[#3b82f6] border-[#3b82f630]" />
        <Stat icon={<Siren size={16} />} value={loaded ? urgent : '—'} label="Urgent" tone="bg-[#450a0a20] text-[#ef4444] border-[#ef444430]" />
      </div>
    </div>
  );
}
