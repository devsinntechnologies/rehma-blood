"use client";

import React from "react";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 shrink-0 border-b border-[color:var(--adm-border)] bg-[var(--adm-bg)] flex items-center justify-between px-5 sticky top-0 z-10 transition-colors duration-200">
      
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search
            size={15}
            className="absolute left-3 text-[var(--adm-fg-dim)] pointer-events-none"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search donors, requests, users..."
            className="w-full rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] py-2 pl-9 pr-4 text-[13px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-dim)] focus:outline-none focus:border-[color:var(--adm-border)] transition-all"
          />
        </div>
      </div>

      {/* Right: Theme Toggle + Notifications */}
      <div className="flex items-center gap-1 ml-4">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-lg text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] transition-all duration-200"
        >
          {theme === "dark" ? (
            <Sun size={18} strokeWidth={1.8} />
          ) : (
            <Moon size={18} strokeWidth={1.8} />
          )}
        </button>

        {/* Notifications Bell */}
        <button className="relative p-2 rounded-lg text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] transition-all duration-200">
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#dc2626] text-[9px] font-bold text-white">
            3
          </span>
        </button>

      </div>
    </header>
  );
}
