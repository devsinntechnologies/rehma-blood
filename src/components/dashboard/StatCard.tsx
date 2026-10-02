"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  detail?: string;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, detail, icon }: StatCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border p-6 bg-[var(--adm-surface)] border-[color:var(--adm-border)] transition-transform hover:-translate-y-0.5 cursor-default shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-lg bg-red-600/15 text-red-500 flex items-center justify-center">
          {icon}
        </div>
        {detail && <div className="text-xs font-medium text-[var(--adm-fg-dim)]">{detail}</div>}
      </div>

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
