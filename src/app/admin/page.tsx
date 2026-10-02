"use client";

import { useEffect } from "react";
import DonationsChart from "@/components/dashboard/DonationsChart";
import BloodGroupChart from "@/components/dashboard/BloodGroupChart";
import RecentBloodRequests from "@/components/dashboard/RecentBloodRequests";
import TopDonors from "@/components/dashboard/TopDonors";
import StatsSection from "@/components/dashboard/StatsSection";
import { useDonors } from "@/hooks/useDonors";
import { useDonations } from "@/hooks/useDonations";
import { fetchAllBloodRequests } from "@/store/bloodRequestsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const hasToken = useAppSelector((state) => Boolean(state.auth.accessToken));
  const donors = useDonors();
  const donations = useDonations();
  const requests = useAppSelector((state) => state.bloodRequests);

  useEffect(() => {
    if (hasToken) {
      dispatch(fetchAllBloodRequests());
    }
  }, [dispatch, hasToken]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-2">
        <h1 className="text-[var(--adm-fg)] text-[22px] font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-[var(--adm-fg-dim)] text-[13px] mt-1">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stat Cards */}
      <StatsSection donations={donations.items} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px]">
          <DonationsChart requests={requests.allItems} donations={donations.items} />
        </div>
        <div className="h-[400px]">
          <BloodGroupChart donors={donors.items} loading={donors.status === "loading"} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBloodRequests requests={requests.allItems} status={requests.allStatus} error={requests.allError} />
        <TopDonors donors={donors.items} loading={donors.status === "loading"} />
      </div>
    </div>
  );
}
