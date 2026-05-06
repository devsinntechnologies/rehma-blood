import React from 'react';
import { Loader2 } from 'lucide-react';
import type { Donation } from '@/store/donationsSlice';

type DonationsTableProps = {
  donations: Donation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const formatDate = (value: string) => new Date(value).toLocaleDateString();

const isCompleted = (value: string) => value.toLowerCase() === 'completed';

export default function DonationsTable({ donations, status, error }: DonationsTableProps) {
  return (
    <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl overflow-hidden">
      {(status === 'loading' || status === 'idle') && (
        <div className="p-6 text-sm text-[var(--adm-fg-dim)] flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Loading donations...
        </div>
      )}

      {status === 'failed' && (
        <div className="p-6 text-sm text-red-500">{error ?? 'Unable to load donations.'}</div>
      )}

      {status === 'succeeded' && donations.length === 0 && (
        <div className="p-6 text-sm text-[var(--adm-fg-dim)]">No donations found.</div>
      )}

      {status === 'succeeded' && donations.length > 0 && (
      <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[color:var(--adm-border)]">
              {['ID', 'Donor', 'Group', 'Date', 'Status'].map((col) => (
                <th key={col} className="text-left px-6 py-4 text-[12px] font-semibold text-[var(--adm-fg-dim)] uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donations.map((row, i) => {
              return (
                <tr
                  key={row.id}
                  className={`border-b border-[color:var(--adm-border)] hover:bg-[var(--adm-hover)] transition-colors ${i === donations.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className="px-6 py-4 text-[13px] text-[var(--adm-fg-dim)] font-mono">DN{String(row.id).padStart(4, '0')}</td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-[var(--adm-fg)]">{row.donorName}</td>
                  <td className="px-6 py-4">
                    <span className="blood-badge px-2 py-0.5 min-w-[36px]">{row.bloodGroup}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[var(--adm-fg-dim)]">{formatDate(row.createdAt)}</td>
                  <td className="px-6 py-4">
                    {isCompleted(row.status)
                      ? <span className="status-badge-completed">Completed</span>
                      : <span className="status-badge-verification">{row.status}</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[color:var(--adm-border)]">
        {donations.map((row) => (
            <div key={row.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="blood-badge w-9 h-9 text-[12px]">{row.bloodGroup}</span>
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--adm-fg)]">{row.donorName}</p>
                    <p className="text-[11px] text-[var(--adm-fg-dim)]">DN{String(row.id).padStart(4, '0')}</p>
                  </div>
                </div>
                {isCompleted(row.status)
                  ? <span className="status-badge-completed">Completed</span>
                  : <span className="status-badge-verification">{row.status}</span>
                }
              </div>
              <div className="grid grid-cols-1 gap-2 text-[12px]">
                <div>
                  <span className="text-[var(--adm-fg-dim)]">Date: </span>
                  <span className="text-[var(--adm-fg)] font-medium">{formatDate(row.createdAt)}</span>
                </div>
              </div>
            </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
}
