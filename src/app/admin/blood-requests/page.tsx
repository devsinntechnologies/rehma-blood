"use client";

import React, { useEffect, useMemo, useState } from "react";
import BloodRequestsHeader from "@/components/blood-requests/BloodRequestsHeader";
import BloodRequestsFilter from "@/components/blood-requests/BloodRequestsFilter";
import BloodRequestsGrid from "@/components/blood-requests/BloodRequestsGrid";
import { fetchAllBloodRequests, type ActiveBloodRequest } from "@/store/bloodRequestsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { REQUEST_STATUS_GROUPS, formatRequestStatus, type RequestStatusTab } from "@/lib/requestStatus";

function inTab(request: ActiveBloodRequest, tab: RequestStatusTab) {
  return tab === "All" || (REQUEST_STATUS_GROUPS[tab] as readonly string[]).includes(request.status);
}

function matchesSearch(request: ActiveBloodRequest, query: string) {
  return [
    request.requesterName,
    request.requesterContact,
    request.bloodGroup,
    request.urgency,
    formatRequestStatus(request.status),
    request.notes,
    request.acceptedByDonorName,
    request.requestedToDonorName,
    `#${request.id}`,
  ].some((value) => value?.toLowerCase().includes(query));
}

export default function BloodRequestsPage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<RequestStatusTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { allItems, allStatus, allError } = useAppSelector((state) => state.bloodRequests);
  const hasToken = useAppSelector((state) => Boolean(state.auth.accessToken));

  useEffect(() => {
    if (hasToken) {
      dispatch(fetchAllBloodRequests());
    }
  }, [dispatch, hasToken]);

  const tabCounts = useMemo(() => {
    const tabs: RequestStatusTab[] = ["All", ...(Object.keys(REQUEST_STATUS_GROUPS) as RequestStatusTab[])];
    return Object.fromEntries(tabs.map((tab) => [tab, allItems.filter((request) => inTab(request, tab)).length])) as Record<
      RequestStatusTab,
      number
    >;
  }, [allItems]);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allItems.filter((request) => inTab(request, activeTab) && (!query || matchesSearch(request, query)));
  }, [activeTab, allItems, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <BloodRequestsHeader onRefresh={() => dispatch(fetchAllBloodRequests())} refreshing={allStatus === "loading"} />

      {allStatus === "loading" && (
        <div className="rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-4 py-3 text-sm text-[var(--adm-fg-dim)] shadow-sm">
          Loading blood requests...
        </div>
      )}

      {allStatus === "failed" && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {allError ?? "Unable to load blood requests."}
        </div>
      )}

      <BloodRequestsFilter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabCounts={tabCounts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsCount={filteredRequests.length}
      />

      {allStatus === "succeeded" && filteredRequests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-6 py-12 text-center text-sm text-[var(--adm-fg-dim)]">
          {allItems.length === 0 ? "No blood requests have been created yet." : "No requests match this filter."}
        </div>
      ) : (
        <BloodRequestsGrid requests={filteredRequests} />
      )}
    </div>
  );
}
