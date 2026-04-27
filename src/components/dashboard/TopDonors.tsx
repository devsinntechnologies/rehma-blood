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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[var(--adm-fg)] font-medium">Top Donors</h3>
        <span className="text-xs text-[var(--adm-fg-dim)]">By total donations</span>
      </div>

      {/* Donor list */}
      <div className="space-y-4">
        {donors.map((donor) => (
          <div key={donor.rank} className="flex items-center gap-4">
            {/* Rank */}
            <div className="w-4 text-[var(--adm-fg-faint)] text-xs text-right shrink-0">
              {donor.rank}
            </div>

            {/* Blood group badge */}
            <div className="h-8 w-8 shrink-0 rounded bg-red-600/15 text-red-400 flex items-center justify-center text-xs font-medium">
              {donor.bloodGroup}
            </div>

            {/* Name + bar */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[var(--adm-fg)] font-medium truncate">{donor.name}</span>
                <span className="text-[var(--adm-fg-dim)] shrink-0 ml-2 text-xs">{donor.donations}</span>
              </div>
              {/* Progress bar */}
              <div className="h-[2px] bg-[var(--adm-border-soft)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#dc2626] transition-all duration-700 ease-out"
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
