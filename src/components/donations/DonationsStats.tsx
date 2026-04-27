import React from 'react';

const stats = [
  { label: 'Total Donations', value: '6' },
  { label: 'Total Units', value: '8' },
  { label: 'Active Donors', value: '10' },
];

export default function DonationsStats() {
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
