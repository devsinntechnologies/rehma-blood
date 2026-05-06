"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import ActivityLogsHeader from "@/components/activity-logs/ActivityLogsHeader";
import ActivityLogsStatisticsView from "@/components/activity-logs/ActivityLogsStatisticsView";
import { fetchActivityLogsStatistics } from "@/store/activityLogsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function ActivityLogsStatisticsPage() {
  const dispatch = useAppDispatch();
  const { statistics, statisticsStatus, statisticsError } = useAppSelector((state) => state.activityLogs);

  useEffect(() => {
    dispatch(fetchActivityLogsStatistics());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <ActivityLogsHeader />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--adm-fg)]">Logs Statistics</h1>
          <p className="text-[14px] text-[var(--adm-fg-faint)]">Request volume, methods, status codes, and endpoint distribution</p>
        </div>
        <Link
          href="/admin/activity-logs"
          className="inline-flex items-center justify-center rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-4 py-2 text-sm font-semibold text-[var(--adm-fg)] shadow-sm transition-colors hover:bg-[var(--adm-hover)]"
        >
          Back to Logs
        </Link>
      </div>

      <ActivityLogsStatisticsView statistics={statistics} status={statisticsStatus} error={statisticsError} />
    </div>
  );
}