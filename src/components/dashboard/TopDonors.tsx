"use client";

import React from "react";

const donors = [
  { rank: 1, name: "Hamza Tariq", bloodGroup: "B+", donations: 12 },
  { rank: 2, name: "Tariq Mehmood", bloodGroup: "B+", donations: 11 },
  { rank: 3, name: "Bilal Qureshi", bloodGroup: "B-", donations: 9 },
  { rank: 4, name: "Ali Raza", bloodGroup: "O+", donations: 8 },
  { rank: 5, name: "Rida Hussain", bloodGroup: "O-", donations: 7 },
  { rank: 6, name: "Omar Sheikh", bloodGroup: "O-", donations: 6 },
];

const maxDonations = 12;

export default function TopDonors() {
  return (
    <div className="flex flex-col rounded-xl border p-5 bg-[var(--adm-surface)] border-[color:var(--adm-border)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[17px] font-semibold text-[var(--adm-fg)]">Top Donors</h3>
        <span className="text-[12px] text-[var(--adm-fg-dim)]">By total donations</span>
      </div>

      {/* Donor list */}
      <div className="space-y-[26px]">
        {donors.map((donor) => (
          <div key={donor.rank} className="flex items-center gap-4">
            {/* Rank */}
            <div className="w-4 text-[var(--adm-fg-faint)] text-xs text-right shrink-0">
              {donor.rank}
            </div>

            {/* Blood group badge */}
            <div className="blood-badge h-8 w-10 shrink-0 rounded text-[13px] font-bold">
              {donor.bloodGroup}
            </div>

            {/* Name + bar */}
            <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
              <div className="flex justify-between items-center">
                <span className="text-[15px] text-[var(--adm-fg)] font-semibold truncate leading-none">{donor.name}</span>
                <span className="text-[var(--adm-fg-muted)] shrink-0 ml-2 text-[14px] leading-none">{donor.donations}</span>
              </div>
              {/* Progress bar */}
              <div className="h-[6px] bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-[3px] overflow-hidden">
                <div
                  className="h-full bg-[#dc2626] rounded-[3px] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(220,38,38,0.3)]"
                  style={{ width: `${(donor.donations / maxDonations) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
