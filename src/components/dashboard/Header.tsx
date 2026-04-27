"use client";

import React from "react";
import { Search, Bell, Sun } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 shrink-0 border-b border-[color:var(--adm-border)] bg-[var(--adm-bg)] flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left side: Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-[var(--adm-fg-dim)]" strokeWidth={2} />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-transparent bg-[var(--adm-surface-2)] py-2.5 pl-10 pr-4 text-[14px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-dim)] focus:bg-transparent focus:border-[color:var(--adm-border)] focus:outline-none transition-all duration-200"
            placeholder="Search donors, requests, users..."
          />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2 ml-4">
        <button className="p-2.5 text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] rounded-xl transition-all duration-200">
          <Sun size={20} strokeWidth={1.5} />
        </button>

        <button className="p-2.5 text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] rounded-xl transition-all duration-200 relative">
          <Bell size={20} strokeWidth={1.5} />
          <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-[var(--adm-bg)]">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
