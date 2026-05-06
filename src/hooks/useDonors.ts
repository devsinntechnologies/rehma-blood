"use client";

import { useEffect } from "react";
import { fetchDonors } from "@/store/donorsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useDonors() {
  const dispatch = useAppDispatch();
  const donorsState = useAppSelector((state) => state.donors);
  const hasToken = useAppSelector((state) => Boolean(state.auth.accessToken));

  useEffect(() => {
    if (hasToken && donorsState.status === "idle") {
      dispatch(fetchDonors());
    }
  }, [dispatch, donorsState.status, hasToken]);

  return donorsState;
}