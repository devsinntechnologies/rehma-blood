"use client";

import { useEffect } from "react";
import { fetchDonations } from "@/store/donationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useDonations() {
  const dispatch = useAppDispatch();
  const donationsState = useAppSelector((state) => state.donations);
  const hasToken = useAppSelector((state) => Boolean(state.auth.accessToken));

  // Refresh whenever a screen that shows donations mounts, so the list never goes stale.
  useEffect(() => {
    if (hasToken) {
      dispatch(fetchDonations());
    }
  }, [dispatch, hasToken]);

  return donationsState;
}
