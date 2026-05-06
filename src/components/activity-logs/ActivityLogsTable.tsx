"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import type { ActivityLog } from "@/store/activityLogsSlice";

type ActivityLogsTableProps = {
  items: ActivityLog[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  onRowClick: (logId: number) => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const formatDuration = (value: number) => `${value} ms`;

const methodBadgeClass = (method: string) => {
  const normalized = method.toUpperCase();
  if (normalized === "GET") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (normalized === "POST") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (normalized === "PATCH" || normalized === "PUT") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  if (normalized === "DELETE") return "bg-red-500/10 text-red-600 border-red-500/20";
  return "bg-slate-500/10 text-slate-600 border-slate-500/20";
};

export default function ActivityLogsTable({ items, status, error, onRowClick }: ActivityLogsTableProps) {
  return (
    <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl overflow-hidden shadow-sm">
      {(status === "loading" || status === "idle") && (
        <div className="p-6 text-sm text-[var(--adm-fg-dim)] flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Loading activity logs...
        </div>
      )}

      {status === "failed" && (
        <div className="p-6 text-sm text-red-500">{error ?? "Unable to load activity logs."}</div>
      )}

      {status === "succeeded" && items.length === 0 && (
        <div className="p-6 text-sm text-[var(--adm-fg-dim)]">No activity logs found for these filters.</div>
      )}

      {status === "succeeded" && items.length > 0 && (
        <>
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--adm-border)] bg-[var(--adm-surface-2)]/50">
                  {[
                    "Time",
                    "Method",
                    "Endpoint",
                    "User",
                    "Status",
                    "Duration",
                    "IP",
                    "Error",
                  ].map((column) => (
                    <th key={column} className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--adm-fg-dim)]">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-[color:var(--adm-border)] hover:bg-[var(--adm-hover)] transition-colors ${index === items.length - 1 ? "border-b-0" : ""} cursor-pointer`}
                    onClick={() => onRowClick(row.id)}
                  >
                    <td className="px-5 py-4 text-[13px] text-[var(--adm-fg)] whitespace-nowrap">{formatDate(row.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${methodBadgeClass(row.method)}`}>
                        {row.method}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-[var(--adm-fg)] font-medium max-w-[280px] truncate">
                      {row.endpoint}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-[var(--adm-fg-dim)]">
                      <div className="font-medium text-[var(--adm-fg)]">{row.userEmail ?? "System"}</div>
                      <div className="text-[11px] uppercase tracking-wider">{row.userRole ?? "-"}</div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-[var(--adm-fg)]">{row.statusCode}</td>
                    <td className="px-5 py-4 text-[13px] text-[var(--adm-fg)]">{formatDuration(row.duration)}</td>
                    <td className="px-5 py-4 text-[13px] text-[var(--adm-fg-dim)]">{row.ipAddress ?? "-"}</td>
                    <td className="px-5 py-4 text-[13px] text-[var(--adm-fg-dim)] max-w-[220px] truncate">
                      {row.errorMessage ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="xl:hidden divide-y divide-[color:var(--adm-border)]">
            {items.map((row) => (
              <button key={row.id} type="button" onClick={() => onRowClick(row.id)} className="w-full text-left p-4 space-y-3 hover:bg-[var(--adm-hover)] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--adm-fg)]">{row.endpoint}</p>
                    <p className="text-[11px] text-[var(--adm-fg-dim)] mt-1">{formatDate(row.createdAt)}</p>
                  </div>
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${methodBadgeClass(row.method)}`}>
                    {row.method}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <div className="text-[var(--adm-fg-faint)] uppercase tracking-wider">User</div>
                    <div className="text-[var(--adm-fg)] font-medium mt-1">{row.userEmail ?? "System"}</div>
                  </div>
                  <div>
                    <div className="text-[var(--adm-fg-faint)] uppercase tracking-wider">Status</div>
                    <div className="text-[var(--adm-fg)] font-medium mt-1">{row.statusCode}</div>
                  </div>
                  <div>
                    <div className="text-[var(--adm-fg-faint)] uppercase tracking-wider">Duration</div>
                    <div className="text-[var(--adm-fg)] font-medium mt-1">{formatDuration(row.duration)}</div>
                  </div>
                  <div>
                    <div className="text-[var(--adm-fg-faint)] uppercase tracking-wider">IP</div>
                    <div className="text-[var(--adm-fg)] font-medium mt-1">{row.ipAddress ?? "-"}</div>
                  </div>
                </div>

                {row.errorMessage && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-[12px] text-red-600">
                    {row.errorMessage}
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
