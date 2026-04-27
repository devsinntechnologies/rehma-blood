import React from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';

export default function DonorsFilter() {
  return (
    <div className="flex items-center gap-3 bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl p-3">
      <div className="relative flex-1 max-w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-fg-faint)]" size={16} />
        <input 
          type="text"
          placeholder="Search by name, city, ID..."
          className="w-full bg-[var(--adm-bg)] border border-[color:var(--adm-border)] rounded-lg pl-9 pr-4 py-2 text-[14px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:outline-none focus:border-[var(--adm-accent-soft-border)]"
        />
      </div>
      
      <div className="relative">
        <select className="appearance-none bg-[var(--adm-bg)] border border-[color:var(--adm-border)] rounded-lg pl-4 pr-10 py-2 text-[14px] text-[var(--adm-fg)] font-medium focus:outline-none focus:border-[var(--adm-accent-soft-border)]">
          <option>All Groups</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>O+</option>
          <option>O-</option>
          <option>AB+</option>
          <option>AB-</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--adm-fg-faint)] pointer-events-none" size={16} />
      </div>

      <button className="flex items-center gap-2 bg-[var(--adm-bg)] border border-[color:var(--adm-border)] hover:bg-[var(--adm-hover)] text-[var(--adm-fg-dim)] px-4 py-2 rounded-lg text-[14px] font-medium transition-colors">
        <Filter size={16} />
        More Filters
      </button>

      <div className="flex-1" />

      <div className="text-[14px] text-[var(--adm-fg-dim)] px-2">
        12 donors
      </div>
    </div>
  );
}
