import React from "react";
import { Activity } from "lucide-react";
import Link from "next/link";

export default function ActivityLogsHeader() {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Activity size={18} className="text-[var(--adm-accent)]" />
          <h1 className="text-[24px] font-bold text-[var(--adm-fg)]">Activity Logs</h1>
        </div>
        <p className="text-[14px] text-[var(--adm-fg-faint)]">Audit trail for admin and system actions</p>
      </div>

      <Link
        href="/admin/activity-logs/statistics"
        className="inline-flex items-center justify-center rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-4 py-2 text-sm font-semibold text-[var(--adm-fg)] shadow-sm transition-colors hover:bg-[var(--adm-hover)]"
      >
        Logs Statistics
      </Link>
    </div>
  );
}
