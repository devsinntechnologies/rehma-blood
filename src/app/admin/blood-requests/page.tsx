"use client";

import React, { useEffect, useMemo, useState } from "react";
import BloodRequestsHeader from "@/components/blood-requests/BloodRequestsHeader";
import BloodRequestsFilter from "@/components/blood-requests/BloodRequestsFilter";
import BloodRequestsGrid from "@/components/blood-requests/BloodRequestsGrid";
import { fetchAllBloodRequests } from "@/store/bloodRequestsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function matchesSearch(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

export default function BloodRequestsPage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { allItems, allStatus, allError } = useAppSelector((state) => state.bloodRequests);

  useEffect(() => {
    if (allStatus === "idle") {
      dispatch(fetchAllBloodRequests());
    }
  }, [allStatus, dispatch]);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allItems.filter((request) => {
      const requestStatus = request.status.replaceAll("_", " ").toLowerCase();
      if (activeTab !== "All" && requestStatus !== activeTab.toLowerCase()) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        matchesSearch(request.requesterName, query) ||
        matchesSearch(request.requesterContact ?? "", query) ||
        matchesSearch(request.bloodGroup, query) ||
        matchesSearch(request.urgency, query) ||
        matchesSearch(request.status, query) ||
        matchesSearch(request.notes ?? "", query)
      );
    });
  }, [activeTab, allItems, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <BloodRequestsHeader />

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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsCount={filteredRequests.length}
      />
      <BloodRequestsGrid requests={filteredRequests} />
    </div>
  );
}
