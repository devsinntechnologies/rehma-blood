"use client";

import React from "react";
import { Search } from "lucide-react";

const tabs = ["All", "Active", "Donation Completed"];

export default function BloodRequestsFilter({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  resultsCount,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  resultsCount: number;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 transition-colors">
      <div className="flex p-1 border border-[color:var(--adm-border)] rounded-xl bg-[var(--adm-surface)] shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-[14px] font-bold rounded-lg transition-all ${
              tab === activeTab
                ? "bg-[var(--adm-accent)] text-white shadow-md shadow-red-500/20"
                : "text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)]"
            }`}
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
          placeholder="Search requester, contact, notes, or blood group..."
          className="w-full bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl pl-9 pr-4 py-2.5 text-[14px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:outline-none focus:border-[var(--adm-accent)] transition-all shadow-sm"
        />
      </div>

      <div className="flex-1" />

      <div className="text-[13px] font-bold text-[var(--adm-fg-dim)] bg-[var(--adm-surface)] border border-[color:var(--adm-border)] px-4 py-2 rounded-xl shadow-sm">
        {resultsCount} result{resultsCount !== 1 && 's'}
      </div>
    </div>
  );
}
