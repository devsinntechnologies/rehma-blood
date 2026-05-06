"use client";

import React, { useState } from "react";
import type { ActiveBloodRequest } from "@/store/bloodRequestsSlice";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function urgencyClass(urgency: string) {
  const normalized = urgency.toLowerCase();
  if (normalized === "urgent") {
    return "bg-[#dc2626] text-white";
  }
  if (normalized === "high") {
    return "bg-[#ea580c] text-white";
  }
  return "bg-[#1e40af] text-white";
}

function MatchModal({
  request,
  onClose,
}: {
  request: ActiveBloodRequest | null;
  onClose: () => void;
}) {
  if (!request) return null;

  const createdAt = new Date(request.createdAt).toLocaleString();
  const updatedAt = new Date(request.updatedAt).toLocaleString();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-300">
      <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] w-full max-w-[680px] rounded-[24px] flex flex-col overflow-hidden max-h-[90vh] shadow-2xl transition-colors">
        <div className="p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-[var(--adm-fg-faint)] hover:text-[var(--adm-fg)] transition-colors p-2 hover:bg-[var(--adm-hover)] rounded-full"
          >
            ×
          </button>

          <div className="flex items-center gap-2 text-[13px] text-[var(--adm-fg-dim)] font-bold mb-3 uppercase tracking-wider">
            <span>Request Details · {request.id}</span>
          </div>

          <h2 className="text-[26px] font-bold text-[var(--adm-fg)] mb-2 tracking-tight">
            {request.requesterName}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-[15px] text-[var(--adm-fg-dim)] font-medium">
            <span>{request.requesterContact ?? "No contact provided"}</span>
            <span className="bg-[#3b82f6] text-white px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm shadow-blue-500/20">
              {formatStatus(request.status)}
            </span>
          </div>
        </div>

        <div className="px-6 md:px-8 py-6 bg-[var(--adm-surface-2)] border-y border-[color:var(--adm-border)] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="blood-badge h-16 w-16 shrink-0 rounded-[20px] text-2xl font-bold shadow-lg shadow-red-500/10 border-2">
              {request.bloodGroup}
            </div>

            <div className="flex flex-col gap-1 pr-4 md:pr-8 border-r border-[color:var(--adm-border)]">
              <span className="text-[12px] text-[var(--adm-fg-faint)] font-bold uppercase tracking-wide">Required</span>
              <span className="text-[17px] text-[var(--adm-fg)] font-bold">{request.requiredUnits} units</span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end justify-center">
            <span className="text-[14px] text-[var(--adm-fg-dim)] font-semibold">Status: {formatStatus(request.status)}</span>
            <span className="text-[12px] text-[var(--adm-fg-faint)] mt-1">Updated {updatedAt}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[var(--adm-bg)]/50 flex flex-col gap-4 custom-scrollbar">
          <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
            <div className="text-[13px] font-bold text-[var(--adm-fg-dim)] uppercase tracking-wider">Notes</div>
            <div className="text-[15px] text-[var(--adm-fg)] font-medium leading-7">
              {request.notes ?? "No notes provided"}
            </div>
          </div>

          <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
            <div className="text-[13px] font-bold text-[var(--adm-fg-dim)] uppercase tracking-wider">Location</div>
            <div className="text-[15px] text-[var(--adm-fg)] font-medium">
              {request.latitude != null && request.longitude != null
                ? `${request.latitude}, ${request.longitude}`
                : "Location not available"}
            </div>
          </div>

          <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
            <div className="text-[13px] font-bold text-[var(--adm-fg-dim)] uppercase tracking-wider">Timestamps</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[14px] text-[var(--adm-fg-dim)]">
              <div>
                <div className="text-[12px] uppercase tracking-wide font-bold text-[var(--adm-fg-faint)]">Created</div>
                <div className="text-[var(--adm-fg)] mt-1">{createdAt}</div>
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wide font-bold text-[var(--adm-fg-faint)]">Accepted by donor</div>
                <div className="text-[var(--adm-fg)] mt-1">{request.acceptedByDonorName ?? "Not accepted yet"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-[color:var(--adm-border)] bg-[var(--adm-surface-2)]/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] text-[14px] font-bold transition-all bg-transparent"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BloodRequestsGrid({ requests }: { requests: ActiveBloodRequest[] }) {
  const [selectedRequest, setSelectedRequest] = useState<ActiveBloodRequest | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div key={req.id} className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl p-5 flex flex-col justify-between min-h-[220px] shadow-sm hover:shadow-md transition-all">
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="blood-badge h-12 w-12 shrink-0 rounded-xl text-lg font-bold">
                  {req.bloodGroup}
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[var(--adm-fg)] leading-tight">{req.requesterName}</h3>
                  <p className="text-[13px] text-[var(--adm-fg-dim)] mt-1">Request #{req.id} · {formatDate(req.createdAt)}</p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide shadow-sm ${urgencyClass(req.urgency)}`}>
                {req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}
              </span>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[var(--adm-fg-dim)]">Contact</span>
                <span className="text-[var(--adm-fg)] font-medium">{req.requesterContact ?? "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[var(--adm-fg-dim)]">Units needed</span>
                <span className="text-[var(--adm-fg)] font-medium">{req.requiredUnits}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[var(--adm-fg-dim)]">Status</span>
                <span className="text-[var(--adm-fg)] font-medium">{formatStatus(req.status)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-4 border-t border-[color:var(--adm-border)]">
              <div>
                {req.status === "active" && <span className="status-badge-verification">Active</span>}
                {req.status === "donation_completed" && <span className="status-badge-active">Donation Completed</span>}
                {req.status !== "active" && req.status !== "donation_completed" && (
                  <span className="status-badge-pending">{formatStatus(req.status)}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="bg-transparent border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all">
                  View
                </button>
                <button 
                  onClick={() => setSelectedRequest(req)}
                  className="bg-[#dc2626] hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all shadow-sm"
                >
                  Details
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
      {selectedRequest && (
        <MatchModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}
    </>
  );
}
