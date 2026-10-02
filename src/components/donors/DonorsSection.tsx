"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DonorsHeader from "@/components/donors/DonorsHeader";
import DonorsFilter, { EMPTY_DONOR_FILTERS, type DonorFilters } from "@/components/donors/DonorsFilter";
import DonorsTable from "@/components/donors/DonorsTable";
import { useDonors } from "@/hooks/useDonors";
import { fetchDonors, type Donor } from "@/store/donorsSlice";
import { useAppDispatch } from "@/store/hooks";

function matchesFilters(donor: Donor, filters: DonorFilters) {
  if (filters.bloodGroup && donor.bloodGroup !== filters.bloodGroup) return false;
  if (filters.availability && donor.availabilityStatus !== filters.availability) return false;
  if (filters.accountStatus === "active" && !donor.isActive) return false;
  if (filters.accountStatus === "inactive" && donor.isActive) return false;

  const query = filters.query.trim().toLowerCase();
  if (!query) return true;
  const haystack = [donor.fullName, donor.email, donor.phone, donor.city, donor.promoCode, donor.cnic, `#${donor.id}`, String(donor.id)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.replace(/^#/, "")) || haystack.includes(query);
}

export default function DonorsSection() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useDonors();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<DonorFilters>(() => ({
    ...EMPTY_DONOR_FILTERS,
    query: searchParams.get("q") ?? "",
  }));

  // The header search links here with ?q=…; pick up new searches without a remount.
  const urlQuery = searchParams.get("q") ?? "";
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    setFilters((current) => ({ ...current, query: urlQuery }));
  }

  const visible = useMemo(() => items.filter((donor) => matchesFilters(donor, filters)), [items, filters]);

  return (
    <div className="flex flex-col gap-6">
      <DonorsHeader onRefresh={() => dispatch(fetchDonors())} refreshing={status === "loading"} />
      <DonorsFilter filters={filters} onChange={setFilters} count={visible.length} total={items.length} />
      <DonorsTable donors={visible} status={status} error={error} isFiltered={visible.length !== items.length} />
    </div>
  );
}
