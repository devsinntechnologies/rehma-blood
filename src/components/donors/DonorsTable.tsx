"use client";

import React, { useState } from "react";
import { Eye, Loader2, LocateFixed, Phone } from "lucide-react";
import DonorDetailsDialog from "@/components/donors/DonorDetailsDialog";
import DonorLocationModal from "@/components/donors/DonorLocationModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearSelectedDonorDetails, fetchDonorById, type Donor } from "@/store/donorsSlice";

type DonorsTableProps = {
  donors: Donor[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

export default function DonorsTable({ donors, status, error }: DonorsTableProps) {
  const dispatch = useAppDispatch();
  const selectedDonorDetails = useAppSelector((state) => state.donors.selectedDonor);
  const selectedStatus = useAppSelector((state) => state.donors.selectedStatus);
  const selectedError = useAppSelector((state) => state.donors.selectedError);

  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const rows = donors.map((donor) => ({
    ...donor,
  }));

  const handleOpenDetails = (donorId: number) => {
    setIsDetailsOpen(true);
    dispatch(fetchDonorById(donorId));
  };

  const handleDetailsDialogChange = (open: boolean) => {
    setIsDetailsOpen(open);
    if (!open) {
      dispatch(clearSelectedDonorDetails());
    }
  };

  return (
    <>
      <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[color:var(--adm-border)]">
                <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">ID</th>
                <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Donor</th>
                <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Blood Group</th>
                <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Contact</th>
                <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Status</th>
                <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Availability</th>
                <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--adm-border)]">
              {rows.map((donor) => (
                <tr key={donor.id} className="hover:bg-[var(--adm-hover)] transition-colors group">
                  <td className="px-5 py-[14px] text-[13px] font-medium text-[var(--adm-fg-faint)] whitespace-nowrap">#{donor.id}</td>
                  <td className="px-5 py-[14px] whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-semibold text-[var(--adm-fg)]">{donor.fullName}</span>
                      <span className="text-[12px] text-[var(--adm-fg-dim)]">{donor.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-[14px] whitespace-nowrap">
                    <div className="blood-badge h-8 min-w-[32px] px-1.5">
                      {donor.bloodGroup}
                    </div>
                  </td>
                  <td className="px-5 py-[14px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[13px] text-[var(--adm-fg-dim)]">
                      <Phone size={14} className="text-[var(--adm-fg-faint)]" />
                      {donor.phone}
                    </div>
                  </td>
                  <td className="px-5 py-[14px] whitespace-nowrap">
                    {donor.isActive ? (
                      <span className="status-badge-active">Active</span>
                    ) : (
                      <span className="status-badge-inactive">Inactive</span>
                    )}
                  </td>
                  <td className="px-5 py-[14px] whitespace-nowrap">
                    {donor.isAvailable ? (
                      <span className="status-badge-active">Available</span>
                    ) : (
                      <span className="status-badge-inactive">Unavailable</span>
                    )}
                  </td>
                  <td className="px-5 py-[14px] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(donor.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-3 py-2 text-[13px] font-semibold text-[var(--adm-fg)] transition-all hover:bg-[var(--adm-hover)]"
                      >
                        <Eye size={14} />
                        See Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDonor(donor)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-3 py-2 text-[13px] font-semibold text-[var(--adm-fg)] transition-all hover:bg-[var(--adm-hover)]"
                      >
                        <LocateFixed size={14} />
                        See Location
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 border-t border-[color:var(--adm-border)] px-5 py-4 text-[13px] text-[var(--adm-fg-dim)]">
            <Loader2 size={14} className="animate-spin" /> Loading donors...
          </div>
        )}

        {status === "failed" && error && (
          <div className="border-t border-[color:var(--adm-border)] px-5 py-4 text-[13px] text-red-400">
            {error}
          </div>
        )}

        {status === "succeeded" && donors.length === 0 && (
          <div className="border-t border-[color:var(--adm-border)] px-5 py-8 text-center text-[13px] text-[var(--adm-fg-dim)]">
            No donors found.
          </div>
        )}
      </div>

      <DonorLocationModal donor={selectedDonor} onClose={() => setSelectedDonor(null)} />
      <DonorDetailsDialog
        open={isDetailsOpen}
        onOpenChange={handleDetailsDialogChange}
        donor={selectedDonorDetails}
        status={selectedStatus}
        error={selectedError}
      />
    </>
  );
}
