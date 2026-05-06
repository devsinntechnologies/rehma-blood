"use client";

import React from 'react';
import DonationsHeader from '@/components/donations/DonationsHeader';
import DonationsStats from '@/components/donations/DonationsStats';
import DonationsTable from '@/components/donations/DonationsTable';
import { useDonations } from '@/hooks/useDonations';

export default function DonationsPage() {
  const { items, status, error } = useDonations();

  return (
    <div className="flex flex-col gap-6">
      <DonationsHeader />
      <DonationsStats donations={items} />
      <DonationsTable donations={items} status={status} error={error} />
    </div>
  );
}
