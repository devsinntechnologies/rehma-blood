import React from 'react';
import { MapPin, Phone } from 'lucide-react';

const donors = [
  { id: "D001", name: "Ali Raza", bloodGroup: "O+", location: "Karachi", contact: "+92 300 1234567", donations: 8, lastDonation: "2026-02-14", status: "Active" },
  { id: "D002", name: "Fatima Noor", bloodGroup: "A-", location: "Lahore", contact: "+92 301 2345678", donations: 4, lastDonation: "2026-03-20", status: "Active" },
  { id: "D003", name: "Hamza Tariq", bloodGroup: "B+", location: "Islamabad", contact: "+92 302 3456789", donations: 12, lastDonation: "2025-11-08", status: "Active" },
  { id: "D004", name: "Zainab Khan", bloodGroup: "AB+", location: "Karachi", contact: "+92 303 4567890", donations: 3, lastDonation: "2026-01-02", status: "Inactive" },
  { id: "D005", name: "Omar Sheikh", bloodGroup: "O-", location: "Multan", contact: "+92 304 5678901", donations: 6, lastDonation: "2026-04-01", status: "Active" },
  { id: "D006", name: "Ayesha Malik", bloodGroup: "A+", location: "Faisalabad", contact: "+92 305 6789012", donations: 0, lastDonation: "-", status: "Pending" },
  { id: "D007", name: "Bilal Qureshi", bloodGroup: "B-", location: "Peshawar", contact: "+92 306 7890123", donations: 9, lastDonation: "2025-09-15", status: "Active" },
  { id: "D008", name: "Sana Iqbal", bloodGroup: "O+", location: "Karachi", contact: "+92 307 8901234", donations: 2, lastDonation: "2026-04-10", status: "Active" },
  { id: "D009", name: "Usman Farooq", bloodGroup: "A+", location: "Lahore", contact: "+92 308 9012345", donations: 5, lastDonation: "2026-03-05", status: "Active" },
  { id: "D010", name: "Rida Hussain", bloodGroup: "O-", location: "Islamabad", contact: "+92 309 0123456", donations: 7, lastDonation: "2026-02-20", status: "Active" },
  { id: "D011", name: "Tariq Mehmood", bloodGroup: "B+", location: "Karachi", contact: "+92 310 1234567", donations: 11, lastDonation: "2026-01-15", status: "Active" },
  { id: "D012", name: "Sara Ahmed", bloodGroup: "AB-", location: "Rawalpindi", contact: "+92 311 2345678", donations: 3, lastDonation: "2026-03-28", status: "Active" },
];

export default function DonorsTable() {
  return (
    <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--adm-border)]">
              <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">ID</th>
              <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Donor</th>
              <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Blood Group</th>
              <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Location</th>
              <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Contact</th>
              <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Donations</th>
              <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Last Donation</th>
              <th className="px-5 py-4 text-xs font-semibold text-[var(--adm-fg-dim)] whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--adm-border)]">
            {donors.map((donor) => (
              <tr key={donor.id} className="hover:bg-[var(--adm-hover)] transition-colors group">
                <td className="px-5 py-[14px] text-[13px] font-medium text-[var(--adm-fg-faint)] whitespace-nowrap">{donor.id}</td>
                <td className="px-5 py-[14px] text-[14px] font-semibold text-[var(--adm-fg)] whitespace-nowrap">{donor.name}</td>
                <td className="px-5 py-[14px] whitespace-nowrap">
                  <div className="blood-badge h-8 min-w-[32px] px-1.5">
                    {donor.bloodGroup}
                  </div>
                </td>
                <td className="px-5 py-[14px] whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-[13px] text-[var(--adm-fg-dim)]">
                    <MapPin size={14} className="text-[var(--adm-fg-faint)]" />
                    {donor.location}
                  </div>
                </td>
                <td className="px-5 py-[14px] whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-[13px] text-[var(--adm-fg-dim)]">
                    <Phone size={14} className="text-[var(--adm-fg-faint)]" />
                    {donor.contact}
                  </div>
                </td>
                <td className="px-5 py-[14px] text-[14px] font-medium text-[var(--adm-fg)] whitespace-nowrap">{donor.donations}</td>
                <td className="px-5 py-[14px] text-[13px] font-medium text-[var(--adm-fg-dim)] whitespace-nowrap">{donor.lastDonation}</td>
                <td className="px-5 py-[14px] whitespace-nowrap">
                  {donor.status === 'Active' && <span className="status-badge-active">Active</span>}
                  {donor.status === 'Inactive' && <span className="status-badge-inactive">Inactive</span>}
                  {donor.status === 'Pending' && <span className="status-badge-pending">Pending</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
