"use client";

import { useEffect } from "react";
import { fetchDonors } from "@/store/donorsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useDonors() {
  const dispatch = useAppDispatch();
  const donorsState = useAppSelector((state) => state.donors);
  const hasToken = useAppSelector((state) => Boolean(state.auth.accessToken));

  // Refresh whenever a screen that shows donors mounts, so the list never goes stale.
  useEffect(() => {
    if (hasToken) {
      dispatch(fetchDonors());
    }
  }, [dispatch, hasToken]);

  return donorsState;
}