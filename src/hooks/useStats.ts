"use client";

import { useEffect } from "react";
import { fetchStats } from "@/store/statsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useStats() {
  const dispatch = useAppDispatch();
  const statsState = useAppSelector((state) => state.stats);
  const hasToken = useAppSelector((state) => Boolean(state.auth.accessToken));

  // Refresh on every visit to the dashboard so the numbers are current.
  useEffect(() => {
    if (hasToken) {
      dispatch(fetchStats());
    }
  }, [dispatch, hasToken]);

  return statsState;
}
