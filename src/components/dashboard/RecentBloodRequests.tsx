"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useActiveBloodRequests } from "@/hooks/useActiveBloodRequests";

export default function RecentBloodRequests() {
  const {
    activeItems,
    urgentItems,
    activeStatus,
    urgentStatus,
    activeError,
    urgentError,
    loadUrgentRequests,
  } = useActiveBloodRequests();
  const [showUrgentOnly, setShowUrgentOnly] = React.useState(false);
  const safeActiveItems = activeItems ?? [];
  const safeUrgentItems = urgentItems ?? [];
  const safeActiveStatus = activeStatus ?? "idle";
  const safeUrgentStatus = urgentStatus ?? "idle";
  const safeActiveError = activeError ?? null;
  const safeUrgentError = urgentError ?? null;
  const visibleItems = showUrgentOnly ? safeUrgentItems : safeActiveItems;
  const visibleStatus = showUrgentOnly ? safeUrgentStatus : safeActiveStatus;
  const visibleError = showUrgentOnly ? safeUrgentError : safeActiveError;

  const formatUrgency = (urgency: string) => {
    const normalized = urgency.toLowerCase();
    if (normalized === "urgent") {
      return "Critical";
    }
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  return (
    <div className="flex flex-col rounded-xl border p-5 bg-[var(--adm-surface)] border-[color:var(--adm-border)] h-full shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[var(--adm-fg)] text-[17px] font-semibold">Recent Blood Requests</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!showUrgentOnly && safeUrgentStatus === "idle") {
                loadUrgentRequests();
              }
              setShowUrgentOnly((prev) => !prev);
            }}
            className={`text-xs font-medium px-2 py-1 rounded-md border transition-colors ${showUrgentOnly
              ? "bg-red-500 text-white border-red-500"
              : "text-[var(--adm-fg-dim)] bg-[var(--adm-surface-2)] border-[color:var(--adm-border)]"
              }`}
          >
            {showUrgentOnly ? "Show All" : "Urgent Only"}
          </button>
          <span className="text-xs text-[var(--adm-fg-dim)] font-medium bg-[var(--adm-surface-2)] px-2 py-1 rounded-md border border-[color:var(--adm-border)]">
            {visibleItems.length} total
          </span>
        </div>
      </div>

      {(visibleStatus === "loading" || visibleStatus === "idle") && (
        <div className="text-sm text-[var(--adm-fg-dim)] flex items-center gap-2 py-4">
          <Loader2 size={14} className="animate-spin" /> Loading requests...
        </div>
      )}

      {visibleStatus === "failed" && (
        <div className="text-sm text-red-500 py-4">{visibleError ?? "Unable to load recent blood requests."}</div>
      )}

      {visibleStatus === "succeeded" && visibleItems.length === 0 && (
        <div className="text-sm text-[var(--adm-fg-dim)] py-4">No active blood requests.</div>
      )}

      {/* List */}
      {visibleStatus === "succeeded" && visibleItems.length > 0 && (
      <div className="space-y-3">
        {visibleItems.map((req) => {
          const urgencyLabel = formatUrgency(req.urgency);
          let badgeClass = "bg-blue-500/10 text-blue-600 border-blue-500/20"; // Normal
          if (urgencyLabel === "Critical") badgeClass = "bg-red-500 text-white shadow-sm";
          if (urgencyLabel === "High") badgeClass = "bg-orange-500 text-white shadow-sm";

          return (
            <div
              key={req.id}
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] hover:border-[var(--adm-fg-faint)] transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="blood-badge h-12 w-12 shrink-0 rounded-xl text-lg font-bold">
                  {req.bloodGroup}
                </div>
                <div>
                  <div className="text-[var(--adm-fg)] text-[15px] font-semibold mb-0.5">{req.requesterName}</div>
                  <div className="text-[var(--adm-fg-dim)] text-[12px] font-medium">{req.status.toUpperCase()} · {req.requiredUnits} unit(s)</div>
                </div>
              </div>
              <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-[11px] font-bold w-fit whitespace-nowrap shrink-0 border ${badgeClass}`}>
                {urgencyLabel}
              </span>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
