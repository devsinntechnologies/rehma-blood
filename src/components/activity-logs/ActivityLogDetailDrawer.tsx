"use client";

import React from "react";
import { Loader2, X } from "lucide-react";
import type { ActivityLog } from "@/store/activityLogsSlice";

type ActivityLogDetailDrawerProps = {
  open: boolean;
  log: ActivityLog | null;
  logId: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  onClose: () => void;
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));

export default function ActivityLogDetailDrawer({ open, log, logId, status, error, onClose }: ActivityLogDetailDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-[520px] flex-col border-l border-[color:var(--adm-border)] bg-[var(--adm-surface)] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--adm-border)] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--adm-fg-faint)]">Log Detail</p>
            <h2 className="mt-1 text-[18px] font-bold text-[var(--adm-fg)]">
              {log ? `${log.method} ${log.endpoint}` : logId ? `Activity log #${logId}` : "Activity log"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--adm-fg-dim)] transition-colors hover:bg-[var(--adm-hover)] hover:text-[var(--adm-fg)]"
            aria-label="Close activity log detail drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {status === "loading" && (
            <div className="flex items-center gap-2 text-sm text-[var(--adm-fg-dim)]">
              <Loader2 size={14} className="animate-spin" /> Loading log details{logId ? ` for #${logId}` : "..."}
            </div>
          )}

          {status === "failed" && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {error ?? "Unable to load activity log details."}
            </div>
          )}

          {status === "succeeded" && log && (
            <div className="space-y-4">
              <InfoCard label="Method" value={log.method} />
              <InfoCard label="Endpoint" value={log.endpoint} />
              <InfoCard label="Status Code" value={String(log.statusCode)} />
              <InfoCard label="Duration" value={`${log.duration} ms`} />
              <InfoCard label="Created At" value={formatDateTime(log.createdAt)} />
              <InfoCard label="User Email" value={log.userEmail ?? "-"} />
              <InfoCard label="User Role" value={log.userRole ?? "-"} />
              <InfoCard label="IP Address" value={log.ipAddress ?? "-"} />
              <InfoCard label="User Agent" value={log.userAgent ?? "-"} />

              <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--adm-fg-faint)]">Request Body</p>
                <pre className="mt-3 whitespace-pre-wrap break-words text-[13px] text-[var(--adm-fg)]">
                  {log.requestBody ?? "-"}
                </pre>
              </div>

              <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--adm-fg-faint)]">Response Body</p>
                <pre className="mt-3 whitespace-pre-wrap break-words text-[13px] text-[var(--adm-fg)]">
                  {log.responseBody ?? "-"}
                </pre>
              </div>

              {log.errorMessage && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
                  {log.errorMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--adm-fg-faint)]">{label}</p>
      <p className="mt-2 text-[14px] text-[var(--adm-fg)] break-words">{value}</p>
    </div>
  );
}