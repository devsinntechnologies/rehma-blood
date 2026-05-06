"use client";

import React from "react";

export type ActivityLogsFilterValues = {
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
  method: string;
  endpoint: string;
  statusCode: string;
};

type ActivityLogsFiltersProps = {
  filters: ActivityLogsFilterValues;
  onChange: (nextFilters: ActivityLogsFilterValues) => void;
  onReset: () => void;
  total: number;
  totalPages: number;
};

const PAGE_LIMIT_OPTIONS = [10, 20, 50, 100];
const METHOD_OPTIONS = ["", "GET", "POST", "PATCH", "PUT", "DELETE"];
const STATUS_CODE_OPTIONS = ["", "200", "201", "400", "401", "403", "404", "500"];

export default function ActivityLogsFilters({ filters, onChange, onReset, total, totalPages }: ActivityLogsFiltersProps) {
  const update = (patch: Partial<ActivityLogsFilterValues>) => {
    onChange({
      ...filters,
      ...patch,
      page: patch.page ?? 1,
    });
  };

  return (
    <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--adm-fg)]">Filters</h2>
          <p className="text-[12px] text-[var(--adm-fg-faint)] mt-1">
            Total logs: {total} · Total pages: {totalPages || 0}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-2 rounded-lg border border-[color:var(--adm-border)] text-[13px] font-semibold text-[var(--adm-fg-dim)] hover:bg-[var(--adm-hover)] hover:text-[var(--adm-fg)] transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <label className="space-y-2">
          <span className="text-xs font-semibold text-[var(--adm-fg-dim)] uppercase tracking-wider">Start Date</span>
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => update({ startDate: event.target.value })}
            className="w-full rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-3 py-2.5 text-sm text-[var(--adm-fg)] focus:outline-none focus:border-[var(--adm-accent)]"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold text-[var(--adm-fg-dim)] uppercase tracking-wider">End Date</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => update({ endDate: event.target.value })}
            className="w-full rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-3 py-2.5 text-sm text-[var(--adm-fg)] focus:outline-none focus:border-[var(--adm-accent)]"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold text-[var(--adm-fg-dim)] uppercase tracking-wider">Method</span>
          <select
            value={filters.method}
            onChange={(event) => update({ method: event.target.value })}
            className="w-full rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-3 py-2.5 text-sm text-[var(--adm-fg)] focus:outline-none focus:border-[var(--adm-accent)]"
          >
            {METHOD_OPTIONS.map((method) => (
              <option key={method || "all-methods"} value={method}>
                {method || "All Methods"}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold text-[var(--adm-fg-dim)] uppercase tracking-wider">Endpoint</span>
          <input
            value={filters.endpoint}
            onChange={(event) => update({ endpoint: event.target.value })}
            className="w-full rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-3 py-2.5 text-sm text-[var(--adm-fg)] focus:outline-none focus:border-[var(--adm-accent)]"
            placeholder="/activity-logs"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold text-[var(--adm-fg-dim)] uppercase tracking-wider">Status Code</span>
          <select
            value={filters.statusCode}
            onChange={(event) => update({ statusCode: event.target.value })}
            className="w-full rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-3 py-2.5 text-sm text-[var(--adm-fg)] focus:outline-none focus:border-[var(--adm-accent)]"
          >
            {STATUS_CODE_OPTIONS.map((code) => (
              <option key={code || "all-status-codes"} value={code}>
                {code || "All Status Codes"}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold text-[var(--adm-fg-dim)] uppercase tracking-wider">Page Limit</span>
          <select
            value={filters.limit}
            onChange={(event) => update({ limit: Number(event.target.value) || 20, page: 1 })}
            className="w-full rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-3 py-2.5 text-sm text-[var(--adm-fg)] focus:outline-none focus:border-[var(--adm-accent)]"
          >
            {PAGE_LIMIT_OPTIONS.map((limit) => (
              <option key={limit} value={limit}>
                {limit} per page
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
