"use client";

import React, { useEffect, useMemo, useState } from "react";
import ActivityLogsHeader from "@/components/activity-logs/ActivityLogsHeader";
import ActivityLogsFilters, { type ActivityLogsFilterValues } from "@/components/activity-logs/ActivityLogsFilters";
import ActivityLogsPagination from "@/components/activity-logs/ActivityLogsPagination";
import ActivityLogsTable from "@/components/activity-logs/ActivityLogsTable";
import ActivityLogDetailDrawer from "@/components/activity-logs/ActivityLogDetailDrawer";
import { clearSelectedActivityLog, fetchActivityLogById, fetchActivityLogs, openSelectedActivityLog } from "@/store/activityLogsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const createInitialFilters = (): ActivityLogsFilterValues => ({
  page: 1,
  limit: 20,
  startDate: "",
  endDate: "",
  method: "",
  endpoint: "",
  statusCode: "",
});

export default function ActivityLogsPage() {
  const dispatch = useAppDispatch();
  const { items, pagination, status, error, selectedLog, selectedLogId, selectedLogOpen, selectedLogStatus, selectedLogError } = useAppSelector((state) => state.activityLogs);
  const [filters, setFilters] = useState<ActivityLogsFilterValues>(() => createInitialFilters());

  useEffect(() => {
    dispatch(fetchActivityLogs(filters));
  }, [dispatch, filters]);

  const handleFiltersChange = (nextFilters: ActivityLogsFilterValues) => {
    setFilters((current) => ({
      ...current,
      ...nextFilters,
      page: 1,
    }));
  };

  const handlePageChange = (nextPage: number) => {
    setFilters((current) => ({
      ...current,
      page: nextPage,
    }));
  };

  const handleReset = () => {
    setFilters(createInitialFilters());
  };

  const handleRowClick = (logId: number) => {
    dispatch(openSelectedActivityLog(logId));
    dispatch(fetchActivityLogById(logId));
  };

  const handleCloseDrawer = () => {
    dispatch(clearSelectedActivityLog());
  };

  const summary = useMemo(() => {
    return {
      total: pagination.total,
      totalPages: pagination.totalPages,
      currentPage: pagination.page,
      pageSize: pagination.limit,
      resultCount: items.length,
    };
  }, [items.length, pagination.limit, pagination.page, pagination.total, pagination.totalPages]);

  return (
    <div className="flex flex-col gap-6">
      <ActivityLogsHeader />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] p-4 shadow-sm">
          <div className="text-[12px] uppercase tracking-wider text-[var(--adm-fg-faint)] font-semibold">Total logs</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--adm-fg)]">{summary.total}</div>
        </div>
        <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] p-4 shadow-sm">
          <div className="text-[12px] uppercase tracking-wider text-[var(--adm-fg-faint)] font-semibold">Current page</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--adm-fg)]">{summary.currentPage}</div>
        </div>
        <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] p-4 shadow-sm">
          <div className="text-[12px] uppercase tracking-wider text-[var(--adm-fg-faint)] font-semibold">Page limit</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--adm-fg)]">{summary.pageSize}</div>
        </div>
        <div className="rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] p-4 shadow-sm">
          <div className="text-[12px] uppercase tracking-wider text-[var(--adm-fg-faint)] font-semibold">Shown on page</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--adm-fg)]">{summary.resultCount}</div>
        </div>
      </div>

      <ActivityLogsFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleReset}
        total={pagination.total}
        totalPages={pagination.totalPages}
      />

      <ActivityLogsTable items={items} status={status} error={error} onRowClick={handleRowClick} />

      <ActivityLogsPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      <ActivityLogDetailDrawer
        open={selectedLogOpen}
        log={selectedLog}
        logId={selectedLogId}
        status={selectedLogStatus}
        error={selectedLogError}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
