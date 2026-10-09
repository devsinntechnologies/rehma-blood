"use client";

import React, { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

type UnitSummary = {
  requiredUnits: number;
  confirmedReceivedUnits: number;
  reportedAwaitingUnits: number;
  disputedUnits: number;
  activeReservedUnits: number;
  remainingNeed: number;
  capacityForNewCommitments: number;
};

type Participation = {
  id: number;
  status: string;
  unitsCommitted: number;
  unitsReported: number;
  unitsConfirmed: number;
  disputeReason?: string | null;
  needsAdminReconciliation?: boolean;
  legacyMigrated?: boolean;
};

type TrackingPayload = {
  summary: UnitSummary;
  participations: Participation[];
};

export function RequestTrackingPanel({ requestId }: { requestId: number }) {
  const token = useAppSelector((s) => s.auth.accessToken);
  const [tracking, setTracking] = useState<TrackingPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolveId, setResolveId] = useState<number | null>(null);
  const [resolveReason, setResolveReason] = useState("");
  const [resolveUnits, setResolveUnits] = useState(1);
  const [resolveOutcome, setResolveOutcome] = useState<"confirm_units" | "reject_report">("confirm_units");
  const [legacyReconcileId, setLegacyReconcileId] = useState<number | null>(null);
  const [legacyReported, setLegacyReported] = useState(0);
  const [audits, setAudits] = useState<
    { action: string; reason: string | null; fromStatus: string | null; toStatus: string | null; createdAt?: string }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<TrackingPayload>(`/blood-requests/${requestId}/tracking`, token);
      setTracking(data);
      try {
        const auditData = await apiRequest<{ audits: typeof audits }>(
          `/blood-requests/${requestId}/participation-audit`,
          token,
        );
        setAudits(auditData.audits ?? []);
      } catch {
        setAudits([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tracking");
    } finally {
      setLoading(false);
    }
  }, [requestId, token]);

  const submitLegacyReconcile = async () => {
    if (!token || legacyReconcileId == null || !resolveReason.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest(`/admin/participations/${legacyReconcileId}/reconcile-legacy`, token, {
        method: "POST",
        body: {
          unitsReported: legacyReported,
          unitsConfirmed: resolveUnits,
          reason: resolveReason.trim(),
        },
      });
      setLegacyReconcileId(null);
      setResolveReason("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reconcile failed");
    } finally {
      setSubmitting(false);
    }
  };

  const submitResolve = async () => {
    if (!token || resolveId == null || !resolveReason.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest(`/admin/participations/${resolveId}/resolve-dispute`, token, {
        method: "POST",
        body: {
          outcome: resolveOutcome,
          reason: resolveReason.trim(),
          ...(resolveOutcome === "confirm_units" ? { unitsConfirmed: resolveUnits } : {}),
        },
      });
      setResolveId(null);
      setResolveReason("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resolve failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-[20px] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[13px] font-bold text-[var(--adm-fg-dim)] uppercase tracking-wider">Unit tracking</div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading || !token}
          className="text-[13px] font-semibold text-[var(--adm-accent)] disabled:opacity-50"
        >
          {loading ? "Loading…" : tracking ? "Refresh" : "Load tracking"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {tracking && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[13px]">
            <Metric label="Remaining need" value={tracking.summary.remainingNeed} />
            <Metric label="Confirmed" value={tracking.summary.confirmedReceivedUnits} />
            <Metric label="Reported awaiting" value={tracking.summary.reportedAwaitingUnits} />
            <Metric label="Disputed" value={tracking.summary.disputedUnits} />
            <Metric label="Active reserved" value={tracking.summary.activeReservedUnits} />
            <Metric label="New capacity" value={tracking.summary.capacityForNewCommitments} />
          </div>
          <ul className="flex flex-col gap-2 mt-2">
            {tracking.participations.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[color:var(--adm-border)] px-3 py-2 text-[13px]"
              >
                <span>
                  #{p.id} · {p.status} · committed {p.unitsCommitted} / reported {p.unitsReported} / confirmed{" "}
                  {p.unitsConfirmed}
                </span>
                {p.needsAdminReconciliation && (
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg border text-[12px] font-semibold"
                    onClick={() => {
                      setLegacyReconcileId(p.id);
                      setLegacyReported(p.unitsReported);
                      setResolveUnits(0);
                    }}
                  >
                    Reconcile legacy
                  </button>
                )}
                {p.status === "disputed" && (
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-[var(--adm-accent)] text-white text-[12px] font-semibold"
                    onClick={() => {
                      setResolveId(p.id);
                      setResolveUnits(Math.max(1, p.unitsReported - p.unitsConfirmed));
                    }}
                  >
                    Resolve dispute
                  </button>
                )}
              </li>
            ))}
          </ul>
          {audits.length > 0 && (
            <div className="mt-3">
              <div className="text-[12px] font-bold uppercase text-[var(--adm-fg-dim)] mb-2">Audit history</div>
              <ul className="text-[12px] flex flex-col gap-1 max-h-40 overflow-y-auto">
                {audits.map((a, i) => (
                  <li key={i} className="text-[var(--adm-fg-dim)]">
                    {a.action}: {a.fromStatus ?? "—"} → {a.toStatus ?? "—"}
                    {a.reason ? ` (${a.reason})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      {legacyReconcileId != null && (
        <div className="mt-2 p-4 rounded-xl border border-[color:var(--adm-border)] flex flex-col gap-3">
          <div className="font-semibold text-[14px]">Legacy reconcile #{legacyReconcileId}</div>
          <input
            type="number"
            min={0}
            className="rounded-lg border px-2 py-2 bg-[var(--adm-surface)]"
            value={legacyReported}
            onChange={(e) => setLegacyReported(Number(e.target.value))}
            placeholder="Units reported (known)"
          />
          <input
            type="number"
            min={0}
            className="rounded-lg border px-2 py-2 bg-[var(--adm-surface)]"
            value={resolveUnits}
            onChange={(e) => setResolveUnits(Number(e.target.value))}
            placeholder="Units confirmed received"
          />
          <textarea
            className="rounded-lg border px-2 py-2 bg-[var(--adm-surface)] min-h-[72px]"
            placeholder="Reason (required)"
            value={resolveReason}
            onChange={(e) => setResolveReason(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-[var(--adm-accent)] text-white text-sm font-semibold disabled:opacity-50"
              onClick={() => void submitLegacyReconcile()}
            >
              {submitting ? "Saving…" : "Submit reconcile"}
            </button>
            <button type="button" className="text-sm" onClick={() => setLegacyReconcileId(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {resolveId != null && (
        <div className="mt-2 p-4 rounded-xl border border-[color:var(--adm-border)] flex flex-col gap-3">
          <div className="font-semibold text-[14px]">Resolve participation #{resolveId}</div>
          <select
            className="rounded-lg border px-2 py-2 bg-[var(--adm-surface)]"
            value={resolveOutcome}
            onChange={(e) => setResolveOutcome(e.target.value as "confirm_units" | "reject_report")}
          >
            <option value="confirm_units">Confirm reported units</option>
            <option value="reject_report">Reject report</option>
          </select>
          {resolveOutcome === "confirm_units" && (
            <input
              type="number"
              min={1}
              className="rounded-lg border px-2 py-2 bg-[var(--adm-surface)]"
              value={resolveUnits}
              onChange={(e) => setResolveUnits(Number(e.target.value))}
            />
          )}
          <textarea
            className="rounded-lg border px-2 py-2 bg-[var(--adm-surface)] min-h-[72px]"
            placeholder="Reason (required)"
            value={resolveReason}
            onChange={(e) => setResolveReason(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-[var(--adm-accent)] text-white text-sm font-semibold disabled:opacity-50"
              onClick={() => void submitResolve()}
            >
              {submitting ? "Saving…" : "Submit"}
            </button>
            <button type="button" className="text-sm" onClick={() => setResolveId(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-[var(--adm-surface)] px-2 py-2">
      <div className="text-[10px] uppercase text-[var(--adm-fg-faint)]">{label}</div>
      <div className="font-bold text-[15px]">{value}</div>
    </div>
  );
}
