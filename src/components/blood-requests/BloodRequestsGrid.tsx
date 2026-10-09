"use client";

import React, { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteBloodRequest, type ActiveBloodRequest } from "@/store/bloodRequestsSlice";
import { useAppDispatch } from "@/store/hooks";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatRequestStatus, formatUrgency, isUrgent, requestStatusBadgeClass } from "@/lib/requestStatus";
import { RequestTrackingPanel } from "@/components/blood-requests/RequestTrackingPanel";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const formatDateTime = (value?: string | null) => (value ? new Date(value).toLocaleString() : null);

function urgencyClass(urgency: string) {
  return isUrgent(urgency) ? "bg-[#dc2626] text-white" : "bg-[#1e40af] text-white";
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] uppercase tracking-wide font-bold text-[var(--adm-fg-faint)]">{label}</div>
      <div className="text-[var(--adm-fg)] mt-1 break-words">{value}</div>
    </div>
  );
}

function RequestDetailsDialog({ request, onClose }: { request: ActiveBloodRequest | null; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setConfirmingDelete(false);
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!request) return;
    setDeleting(true);
    setError(null);
    const result = await dispatch(deleteBloodRequest(request.id));
    setDeleting(false);
    if ("error" in result) {
      setError((result.payload as string) ?? "Unable to delete the request.");
      return;
    }
    close();
  };

  return (
    <Dialog open={request !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-[680px] overflow-hidden flex flex-col max-h-[90vh]">
        {request && (
          <>
            <div className="p-6 md:p-8 pr-12">
              <div className="text-[13px] text-[var(--adm-fg-dim)] font-bold mb-3 uppercase tracking-wider">Request #{request.id}</div>
              <DialogTitle className="text-[26px] font-bold tracking-tight">{request.requesterName ?? "Unnamed requester"}</DialogTitle>
              <DialogDescription asChild>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[15px] font-medium">
                  <span>{request.requesterContact ?? "No contact provided"}</span>
                  <span className={requestStatusBadgeClass(request.status)}>{formatRequestStatus(request.status)}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${urgencyClass(request.urgency)}`}>
                    {formatUrgency(request.urgency)}
                  </span>
                </div>
              </DialogDescription>
            </div>

            <div className="px-6 md:px-8 py-5 bg-[var(--adm-surface-2)] border-y border-[color:var(--adm-border)] flex items-center gap-4">
              <div className="blood-badge h-16 w-16 shrink-0 rounded-[20px] text-2xl font-bold border-2">{request.bloodGroup}</div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-[var(--adm-fg-faint)] font-bold uppercase tracking-wide">Required</span>
                <span className="text-[17px] text-[var(--adm-fg)] font-bold">
                  {request.requiredUnits} unit{request.requiredUnits === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-4 custom-scrollbar">
              <section className="bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-[20px] p-5 flex flex-col gap-3">
                <div className="text-[13px] font-bold text-[var(--adm-fg-dim)] uppercase tracking-wider">Notes</div>
                <div className="text-[15px] text-[var(--adm-fg)] leading-7">{request.notes?.trim() || "No notes provided"}</div>
              </section>

              <RequestTrackingPanel requestId={request.id} />

              <section className="bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-[20px] p-5">
                <div className="text-[13px] font-bold text-[var(--adm-fg-dim)] uppercase tracking-wider mb-4">Progress</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                  <Field label="Created" value={formatDateTime(request.createdAt)} />
                  <Field label="Sent to donor" value={request.requestedToDonorName ?? "Not sent yet"} />
                  <Field
                    label="Accepted by"
                    value={
                      request.acceptedByDonorName
                        ? `${request.acceptedByDonorName}${request.acceptedAt ? ` · ${formatDateTime(request.acceptedAt)}` : ""}`
                        : "Not accepted yet"
                    }
                  />
                  <Field label="Scheduled for" value={formatDateTime(request.scheduledDate) ?? "Not scheduled"} />
                  <Field label="Fulfilled by" value={request.fulfilledByDonorName ?? "—"} />
                  <Field label="Completed" value={formatDateTime(request.completedAt) ?? "—"} />
                  <Field
                    label="Location"
                    value={
                      request.latitude != null && request.longitude != null ? (
                        <a
                          href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--adm-accent)] hover:underline"
                        >
                          {request.latitude.toFixed(5)}, {request.longitude.toFixed(5)}
                        </a>
                      ) : (
                        "Not available"
                      )
                    }
                  />
                  <Field label="Last updated" value={formatDateTime(request.updatedAt)} />
                </div>
              </section>
              {error && <p className="text-[13px] text-red-500">{error}</p>}
            </div>

            <div className="p-5 md:px-8 border-t border-[color:var(--adm-border)] flex flex-wrap items-center justify-between gap-3">
              {confirmingDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-red-500 font-medium">Delete this request permanently?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold disabled:opacity-60"
                  >
                    {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="px-4 py-2 rounded-xl border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:bg-[var(--adm-hover)] text-[13px] font-bold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-[13px] font-bold"
                >
                  <Trash2 size={14} />
                  Delete request
                </button>
              )}
              <button
                type="button"
                onClick={close}
                className="px-6 py-2.5 rounded-xl border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] text-[14px] font-bold transition-all"
              >
                Close
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function BloodRequestsGrid({ requests }: { requests: ActiveBloodRequest[] }) {
  const [selectedRequest, setSelectedRequest] = useState<ActiveBloodRequest | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div key={req.id} className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl p-5 flex flex-col justify-between min-h-[220px] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start gap-3 mb-6">
              <div className="flex items-center gap-4 min-w-0">
                <div className="blood-badge h-12 w-12 shrink-0 rounded-xl text-lg font-bold">{req.bloodGroup}</div>
                <div className="min-w-0">
                  <h3 className="text-[16px] font-semibold text-[var(--adm-fg)] leading-tight truncate">{req.requesterName ?? "Unnamed requester"}</h3>
                  <p className="text-[13px] text-[var(--adm-fg-dim)] mt-1">
                    Request #{req.id} · {formatDate(req.createdAt)}
                  </p>
                </div>
              </div>

              <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide shadow-sm ${urgencyClass(req.urgency)}`}>
                {formatUrgency(req.urgency)}
              </span>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center gap-3 text-[14px]">
                <span className="text-[var(--adm-fg-dim)]">Contact</span>
                <span className="text-[var(--adm-fg)] font-medium truncate">{req.requesterContact ?? "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[var(--adm-fg-dim)]">Units needed</span>
                <span className="text-[var(--adm-fg)] font-medium">{req.requiredUnits}</span>
              </div>
              <div className="flex justify-between items-center gap-3 text-[14px]">
                <span className="text-[var(--adm-fg-dim)]">Donor</span>
                <span className="text-[var(--adm-fg)] font-medium truncate">
                  {req.fulfilledByDonorName ?? req.acceptedByDonorName ?? req.requestedToDonorName ?? "Not assigned"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-4 border-t border-[color:var(--adm-border)]">
              <span className={requestStatusBadgeClass(req.status)}>{formatRequestStatus(req.status)}</span>
              <button
                type="button"
                onClick={() => setSelectedRequest(req)}
                className="bg-[#dc2626] hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all shadow-sm"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <RequestDetailsDialog request={selectedRequest} onClose={() => setSelectedRequest(null)} />
    </>
  );
}
