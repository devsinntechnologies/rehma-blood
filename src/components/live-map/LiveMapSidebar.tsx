import React from 'react';

export default function LiveMapSidebar() {
  return (
    <div className="w-[230px] shrink-0 bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl p-5 flex flex-col h-full overflow-y-auto custom-scrollbar shadow-lg transition-colors">
      
      <div className="mb-8">
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

      <div className="h-[1px] bg-[var(--adm-border)] mb-8" />

      <div>
        <h3 className="text-[11px] text-[var(--adm-fg-dim)] font-bold uppercase tracking-widest mb-5">Open requests</h3>
        <div className="flex flex-col gap-3">
          
          <div className="flex items-center justify-between bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] p-2.5 rounded-xl hover:border-[var(--adm-fg-faint)] transition-all cursor-pointer group shadow-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-bold text-[var(--adm-fg)]">Kamran Shah</span>
              <span className="text-[10px] text-[var(--adm-fg-dim)] font-medium">Karachi</span>
            </div>
            <div className="blood-badge h-5 px-1.5 text-[9px]">
              O-
            </div>
          </div>

          <div className="flex items-center justify-between bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] p-2.5 rounded-xl hover:border-[var(--adm-fg-faint)] transition-all cursor-pointer group shadow-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-bold text-[var(--adm-fg)]">Hina Aslam</span>
              <span className="text-[10px] text-[var(--adm-fg-dim)] font-medium">Karachi</span>
            </div>
            <div className="blood-badge h-5 px-1.5 text-[9px]">
              AB-
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
