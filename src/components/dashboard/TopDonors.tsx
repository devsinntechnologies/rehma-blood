"use client";

import React, { useMemo } from "react";
import type { Donor } from "@/store/donorsSlice";

const MAX_SHOWN = 6;

export default function TopDonors({ donors, loading }: { donors: Donor[]; loading: boolean }) {
  const ranked = useMemo(
    () =>
      donors
        .filter((donor) => (donor.totalDonations ?? 0) > 0)
        .sort((left, right) => right.totalDonations - left.totalDonations)
        .slice(0, MAX_SHOWN),
    [donors]
  );
  const maxDonations = ranked[0]?.totalDonations ?? 1;

  return (
    <div className="flex flex-col rounded-xl border p-5 bg-[var(--adm-surface)] border-[color:var(--adm-border)]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[17px] font-semibold text-[var(--adm-fg)]">Top Donors</h3>
        <span className="text-[12px] text-[var(--adm-fg-dim)]">By completed donations</span>
      </div>

      {ranked.length === 0 ? (
        <div className="text-sm text-[var(--adm-fg-dim)] py-4">
          {loading ? "Loading donors..." : "No completed donations yet. Donors appear here after their first completed donation."}
        </div>
      ) : (
        <div className="space-y-[26px]">
          {ranked.map((donor, index) => (
            <div key={donor.id} className="flex items-center gap-4">
              <div className="w-4 text-[var(--adm-fg-faint)] text-xs text-right shrink-0">{index + 1}</div>

              <div className="blood-badge h-8 w-10 shrink-0 rounded text-[13px] font-bold">{donor.bloodGroup ?? "?"}</div>

              <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-[var(--adm-fg)] font-semibold truncate leading-none">{donor.fullName}</span>
                  <span className="text-[var(--adm-fg-muted)] shrink-0 ml-2 text-[14px] leading-none">{donor.totalDonations}</span>
                </div>
                <div className="h-[6px] bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-[3px] overflow-hidden">
                  <div
                    className="h-full bg-[#dc2626] rounded-[3px] transition-all duration-700 ease-out"
                    style={{ width: `${(donor.totalDonations / maxDonations) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
