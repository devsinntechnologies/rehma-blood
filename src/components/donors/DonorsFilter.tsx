"use client"

import React from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { AVAILABILITY_STATUSES } from '@/store/donorsSlice';

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export type DonorFilters = {
  query: string;
  bloodGroup: string;
  availability: string;
  accountStatus: string;
};

export const EMPTY_DONOR_FILTERS: DonorFilters = { query: '', bloodGroup: '', availability: '', accountStatus: '' };

const selectClass =
  "appearance-none bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-xl pl-4 pr-10 py-2.5 text-[14px] text-[var(--adm-fg)] font-semibold focus:outline-none focus:border-[var(--adm-accent)] transition-all cursor-pointer w-full";

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative md:min-w-[150px]">
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[var(--adm-surface)]">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--adm-fg-dim)] pointer-events-none" size={16} strokeWidth={2.5} />
    </div>
  );
}

export default function DonorsFilter({
  filters,
  onChange,
  count,
  total,
}: {
  filters: DonorFilters;
  onChange: (filters: DonorFilters) => void;
  count: number;
  total: number;
}) {
  const set = (patch: Partial<DonorFilters>) => onChange({ ...filters, ...patch });
  const isFiltered = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl p-4 shadow-sm transition-colors">
      <div className="relative flex-1 md:max-w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-fg-faint)]" size={16} />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="Search name, phone, email, city, ID..."
          aria-label="Search donors"
          className="w-full bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-xl pl-9 pr-4 py-2.5 text-[14px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:outline-none focus:border-[var(--adm-accent)] transition-all"
        />
      </div>

      <FilterSelect
        label="Blood group"
        value={filters.bloodGroup}
        onChange={(bloodGroup) => set({ bloodGroup })}
        options={[{ value: '', label: 'All groups' }, ...BLOOD_GROUPS.map((group) => ({ value: group, label: group }))]}
      />
      <FilterSelect
        label="Availability"
        value={filters.availability}
        onChange={(availability) => set({ availability })}
        options={[{ value: '', label: 'Any availability' }, ...AVAILABILITY_STATUSES.map((status) => ({ value: status, label: status }))]}
      />
      <FilterSelect
        label="Account status"
        value={filters.accountStatus}
        onChange={(accountStatus) => set({ accountStatus })}
        options={[
          { value: '', label: 'Active & inactive' },
          { value: 'active', label: 'Active only' },
          { value: 'inactive', label: 'Inactive only' },
        ]}
      />

      {isFiltered && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_DONOR_FILTERS)}
          className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] px-3 py-2 rounded-xl hover:bg-[var(--adm-hover)] transition-all"
        >
          <X size={14} /> Clear
        </button>
      )}

      <div className="flex-1" />

      <div className="text-[13px] font-bold text-[var(--adm-fg-dim)] bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] px-4 py-2 rounded-xl shadow-sm whitespace-nowrap">
        {count === total ? `${total} donors` : `${count} of ${total} donors`}
      </div>
    </div>
  );
}
