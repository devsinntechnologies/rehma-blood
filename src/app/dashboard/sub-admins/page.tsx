"use client";

import React, { useState } from 'react';
import { Plus, Pencil, Ban } from 'lucide-react';

const subAdmins = [
  {
    id: 1,
    name: 'Imran Khan',
    email: 'imran@rehma.org',
    status: 'Active',
    region: 'Karachi',
    created: '2026-01-12',
    permissions: ['View Donors', 'Edit Donors', 'View Requests'],
  },
  {
    id: 2,
    name: 'Noor Jehan',
    email: 'noor@rehma.org',
    status: 'Active',
    region: 'Lahore',
    created: '2026-02-03',
    permissions: ['View Donors', 'View Requests', 'Manage Requests'],
  },
  {
    id: 3,
    name: 'Tariq Mahmood',
    email: 'tariq@rehma.org',
    status: 'Suspended',
    region: 'Islamabad',
    created: '2025-12-20',
    permissions: ['View Donors'],
  },
];

export default function SubAdminsPage() {
  const [admins, setAdmins] = useState(subAdmins);

  const toggleSuspend = (id: number) => {
    setAdmins(prev =>
      prev.map(a => a.id === id
        ? { ...a, status: a.status === 'Active' ? 'Suspended' : 'Active' }
        : a
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[24px] font-bold text-[var(--adm-fg)] mb-1">Sub-Admins</h1>
          <p className="text-[14px] text-[var(--adm-fg-faint)]">Manage regional sub-administrators and permissions</p>
        </div>
        <button className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all shadow-[0_4px_12px_rgba(220,38,38,0.1)]">
          <Plus size={16} />
          Add Sub-Admin
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl p-5 flex flex-col gap-5 shadow-sm hover:shadow-md transition-all"
          >
            {/* Card Top */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-bold text-[var(--adm-fg)] leading-tight">{admin.name}</h3>
                <p className="text-[12px] text-[var(--adm-fg-dim)] mt-0.5">{admin.email}</p>
              </div>
              <span className={admin.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}>
                {admin.status}
              </span>
            </div>

            {/* Region / Created */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[var(--adm-fg-dim)]">Region</span>
                <span className="text-[var(--adm-fg)] font-medium">{admin.region}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[var(--adm-fg-dim)]">Created</span>
                <span className="text-[var(--adm-fg)] font-medium">{admin.created}</span>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <p className="text-[11px] text-[var(--adm-fg-dim)] font-bold uppercase tracking-wider mb-2.5">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {admin.permissions.map((perm) => (
                  <span key={perm} className="blood-badge px-2 py-0.5 rounded text-[11px] font-semibold">
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1 border-t border-[color:var(--adm-border)] mt-2">
              <button className="flex-1 flex items-center justify-center gap-2 border border-[color:var(--adm-border)] text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] py-2 rounded-xl text-[13px] font-semibold transition-colors">
                <Pencil size={13} />
                Edit
              </button>
              <button
                onClick={() => toggleSuspend(admin.id)}
                className={`flex-1 flex items-center justify-center gap-2 border py-2 rounded-xl text-[13px] font-semibold transition-colors ${
                  admin.status === 'Active'
                    ? 'border-red-500/20 text-[#ef4444] hover:bg-red-500/5'
                    : 'border-green-500/20 text-[#22c55e] hover:bg-green-500/5'
                }`}
              >
                <Ban size={13} />
                {admin.status === 'Active' ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
