"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, change, positive, icon }: StatCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border p-6 bg-[var(--adm-surface)] border-[color:var(--adm-border)] transition-transform hover:-translate-y-0.5 cursor-default shadow-sm">
      {/* Top row: icon + change */}
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-lg bg-red-600/15 text-red-500 flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-green-500" : "text-red-500"}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>

      {/* Value + label */}
      <div>
        <div className="text-[var(--adm-fg)] text-[32px] font-bold tracking-tight">
          {value}
        </div>
        <div className="text-[var(--adm-fg-dim)] text-[13px] mt-1 font-medium">
          {title}
        </div>
      </div>
    </div>
  );
}
