import React from 'react';
import DonationsHeader from '@/components/donations/DonationsHeader';
import DonationsStats from '@/components/donations/DonationsStats';
import DonationsTable from '@/components/donations/DonationsTable';

export default function DonationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DonationsHeader />
      <DonationsStats />
      <DonationsTable />
    </div>
  );
}
