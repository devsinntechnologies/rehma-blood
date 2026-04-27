import React from 'react';
import { Plus } from 'lucide-react';

export default function DonorsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--adm-fg)]">Donors</h1>
        <p className="text-[13px] text-[var(--adm-fg-dim)] mt-1">Manage registered blood donors</p>
      </div>
      <button className="flex items-center gap-2 bg-[#dc2626] hover:bg-red-700 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-red-500/10">
        <Plus size={18} strokeWidth={2.5} />
        Add Donor
      </button>
    </div>
  );
}
