import React from 'react';
import { Search } from 'lucide-react';

export default function BloodRequestsFilter({ activeTab, setActiveTab, searchQuery, setSearchQuery, resultsCount }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex p-1 border border-[color:var(--adm-border)] rounded-lg bg-transparent">
        {['All', 'Open', 'Matched', 'Fulfilled', 'Cancelled'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-[14px] font-medium rounded-md transition-colors ${tab === activeTab ? 'bg-[#ff0000] text-white' : 'text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative flex-1 max-w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-fg-faint)]" size={16} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patient or hospital..."
          className="w-full bg-[var(--adm-bg)] border border-[color:var(--adm-border)] rounded-lg pl-9 pr-4 py-2 text-[14px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:outline-none focus:border-[var(--adm-accent-soft-border)]"
        />
      </div>

      <div className="flex-1" />

      <div className="text-[14px] text-[var(--adm-fg-dim)] px-2">
        {resultsCount} result{resultsCount !== 1 && 's'}
      </div>
    </div>
  );
}
