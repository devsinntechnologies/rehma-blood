"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ActiveBloodRequest } from "@/store/bloodRequestsSlice";
import { formatRequestStatus, formatUrgency, isUrgent } from "@/lib/requestStatus";

const MAX_SHOWN = 5;

type Props = {
  requests: ActiveBloodRequest[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

export default function RecentBloodRequests({ requests, status, error }: Props) {
  const [urgentOnly, setUrgentOnly] = useState(false);

  // Everything that still needs attention, newest first.
  const open = useMemo(
    () =>
      requests
        .filter((request) => request.status !== "donation_completed")
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
    [requests]
  );
  const visible = urgentOnly ? open.filter((request) => isUrgent(request.urgency)) : open;

  return (
    <div className="flex flex-col rounded-xl border p-5 bg-[var(--adm-surface)] border-[color:var(--adm-border)] h-full shadow-sm transition-colors">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-[var(--adm-fg)] text-[17px] font-semibold">Requests Needing Attention</h3>
          <p className="text-[12px] text-[var(--adm-fg-dim)] mt-0.5">Open and in-progress requests</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUrgentOnly((prev) => !prev)}
            aria-pressed={urgentOnly}
            className={`text-xs font-medium px-2 py-1 rounded-md border transition-colors ${
              urgentOnly ? "bg-red-500 text-white border-red-500" : "text-[var(--adm-fg-dim)] bg-[var(--adm-surface-2)] border-[color:var(--adm-border)]"
            }`}
          >
            Urgent only
          </button>
          <span className="text-xs text-[var(--adm-fg-dim)] font-medium bg-[var(--adm-surface-2)] px-2 py-1 rounded-md border border-[color:var(--adm-border)]">
            {visible.length} total
          </span>
        </div>
      </div>

      {(status === "loading" || status === "idle") && (
        <div className="text-sm text-[var(--adm-fg-dim)] flex items-center gap-2 py-4">
          <Loader2 size={14} className="animate-spin" /> Loading requests...
        </div>
      )}

      {status === "failed" && <div className="text-sm text-red-500 py-4">{error ?? "Unable to load blood requests."}</div>}

      {status === "succeeded" && visible.length === 0 && (
        <div className="text-sm text-[var(--adm-fg-dim)] py-4">{urgentOnly ? "No urgent requests right now." : "No open blood requests."}</div>
      )}

      {status === "succeeded" && visible.length > 0 && (
        <div className="space-y-3">
          {visible.slice(0, MAX_SHOWN).map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="blood-badge h-12 w-12 shrink-0 rounded-xl text-lg font-bold">{req.bloodGroup}</div>
                <div className="min-w-0">
                  <div className="text-[var(--adm-fg)] text-[15px] font-semibold mb-0.5 truncate">{req.requesterName ?? `Request #${req.id}`}</div>
                  <div className="text-[var(--adm-fg-dim)] text-[12px] font-medium">
                    {formatRequestStatus(req.status)} · {req.requiredUnits} unit{req.requiredUnits === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-[11px] font-bold whitespace-nowrap shrink-0 border ${
                  isUrgent(req.urgency) ? "bg-red-500 text-white border-red-500" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                }`}
              >
                {formatUrgency(req.urgency)}
              </span>
            </div>
          ))}
          {visible.length > MAX_SHOWN && (
            <Link href="/admin/blood-requests" className="block text-center text-[13px] font-semibold text-[var(--adm-accent)] hover:underline pt-1">
              View all {visible.length} requests
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
