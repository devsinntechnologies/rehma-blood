"use client";

import { useEffect } from "react";
import { fetchStats } from "@/store/statsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useStats() {
  const dispatch = useAppDispatch();
  const statsState = useAppSelector((state) => state.stats);
  const hasToken = useAppSelector((state) => Boolean(state.auth.accessToken));

  useEffect(() => {
    if (hasToken && statsState.status === "idle") {
      dispatch(fetchStats());
    }
  }, [dispatch, statsState.status, hasToken]);

  return statsState;
}
