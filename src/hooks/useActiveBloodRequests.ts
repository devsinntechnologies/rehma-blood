"use client";

import { useCallback, useEffect } from "react";
import { fetchActiveBloodRequests, fetchUrgentBloodRequests } from "@/store/bloodRequestsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useActiveBloodRequests() {
  const dispatch = useAppDispatch();
  const bloodRequestsState = useAppSelector((state) => state.bloodRequests);
  const hasToken = useAppSelector((state) => Boolean(state.auth.accessToken));

  useEffect(() => {
    if (hasToken && bloodRequestsState.activeStatus === "idle") {
      dispatch(fetchActiveBloodRequests());
    }
  }, [dispatch, bloodRequestsState.activeStatus, hasToken]);

  const loadUrgentRequests = useCallback(() => {
    if (hasToken) {
      dispatch(fetchUrgentBloodRequests());
    }
  }, [dispatch, hasToken]);

  return {
    ...bloodRequestsState,
    loadUrgentRequests,
  };
}
