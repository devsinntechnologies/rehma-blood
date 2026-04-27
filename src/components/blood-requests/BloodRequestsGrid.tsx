"use client"

import React, { useState } from 'react';
import MatchModal from './MatchModal';

export default function BloodRequestsGrid({ requests }: { requests: any[] }) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

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
                  <h3 className="text-[16px] font-semibold text-[var(--adm-fg)] leading-tight">{req.patient}</h3>
                  <p className="text-[13px] text-[var(--adm-fg-dim)] mt-1">{req.id} · {req.date}</p>
                </div>
              </div>
              
              {req.priority === 'Critical' && (
                <span className="bg-[#dc2626] text-white px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide shadow-sm">Critical</span>
              )}
              {req.priority === 'High' && (
                <span className="bg-[#ea580c] text-white px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide shadow-sm">High</span>
              )}
              {req.priority === 'Normal' && (
                <span className="bg-[#1e40af] text-white px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide shadow-sm">Normal</span>
              )}
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[var(--adm-fg-dim)]">Hospital</span>
                <span className="text-[var(--adm-fg)] font-medium">{req.hospital}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[var(--adm-fg-dim)]">City</span>
                <span className="text-[var(--adm-fg)] font-medium">{req.city}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[var(--adm-fg-dim)]">Units needed</span>
                <span className="text-[var(--adm-fg)] font-medium">{req.units}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-4 border-t border-[color:var(--adm-border)]">
              <div>
                {req.status === 'Open' && <span className="status-badge-verification">Open</span>}
                {req.status === 'Matched' && <span className="status-badge-pending">Matched</span>}
                {req.status === 'Fulfilled' && <span className="status-badge-active">Fulfilled</span>}
                {req.status === 'Cancelled' && <span className="status-badge-inactive">Cancelled</span>}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="bg-transparent border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all">
                  View
                </button>
                <button 
                  onClick={() => setSelectedRequest(req)}
                  className="bg-[#dc2626] hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all shadow-sm"
                >
                  Match
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
