"use client";

import React from "react";
import type { ActivityLogsStatistics } from "@/store/activityLogsSlice";

type ActivityLogsStatisticsViewProps = {
  statistics: ActivityLogsStatistics | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const formatAverage = (value: number) => `${value.toFixed(2)} ms`;

export default function ActivityLogsStatisticsView({ statistics, status, error }: ActivityLogsStatisticsViewProps) {
  if (status === "loading" || status === "idle") {
    return <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] p-6 text-sm text-[var(--adm-fg-dim)]">Loading statistics...</div>;
  }

  if (status === "failed") {
    return <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-600">{error ?? "Unable to load statistics."}</div>;
  }

  if (!statistics) {
    return <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] p-6 text-sm text-[var(--adm-fg-dim)]">No statistics available.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Requests" value={String(statistics.totalRequests)} />
        <StatCard label="Average Response" value={formatAverage(statistics.avgResponseTime)} />
        <StatCard label="Methods Tracked" value={String(statistics.requestsByMethod.length)} />
        <StatCard label="Status Buckets" value={String(statistics.requestsByStatus.length)} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section title="Requests by Method">
          <div className="space-y-3">
            {statistics.requestsByMethod.map((item) => (
              <BarRow key={item.method} label={item.method} value={item.count} total={statistics.totalRequests} />
            ))}
          </div>
        </Section>

        <Section title="Requests by Status">
          <div className="space-y-3">
            {statistics.requestsByStatus.map((item) => (
              <BarRow key={item.statusCode} label={String(item.statusCode)} value={item.count} total={statistics.totalRequests} />
            ))}
          </div>
        </Section>

        <Section title="Top Endpoints" className="xl:col-span-2">
          <div className="space-y-3">
            {statistics.topEndpoints.map((item) => (
              <BarRow key={item.endpoint} label={item.endpoint} value={item.count} total={statistics.totalRequests} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] p-5 shadow-sm">
      <div className="text-[12px] uppercase tracking-wider text-[var(--adm-fg-faint)] font-semibold">{label}</div>
      <div className="mt-2 text-[26px] font-bold text-[var(--adm-fg)]">{value}</div>
    </div>
  );
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] p-5 shadow-sm ${className}`}>
      <h3 className="text-[16px] font-semibold text-[var(--adm-fg)]">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function BarRow({ label, value, total }: { label: string; value: number; total: number }) {
  const width = total > 0 ? Math.max(4, (value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-[var(--adm-fg)] break-all">{label}</span>
        <span className="text-[var(--adm-fg-dim)]">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--adm-surface-2)] overflow-hidden">
        <div className="h-full rounded-full bg-[var(--adm-accent)]" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}