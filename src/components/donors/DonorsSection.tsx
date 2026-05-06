"use client";

import React from "react";
import DonorsHeader from "@/components/donors/DonorsHeader";
import DonorsFilter from "@/components/donors/DonorsFilter";
import DonorsTable from "@/components/donors/DonorsTable";
import { useDonors } from "@/hooks/useDonors";

export default function DonorsSection() {
  const { items, status, error } = useDonors();

  return (
    <div className="flex flex-col gap-6">
      <DonorsHeader />
      <DonorsFilter count={items.length} />
      <DonorsTable donors={items} status={status} error={error} />
    </div>
  );
}