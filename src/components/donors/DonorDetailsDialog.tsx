"use client";

import React, { useState } from "react";
import {
  Loader2,
  Power,
  RefreshCw,
  Ban,
  Trash2,
  Droplets,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  UserRound,
  BadgeCheck,
  MapPinned,
  Heart,
  Clock,
  Tag,
  FileText,
  Shield,
} from "lucide-react";
import {
  AVAILABILITY_STATUSES,
  deleteDonorAsAdmin,
  updateDonorAsAdmin,
  type AvailabilityStatus,
  type Donor,
} from "@/store/donorsSlice";
import { useAppDispatch } from "@/store/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DonorDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donor: Donor | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

export default function DonorDetailsDialog({
  open,
  onOpenChange,
  donor,
  status,
  error,
}: DonorDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 max-w-3xl">
        <div className="border-b border-[color:var(--adm-border)] px-6 py-5">
          <DialogHeader>
            <DialogTitle>Donor Profile</DialogTitle>
            <DialogDescription>Complete donor information and details</DialogDescription>
          </DialogHeader>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          {status === "loading" && (
            <div className="flex items-center gap-2 text-sm text-[var(--adm-fg-dim)]">
              <Loader2 size={14} className="animate-spin" /> Loading donor details...
            </div>
          )}

          {status === "failed" && (
            <div className="text-sm text-red-500">
              {error ?? "Unable to load donor details."}
            </div>
          )}

          {status === "succeeded" && donor && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4 rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] p-4">
                {donor.profileImage ? (
                  <img
                    src={donor.profileImage}
                    alt={donor.fullName}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="blood-badge h-16 w-16 rounded-lg text-2xl font-bold flex items-center justify-center">
                    {donor.bloodGroup}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[18px] font-semibold text-[var(--adm-fg)]">
                      {donor.fullName}
                    </h3>
                    {donor.isVerifiedAccount && (
                      <BadgeCheck size={18} className="text-green-500" />
                    )}
                  </div>
                  <p className="text-[13px] text-[var(--adm-fg-dim)] mt-1">
                    {donor.claimStatus} · {donor.availabilityStatus}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex text-xs font-medium px-2 py-1 rounded-md ${
                        donor.isActive
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {donor.isActive ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`inline-flex text-xs font-medium px-2 py-1 rounded-md ${
                        donor.isAvailable
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {donor.availabilityStatus ?? (donor.isAvailable ? "Available" : "Not Available")}
                    </span>
                    <span
                      className={`inline-flex text-xs font-medium px-2 py-1 rounded-md ${
                        donor.isClaimed
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-gray-500/10 text-gray-600"
                      }`}
                    >
                      {donor.isClaimed ? "Claimed" : "Unclaimed"}
                    </span>
                  </div>
                </div>
              </div>

              <DonorAdminActions donor={donor} onDeleted={() => onOpenChange(false)} />

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--adm-fg)] mb-3 uppercase tracking-wide">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoItem
                    icon={<Mail size={14} />}
                    label="Email"
                    value={donor.email ?? "N/A"}
                  />
                  <InfoItem
                    icon={<Phone size={14} />}
                    label="Phone"
                    value={donor.phone ?? "N/A"}
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--adm-fg)] mb-3 uppercase tracking-wide">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoItem
                    icon={<UserRound size={14} />}
                    label="Gender"
                    value={donor.gender ?? "N/A"}
                  />
                  <InfoItem
                    icon={<CalendarDays size={14} />}
                    label="Date of Birth"
                    value={donor.dateOfBirth ? new Date(donor.dateOfBirth).toLocaleDateString() : "N/A"}
                  />
                  <InfoItem label="CNIC" value={donor.cnic ?? "N/A"} />
                  <InfoItem
                    icon={<MapPin size={14} />}
                    label="City"
                    value={donor.city ?? "N/A"}
                  />
                </div>
              </div>

              {/* Blood Donation Information */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--adm-fg)] mb-3 uppercase tracking-wide">
                  Donation Information
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoItem
                    icon={<Droplets size={14} />}
                    label="Blood Group"
                    value={donor.bloodGroup ?? "N/A"}
                  />
                  <InfoItem
                    icon={<Heart size={14} />}
                    label="Total Donations"
                    value={String(donor.totalDonations ?? 0)}
                  />
                  <InfoItem
                    icon={<Clock size={14} />}
                    label="Last Donation Date"
                    value={
                      donor.lastDonationDate
                        ? new Date(donor.lastDonationDate).toLocaleDateString()
                        : "Never"
                    }
                  />
                  {donor.medicalNotes && (
                    <InfoItem
                      icon={<FileText size={14} />}
                      label="Medical Notes"
                      value={donor.medicalNotes}
                    />
                  )}
                </div>
              </div>

              {/* Account & Location Information */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--adm-fg)] mb-3 uppercase tracking-wide">
                  Account Information
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoItem
                    icon={<Tag size={14} />}
                    label="Promo Code"
                    value={donor.promoCode || "None"}
                  />
                  {donor.promoCodeExpiresAt && (
                    <InfoItem
                      label="Promo Expires"
                      value={new Date(donor.promoCodeExpiresAt).toLocaleDateString()}
                    />
                  )}
                  <InfoItem
                    icon={<Shield size={14} />}
                    label="Verification Status"
                    value={donor.isVerifiedAccount ? "Verified" : "Unverified"}
                  />
                  <InfoItem
                    icon={<MapPinned size={14} />}
                    label="User ID"
                    value={donor.userId ? String(donor.userId) : "N/A"}
                  />
                </div>
              </div>

              {/* Location Coordinates */}
              {(donor.latitude || donor.longitude) && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--adm-fg)] mb-3 uppercase tracking-wide">
                    Location Coordinates
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InfoItem
                      label="Latitude"
                      value={donor.latitude ? donor.latitude.toFixed(6) : "N/A"}
                    />
                    <InfoItem
                      label="Longitude"
                      value={donor.longitude ? donor.longitude.toFixed(6) : "N/A"}
                    />
                  </div>
                </div>
              )}

              {/* Administrative Information */}
              <div className="pt-3 border-t border-[color:var(--adm-border)]">
                <h4 className="text-sm font-semibold text-[var(--adm-fg)] mb-3 uppercase tracking-wide">
                  Administrative
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoItem label="Donor ID" value={`#${donor.id}`} />
                  <InfoItem
                    label="Created By (User ID)"
                    value={donor.createdByUserId != null ? String(donor.createdByUserId) : "Self-registered"}
                  />
                  {donor.claimedByUserId && (
                    <InfoItem
                      label="Claimed By (User ID)"
                      value={String(donor.claimedByUserId)}
                    />
                  )}
                  {donor.linkedUserId && (
                    <InfoItem
                      label="Linked User ID"
                      value={String(donor.linkedUserId)}
                    />
                  )}
                  <InfoItem
                    label="Created"
                    value={new Date(donor.createdAt).toLocaleString()}
                  />
                  <InfoItem
                    label="Last Updated"
                    value={new Date(donor.updatedAt).toLocaleString()}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const actionButtonClass =
  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[13px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50";

function DonorAdminActions({ donor, onDeleted }: { donor: Donor; onDeleted: () => void }) {
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const run = async (key: string, perform: () => Promise<{ payload?: unknown; error?: unknown }>, success: string) => {
    setPending(key);
    setFeedback(null);
    const result = await perform();
    setPending(null);
    if ("error" in result) {
      setFeedback({ tone: "error", text: (result.payload as string) ?? "Action failed." });
      return false;
    }
    setFeedback({ tone: "success", text: success });
    return true;
  };

  const canManagePromo = !donor.isClaimed && Boolean(donor.promoCode);

  return (
    <div className="rounded-xl border border-[color:var(--adm-border)] p-4 space-y-3">
      <h4 className="text-sm font-semibold text-[var(--adm-fg)] uppercase tracking-wide">Admin Actions</h4>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() =>
            run(
              "active",
              () => dispatch(updateDonorAsAdmin({ donorId: donor.id, action: { type: "setActive", isActive: !donor.isActive } })),
              donor.isActive ? "Donor deactivated. They no longer appear on the map or in matching." : "Donor reactivated."
            )
          }
          className={`${actionButtonClass} ${
            donor.isActive
              ? "border-red-500/30 text-red-500 hover:bg-red-500/10"
              : "border-green-500/30 text-green-500 hover:bg-green-500/10"
          }`}
        >
          {pending === "active" ? <Loader2 size={14} className="animate-spin" /> : <Power size={14} />}
          {donor.isActive ? "Deactivate" : "Activate"}
        </button>

        <label className="inline-flex items-center gap-2 text-[13px] text-[var(--adm-fg-dim)]">
          Availability
          <select
            value={donor.availabilityStatus ?? ""}
            disabled={pending !== null}
            onChange={(event) =>
              run(
                "availability",
                () => dispatch(updateDonorAsAdmin({
                  donorId: donor.id,
                  action: { type: "setAvailability", availabilityStatus: event.target.value as AvailabilityStatus },
                })),
                `Availability set to ${event.target.value}.`
              )
            }
            className="rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-3 py-2 text-[13px] font-semibold text-[var(--adm-fg)] focus:outline-none focus:border-[var(--adm-accent)]"
          >
            {AVAILABILITY_STATUSES.map((status) => (
              <option key={status} value={status} className="bg-[var(--adm-surface)]">
                {status}
              </option>
            ))}
          </select>
        </label>

        {canManagePromo && (
          <>
            <button
              type="button"
              disabled={pending !== null}
              onClick={() =>
                run("regenerate", () => dispatch(updateDonorAsAdmin({ donorId: donor.id, action: { type: "regeneratePromo" } })), "New promo code generated.")
              }
              className={`${actionButtonClass} border-[color:var(--adm-border)] text-[var(--adm-fg)] hover:bg-[var(--adm-hover)]`}
            >
              {pending === "regenerate" ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              New promo code
            </button>
            {donor.claimStatus !== "EXPIRED" && (
              <button
                type="button"
                disabled={pending !== null}
                onClick={() =>
                  run("disable", () => dispatch(updateDonorAsAdmin({ donorId: donor.id, action: { type: "disablePromo" } })), "Promo code disabled.")
                }
                className={`${actionButtonClass} border-[color:var(--adm-border)] text-[var(--adm-fg)] hover:bg-[var(--adm-hover)]`}
              >
                {pending === "disable" ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                Disable promo
              </button>
            )}
          </>
        )}

        <div className="flex-1" />

        {confirmingDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-red-500 font-medium">Delete permanently?</span>
            <button
              type="button"
              disabled={pending !== null}
              onClick={async () => {
                if (await run("delete", () => dispatch(deleteDonorAsAdmin(donor.id)), "Donor deleted.")) onDeleted();
              }}
              className={`${actionButtonClass} border-red-600 bg-red-600 text-white hover:bg-red-700`}
            >
              {pending === "delete" ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className={`${actionButtonClass} border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:bg-[var(--adm-hover)]`}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => setConfirmingDelete(true)}
            className={`${actionButtonClass} border-red-500/30 text-red-500 hover:bg-red-500/10`}
          >
            <Trash2 size={14} />
            Delete donor
          </button>
        )}
      </div>
      {feedback && (
        <p role="status" className={`text-[13px] ${feedback.tone === "error" ? "text-red-500" : "text-green-500"}`}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--adm-fg-dim)]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-[13px] text-[var(--adm-fg)] break-words">{value}</div>
    </div>
  );
}
