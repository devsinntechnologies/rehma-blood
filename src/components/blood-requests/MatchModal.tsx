import React from 'react';
import { X, Droplet, MapPin, Phone, Clock, Star } from 'lucide-react';

export default function MatchModal({ request, onClose }: { request: any, onClose: () => void }) {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] w-full max-w-[680px] rounded-2xl flex flex-col overflow-hidden max-h-[90vh] shadow-2xl transition-colors">
        
        {/* Header */}
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute right-6 top-6 text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] transition-colors">
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-2 text-[13px] text-[var(--adm-fg-dim)] font-medium mb-2">
            <Droplet size={14} className="text-red-500" />
            <span>Donor Matching · {request.id}</span>
          </div>
          
          <h2 className="text-[22px] font-bold text-[var(--adm-fg)] mb-1.5">{request.patient}</h2>
          
          <div className="flex items-center gap-3 text-[14px] text-[var(--adm-fg-dim)]">
            <span>{request.hospital} · {request.city}</span>
            {request.priority === 'Critical' && (
              <span className="bg-[#dc2626] text-white px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide">Critical</span>
            )}
            {request.priority === 'High' && (
              <span className="bg-[#ea580c] text-white px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide">High</span>
            )}
            {request.priority === 'Normal' && (
              <span className="bg-[#172554] border border-[#1e3a8a] text-[#60a5fa] px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide">Normal</span>
            )}
          </div>
        </div>

        {/* Summary Box */}
        <div className="px-6 py-5 bg-[var(--adm-surface-2)] border-y border-[color:var(--adm-border)] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="blood-badge h-[64px] w-[64px] shrink-0 rounded-[14px] text-xl font-bold">
              {request.bloodGroup}
            </div>
            
            <div className="flex flex-col gap-1 pr-6 border-r border-[color:var(--adm-border)]">
              <span className="text-[12px] text-[var(--adm-fg-dim)] font-medium">Required blood group</span>
              <span className="text-[16px] text-[var(--adm-fg)] font-medium">{request.bloodGroup} · {request.units} units</span>
            </div>

            <div className="flex flex-col gap-1.5 pl-2">
              <span className="text-[12px] text-[var(--adm-fg-dim)] font-medium">Compatible blood types</span>
              <div className="flex items-center gap-2">
                {request.bloodGroup === 'O-' ? (
                  <span className="blood-badge px-2 py-0.5 min-w-[32px]">O-</span>
                ) : (
                  <>
                    <span className="border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] px-2 py-0.5 rounded text-[12px] font-medium">O-</span>
                    <span className="border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] px-2 py-0.5 rounded text-[12px] font-medium">O+</span>
                    <span className="border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] px-2 py-0.5 rounded text-[12px] font-medium">A-</span>
                    <span className="blood-badge px-2 py-0.5 min-w-[32px]">A+</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end justify-center">
            <span className="text-[32px] font-bold text-[var(--adm-fg)] leading-none">{request.bloodGroup === 'O-' ? '2' : '7'}</span>
            <span className="text-[11px] text-[var(--adm-fg-dim)] mt-1 font-medium text-right">compatible donors</span>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--adm-bg)] flex flex-col gap-4 custom-scrollbar">
          
          <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <span className="text-[13px] text-[var(--adm-fg-faint)] font-medium mt-2">#1</span>
                <div className="blood-badge h-10 w-10 shrink-0 rounded-xl text-sm font-bold">
                  {request.bloodGroup === 'O-' ? 'O-' : 'O+'}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[16px] font-semibold text-[var(--adm-fg)]">{request.bloodGroup === 'O-' ? 'Rida Hussain' : 'Sana Iqbal'}</h3>
                    {request.bloodGroup === 'O-' && (
                      <span className="flex items-center gap-1 border border-[#7f1d1d] text-[#ef4444] bg-[#450a0a]/10 px-2 py-0.5 rounded-full text-[11px] font-medium">
                        <Star size={10} fill="currentColor" /> Exact match
                      </span>
                    )}
                    <span className="border border-[#713f12] text-[#eab308] bg-[#422006]/10 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                      Not yet eligible
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[13px] text-[var(--adm-fg-dim)] mb-2">
                    <span className="flex items-center gap-1.5"><MapPin size={13} /> {request.bloodGroup === 'O-' ? 'Islamabad' : 'Karachi'}</span>
                    <span className="flex items-center gap-1.5"><Phone size={13} /> {request.bloodGroup === 'O-' ? '+92 309 0123456' : '+92 307 8901234'}</span>
                    <span>{request.bloodGroup === 'O-' ? '7' : '2'} donations total</span>
                  </div>
                  
                  {request.bloodGroup === 'O-' ? (
                    <div className="flex items-center gap-1.5 text-[13px] text-[#eab308] font-medium mb-4">
                      <Clock size={13} /> 66d ago – soon eligible
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#ef4444] font-medium mb-4">
                      <Clock size={13} /> 17d ago – not eligible
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <span className="text-[12px] text-[var(--adm-fg-dim)] w-16">Match score</span>
                    <div className="flex-1 max-w-[240px] h-1.5 bg-[var(--adm-surface-2)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${request.bloodGroup === 'O-' ? 'bg-[#eab308]' : 'bg-[#ef4444]'}`} style={{ width: request.bloodGroup === 'O-' ? '60%' : '30%' }}></div>
                    </div>
                    <span className="text-[13px] text-[var(--adm-fg-dim)]">{request.bloodGroup === 'O-' ? '60%' : '30%'}</span>
                  </div>
                </div>
              </div>
              <button className="bg-[#dc2626] hover:bg-red-700 text-white px-5 py-1.5 rounded-lg text-[13px] font-medium transition-all shadow-sm">
                Assign
              </button>
            </div>
          </div>

          {request.bloodGroup === 'O-' && (
            <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <span className="text-[13px] text-[var(--adm-fg-faint)] font-medium mt-2">#2</span>
                  <div className="blood-badge h-10 w-10 shrink-0 rounded-xl text-sm font-bold">
                    O-
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[16px] font-semibold text-[var(--adm-fg)]">Omar Sheikh</h3>
                      <span className="flex items-center gap-1 border border-[#7f1d1d] text-[#ef4444] bg-[#450a0a]/10 px-2 py-0.5 rounded-full text-[11px] font-medium">
                        <Star size={10} fill="currentColor" /> Exact match
                      </span>
                      <span className="border border-[#713f12] text-[#eab308] bg-[#422006]/10 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                        Not yet eligible
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[13px] text-[var(--adm-fg-dim)] mb-2">
                      <span className="flex items-center gap-1.5"><MapPin size={13} /> Multan</span>
                      <span className="flex items-center gap-1.5"><Phone size={13} /> +92 304 5678901</span>
                      <span>6 donations total</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[13px] text-[#ef4444] font-medium mb-4">
                      <Clock size={13} /> 26d ago – not eligible
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[12px] text-[var(--adm-fg-dim)] w-16">Match score</span>
                      <div className="flex-1 max-w-[240px] h-1.5 bg-[var(--adm-surface-2)] rounded-full overflow-hidden">
                        <div className="h-full bg-[#ef4444] rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-[13px] text-[var(--adm-fg-dim)]">30%</span>
                    </div>
                  </div>
                </div>
                <button className="bg-[#dc2626] hover:bg-red-700 text-white px-5 py-1.5 rounded-lg text-[13px] font-medium transition-all shadow-sm">
                  Assign
                </button>
              </div>
            </div>
          )}
          
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] flex items-center justify-between">
          <span className="text-[14px] text-[var(--adm-fg-dim)]">Select a compatible donor to assign</span>
          <div className="flex gap-3">
            <button onClick={onClose} className="border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] px-5 py-2 rounded-lg text-[14px] font-medium transition-all bg-transparent">
              Cancel
            </button>
            <button onClick={onClose} className="bg-[#dc2626] hover:bg-red-700 text-white px-5 py-2 rounded-lg text-[14px] font-medium transition-all shadow-sm">
              Confirm Match
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
