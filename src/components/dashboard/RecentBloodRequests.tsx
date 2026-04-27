"use client";

import React from "react";

const bloodRequests = [
  { id: 1, name: "Kamran Shah", hospital: "Aga Khan Hospital · Karachi", bloodGroup: "O-", urgency: "Critical" },
  { id: 2, name: "Maria Yousuf", hospital: "Shaukat Khanum · Lahore", bloodGroup: "A+", urgency: "High" },
  { id: 3, name: "Rizwan Ahmed", hospital: "PIMS · Islamabad", bloodGroup: "B+", urgency: "Normal" },
  { id: 4, name: "Hina Aslam", hospital: "Indus Hospital · Karachi", bloodGroup: "AB-", urgency: "Critical" },
  { id: 5, name: "Saad Mir", hospital: "Jinnah Hospital · Lahore", bloodGroup: "O+", urgency: "High" },
];

export default function RecentBloodRequests() {
  return (
    <div className="flex flex-col rounded-xl border p-5 bg-[var(--adm-surface)] border-[color:var(--adm-border)] h-full shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[var(--adm-fg)] text-[17px] font-semibold">Recent Blood Requests</h3>
        <span className="text-xs text-[var(--adm-fg-dim)] font-medium bg-[var(--adm-surface-2)] px-2 py-1 rounded-md border border-[color:var(--adm-border)]">{bloodRequests.length} total</span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {bloodRequests.map((req) => {
          let badgeClass = "bg-blue-500/10 text-blue-600 border-blue-500/20"; // Normal
          if (req.urgency === "Critical") badgeClass = "bg-red-500 text-white shadow-sm";
          if (req.urgency === "High") badgeClass = "bg-orange-500 text-white shadow-sm";

          return (
            <div
              key={req.id}
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] hover:border-[var(--adm-fg-faint)] transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="blood-badge h-12 w-12 shrink-0 rounded-xl text-lg font-bold">
                  {req.bloodGroup}
                </div>
                <div>
                  <div className="text-[var(--adm-fg)] text-[15px] font-semibold mb-0.5">{req.name}</div>
                  <div className="text-[var(--adm-fg-dim)] text-[12px] font-medium">{req.hospital}</div>
                </div>
              </div>
              <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-[11px] font-bold w-fit whitespace-nowrap shrink-0 border ${badgeClass}`}>
                {req.urgency}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
