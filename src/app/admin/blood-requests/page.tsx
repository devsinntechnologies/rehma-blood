"use client"

import React, { useState } from 'react';
import BloodRequestsHeader from "@/components/blood-requests/BloodRequestsHeader";
import BloodRequestsFilter from "@/components/blood-requests/BloodRequestsFilter";
import BloodRequestsGrid from "@/components/blood-requests/BloodRequestsGrid";

export const requestsData = [
  { id: "R1001", date: "2026-04-22", patient: "Kamran Shah", bloodGroup: "O-", priority: "Critical", hospital: "Aga Khan Hospital", city: "Karachi", units: 2, status: "Open" },
  { id: "R1002", date: "2026-04-21", patient: "Maria Yousuf", bloodGroup: "A+", priority: "High", hospital: "Shaukat Khanum", city: "Lahore", units: 3, status: "Matched" },
  { id: "R1003", date: "2026-04-19", patient: "Rizwan Ahmed", bloodGroup: "B+", priority: "Normal", hospital: "PIMS", city: "Islamabad", units: 1, status: "Fulfilled" },
  { id: "R1004", date: "2026-04-23", patient: "Hina Aslam", bloodGroup: "AB-", priority: "Critical", hospital: "Indus Hospital", city: "Karachi", units: 2, status: "Open" },
  { id: "R1005", date: "2026-04-20", patient: "Saad Mir", bloodGroup: "O+", priority: "High", hospital: "Jinnah Hospital", city: "Lahore", units: 4, status: "Matched" },
  { id: "R1006", date: "2026-04-18", patient: "Nida Rauf", bloodGroup: "A-", priority: "Normal", hospital: "Liaquat National", city: "Karachi", units: 1, status: "Cancelled" },
];

export default function BloodRequestsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requestsData.filter(req => {
    if (activeTab !== 'All' && req.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!req.patient.toLowerCase().includes(q) && !req.hospital.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <BloodRequestsHeader />
      <BloodRequestsFilter 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsCount={filteredRequests.length}
      />
      <BloodRequestsGrid requests={filteredRequests} />
    </div>
  );
}
