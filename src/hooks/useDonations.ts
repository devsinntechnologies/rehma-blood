"use client";

import { useEffect } from "react";
import { fetchDonations } from "@/store/donationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useDonations() {
  const dispatch = useAppDispatch();
  const donationsState = useAppSelector((state) => state.donations);
  const hasToken = useAppSelector((state) => Boolean(state.auth.accessToken));

  useEffect(() => {
    if (hasToken && donationsState.status === "idle") {
      dispatch(fetchDonations());
    }
  }, [dispatch, donationsState.status, hasToken]);

  return donationsState;
}
