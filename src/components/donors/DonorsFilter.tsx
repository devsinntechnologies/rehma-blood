"use client"

import React from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';

export default function DonorsFilter() {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl p-4 shadow-sm transition-colors">
      <div className="relative flex-1 max-w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-fg-faint)]" size={16} />
        <input 
          type="text"
          placeholder="Search by name, city, ID..."
          className="w-full bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-xl pl-9 pr-4 py-2.5 text-[14px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:outline-none focus:border-[var(--adm-accent)] transition-all"
        />
      </div>
      
      <div className="relative">
        <select className="appearance-none bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-xl pl-4 pr-10 py-2.5 text-[14px] text-[var(--adm-fg)] font-bold focus:outline-none focus:border-[var(--adm-accent)] transition-all cursor-pointer min-w-[140px]">
          <option className="bg-[var(--adm-surface)]">All Groups</option>
          <option className="bg-[var(--adm-surface)]">A+</option>
          <option className="bg-[var(--adm-surface)]">A-</option>
          <option className="bg-[var(--adm-surface)]">B+</option>
          <option className="bg-[var(--adm-surface)]">B-</option>
          <option className="bg-[var(--adm-surface)]">O+</option>
          <option className="bg-[var(--adm-surface)]">O-</option>
          <option className="bg-[var(--adm-surface)]">AB+</option>
          <option className="bg-[var(--adm-surface)]">AB-</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--adm-fg-dim)] pointer-events-none" size={16} strokeWidth={2.5} />
      </div>

      <button className="flex items-center justify-center gap-2 bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] hover:bg-[var(--adm-hover)] text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all">
        <Filter size={16} strokeWidth={2.5} />
        More Filters
      </button>

      <div className="flex-1" />

      <div className="text-[13px] font-bold text-[var(--adm-fg-dim)] bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] px-4 py-2 rounded-xl shadow-sm">
        12 donors
      </div>
    </div>
  );
}
