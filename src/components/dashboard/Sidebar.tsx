"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Map,
  Droplets,
  MessageSquare,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Donors", href: "/donors", icon: Droplets },
  { label: "Blood Requests", href: "/blood-requests", icon: HeartHandshake },
  { label: "Live Map", href: "/live-map", icon: Map },
  { label: "Donations", href: "/donations", icon: Users },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Sub-Admins", href: "/sub-admins", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="w-64 shrink-0 border-r border-[color:var(--adm-border)] bg-[var(--adm-surface)] flex flex-col h-screen overflow-hidden">
      {/* Logo Section */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-[color:var(--adm-border)]">
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10">
          <Image
            src="/logo.png"
            alt="BloodBridge"
            width={32}
            height={32}
            className="w-full h-full object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <div>
          <div className="text-[var(--adm-fg)] text-sm font-semibold leading-tight">Blood Bridge</div>
          <div className="text-[11px] text-[var(--adm-fg-dim)] mt-0.5">Admin Portal</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all border ${isActive
                ? "bg-[var(--adm-accent-soft-bg)] text-[var(--adm-accent-soft-fg)] border-[var(--adm-accent-soft-border)] font-medium"
                : "text-[var(--adm-fg-dim)] border-transparent hover:bg-[var(--adm-hover)] hover:text-[var(--adm-fg)] font-normal"
                }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-[var(--adm-accent-soft-fg)]" : ""} />
              <span className="text-[14px]">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-[color:var(--adm-border)]">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-red-600 text-white items-center justify-center font-medium text-sm">
            SA
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-[var(--adm-fg)] truncate">Sarah Ahmad</div>
            <div className="text-xs text-[var(--adm-fg-dim)] truncate mt-0.5">Super Admin</div>
          </div>
        </div>
        <button className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--adm-fg-dim)] hover:bg-[var(--adm-hover)] hover:text-[var(--adm-fg)] transition-colors">
          <LogOut size={16} strokeWidth={1.5} />
          <span className="text-sm">Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-3.5 left-3.5 z-50 p-2 rounded-lg bg-[var(--adm-surface-2)] text-[var(--adm-fg)] border border-[color:var(--adm-border)]"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Hide scrollbar styles via a quick style block just for the sidebar */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </>
  );
}
