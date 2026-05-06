"use client";

import React from "react";
import {
  Loader2,
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
import type { Donor } from "@/store/donorsSlice";
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
                      {donor.isAvailable ? "Available" : "Unavailable"}
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

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--adm-fg)] mb-3 uppercase tracking-wide">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoItem
                    icon={<Mail size={14} />}
                    label="Email"
                    value={donor.email}
                  />
                  <InfoItem
                    icon={<Phone size={14} />}
                    label="Phone"
                    value={donor.phone}
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
                    value={donor.bloodGroup}
                  />
                  <InfoItem
                    icon={<Heart size={14} />}
                    label="Total Donations"
                    value={String(donor.totalDonations)}
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
                    value={String(donor.createdByUserId)}
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
