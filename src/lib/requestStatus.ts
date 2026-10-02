/** Human labels and groupings for the backend's blood request statuses. */
export const REQUEST_STATUS_LABELS: Record<string, string> = {
  active: "Open",
  request_pending: "Awaiting Donor",
  request_accepted: "Donor Accepted",
  accepted: "Scheduled",
  on_the_way: "Donor On The Way",
  arrived_at_hospital: "Donor At Hospital",
  donation_completed: "Completed",
};

export const REQUEST_STATUS_GROUPS = {
  Open: ["active", "request_pending"],
  "In Progress": ["request_accepted", "accepted", "on_the_way", "arrived_at_hospital"],
  Completed: ["donation_completed"],
} as const;

export type RequestStatusTab = "All" | keyof typeof REQUEST_STATUS_GROUPS;

export function formatRequestStatus(status: string) {
  return (
    REQUEST_STATUS_LABELS[status] ??
    status
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function requestStatusBadgeClass(status: string) {
  if (status === "donation_completed") return "status-badge-active";
  if (status === "active") return "status-badge-verification";
  return "status-badge-pending";
}

export function formatUrgency(urgency: string | null | undefined) {
  return urgency?.toLowerCase() === "urgent" ? "Urgent" : "Normal";
}

export function isUrgent(urgency: string | null | undefined) {
  return urgency?.toLowerCase() === "urgent";
}
