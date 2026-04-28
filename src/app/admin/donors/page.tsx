import React from 'react';
import DonorsHeader from "@/components/donors/DonorsHeader";
import DonorsFilter from "@/components/donors/DonorsFilter";
import DonorsTable from "@/components/donors/DonorsTable";

export default function DonorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DonorsHeader />
      <DonorsFilter />
      <DonorsTable />
    </div>
  );
}
