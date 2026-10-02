import React from 'react';
import { Filter } from 'lucide-react';
import type { MapOverview } from '@/hooks/useMapOverview';
import type { MapLayer } from '@/store/mapSlice';

const LAYERS: { value: MapLayer; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'donors', label: 'Donors' },
  { value: 'requests', label: 'Requests' },
];
const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const chip = (active: boolean) =>
  `px-3 py-1 rounded-md text-[13px] font-medium transition-all whitespace-nowrap ${
    active
      ? 'bg-[#dc2626] text-white shadow-lg shadow-red-500/20'
      : 'border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)]'
  }`;

export default function LiveMapFilters({ map }: { map: MapOverview }) {
  const { layer, bloodGroup } = map.filters;

  return (
    <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl px-5 py-3 flex items-center gap-8 overflow-x-auto custom-scrollbar shadow-sm transition-colors">
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[13px] text-[var(--adm-fg-dim)]">
          <Filter size={14} /> Layer:
        </div>
        <div className="flex items-center gap-1">
          {LAYERS.map((option) => (
            <button key={option.value} type="button" aria-pressed={layer === option.value} onClick={() => map.setLayer(option.value)} className={chip(layer === option.value)}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-5 w-[1px] bg-[var(--adm-border)] shrink-0" />

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-[13px] text-[var(--adm-fg-dim)]">Blood group:</div>
        <div className="flex items-center gap-1">
          <button type="button" aria-pressed={!bloodGroup} onClick={() => map.setBloodGroup(null)} className={chip(!bloodGroup)}>
            All
          </button>
          {BLOOD_GROUPS.map((group) => (
            <button key={group} type="button" aria-pressed={bloodGroup === group} onClick={() => map.setBloodGroup(group)} className={chip(bloodGroup === group)}>
              {group}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
