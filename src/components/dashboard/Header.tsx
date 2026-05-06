"use client";

import React from "react";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import NotificationsMenu from "@/components/dashboard/NotificationsMenu";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 shrink-0 border-b border-[color:var(--adm-border)] bg-[var(--adm-bg)] flex items-center justify-between px-4 pl-14 lg:pl-5 sticky top-0 z-10 transition-colors duration-200">
      
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search
            size={14}
            className="absolute left-3 text-[var(--adm-fg-dim)] pointer-events-none"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search donors, requests..."
            className="w-full rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] py-1.5 lg:py-2 pl-9 pr-4 text-[13px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-dim)] focus:outline-none focus:border-[color:var(--adm-border)] transition-all truncate"
          />
        </div>
      </div>

      {/* Right: Theme Toggle + Notifications */}
      <div className="flex items-center gap-1 ml-2 lg:ml-4">
        
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

        {/* Notifications */}
        <NotificationsMenu />

      </div>
    </header>
  );
}
