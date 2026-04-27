import React from 'react';
import { Filter } from 'lucide-react';

export default function LiveMapFilters() {
  const layers = ['All', 'Donors', 'Requests'];
  const bloodGroups = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl px-5 py-3 flex items-center gap-8 overflow-x-auto custom-scrollbar shadow-sm transition-colors">
      
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[13px] text-[var(--adm-fg-dim)]">
          <Filter size={14} /> Layer:
        </div>
        <div className="flex items-center gap-1">
          {layers.map((layer) => (
            <button 
              key={layer}
              className={`px-3 py-1 rounded-md text-[13px] font-medium transition-all ${
                layer === 'All' 
                  ? 'bg-[#dc2626] text-white shadow-lg shadow-red-500/20' 
                  : 'text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)]'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      <div className="h-5 w-[1px] bg-[var(--adm-border)] shrink-0" />

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-[13px] text-[var(--adm-fg-dim)]">
          Blood group:
        </div>
        <div className="flex items-center gap-1">
          {bloodGroups.map((bg) => (
            <button 
              key={bg}
              className={`px-3 py-1 rounded-md text-[13px] font-medium transition-all ${
                bg === 'All' 
                  ? 'bg-[#dc2626] text-white shadow-lg shadow-red-500/20' 
                  : 'border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)]'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
