import React from 'react';
import { Users, HeartPulse, Droplet } from 'lucide-react';

export default function LiveMapHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-[24px] font-bold text-[var(--adm-fg)] mb-1">Live Map</h1>
        <p className="text-[14px] text-[var(--adm-fg-faint)]">
          Geographic view of donors and blood requests across Pakistan
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl flex items-center px-4 py-2.5 gap-4 shadow-sm">
          <div className="h-8 w-8 rounded-lg bg-[#064e3b20] text-[#10b981] border border-[#10b98130] flex items-center justify-center shrink-0">
            <Users size={16} />
          </div>
          <div className="flex flex-col items-start pr-2">
            <span className="text-[18px] font-bold text-[var(--adm-fg)] leading-none">12</span>
            <span className="text-[11px] text-[var(--adm-fg-dim)] mt-1 font-medium">Donors</span>
          </div>
        </div>

        <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl flex items-center px-4 py-2.5 gap-4 shadow-sm">
          <div className="h-8 w-8 rounded-lg bg-[#450a0a20] text-[#ef4444] border border-[#ef444430] flex items-center justify-center shrink-0">
            <HeartPulse size={16} />
          </div>
          <div className="flex flex-col items-start pr-2">
            <span className="text-[18px] font-bold text-[var(--adm-fg)] leading-none">6</span>
            <span className="text-[11px] text-[var(--adm-fg-dim)] mt-1 font-medium">Requests</span>
          </div>
        </div>

        <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl flex items-center px-4 py-2.5 gap-4 shadow-sm">
          <div className="h-8 w-8 rounded-lg bg-[#42200620] text-[#f97316] border border-[#f9731630] flex items-center justify-center shrink-0">
            <Droplet size={16} />
          </div>
          <div className="flex flex-col items-start pr-2">
            <span className="text-[18px] font-bold text-[var(--adm-fg)] leading-none">2</span>
            <span className="text-[11px] text-[var(--adm-fg-dim)] mt-1 font-medium">Open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
