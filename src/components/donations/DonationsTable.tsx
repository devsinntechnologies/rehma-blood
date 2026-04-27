import React from 'react';

const donations = [
  { id: 'DN5001', donor: 'Ali Raza',      group: 'O+', hospital: 'Aga Khan Hospital', date: '2026-04-21', units: 1, status: 'Completed' },
  { id: 'DN5002', donor: 'Fatima Noor',   group: 'A-', hospital: 'Shaukat Khanum',    date: '2026-04-20', units: 1, status: 'Completed' },
  { id: 'DN5003', donor: 'Omar Sheikh',   group: 'O-', hospital: 'Indus Hospital',     date: '2026-04-19', units: 2, status: 'Completed' },
  { id: 'DN5004', donor: 'Sana Iqbal',    group: 'O+', hospital: 'Jinnah Hospital',   date: '2026-04-18', units: 1, status: 'Verification' },
  { id: 'DN5005', donor: 'Hamza Tariq',   group: 'B+', hospital: 'PIMS',              date: '2026-04-16', units: 1, status: 'Completed' },
  { id: 'DN5006', donor: 'Bilal Qureshi', group: 'B-', hospital: 'Liaquat National',  date: '2026-04-14', units: 2, status: 'Completed' },
];


export default function DonationsTable() {
  return (
    <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[color:var(--adm-border)]">
              {['ID', 'Donor', 'Group', 'Hospital', 'Date', 'Units', 'Status'].map((col) => (
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
                  <td className="px-6 py-4 text-[13px] text-[var(--adm-fg-dim)] font-mono">{row.id}</td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-[var(--adm-fg)]">{row.donor}</td>
                  <td className="px-6 py-4">
                    <span className="blood-badge px-2 py-0.5 min-w-[36px]">{row.group}</span>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[var(--adm-fg)]">{row.hospital}</td>
                  <td className="px-6 py-4 text-[13px] text-[var(--adm-fg-dim)]">{row.date}</td>
                  <td className="px-6 py-4 text-[14px] text-[var(--adm-fg)] font-medium">{row.units}</td>
                  <td className="px-6 py-4">
                    {row.status === 'Completed'
                      ? <span className="status-badge-completed">Completed</span>
                      : <span className="status-badge-verification">Verification</span>
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
                  <span className="blood-badge w-9 h-9 text-[12px]">{row.group}</span>
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--adm-fg)]">{row.donor}</p>
                    <p className="text-[11px] text-[var(--adm-fg-dim)]">{row.id}</p>
                  </div>
                </div>
                {row.status === 'Completed'
                  ? <span className="status-badge-completed">Completed</span>
                  : <span className="status-badge-verification">Verification</span>
                }
              </div>
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <span className="text-[var(--adm-fg-dim)]">Hospital: </span>
                  <span className="text-[var(--adm-fg)] font-medium">{row.hospital}</span>
                </div>
                <div>
                  <span className="text-[var(--adm-fg-dim)]">Date: </span>
                  <span className="text-[var(--adm-fg)] font-medium">{row.date}</span>
                </div>
                <div>
                  <span className="text-[var(--adm-fg-dim)]">Units: </span>
                  <span className="text-[var(--adm-fg)] font-medium">{row.units}</span>
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}
