import React from 'react';
import type { Donation } from '@/store/donationsSlice';

type DonationsStatsProps = {
  donations: Donation[];
};

export default function DonationsStats({ donations }: DonationsStatsProps) {
  const completed = donations.filter((item) => item.status.toLowerCase() === 'completed').length;
  const verification = donations.filter((item) => item.status.toLowerCase() === 'verification').length;

  const stats = [
    { label: 'Total Donations', value: donations.length },
    { label: 'Completed', value: completed },
    { label: 'Verification', value: verification },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
        >
          <p className="text-[13px] text-[var(--adm-fg-dim)] mb-4 font-medium">{stat.label}</p>
          <p className="text-[36px] font-bold text-[var(--adm-fg)] leading-none">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
