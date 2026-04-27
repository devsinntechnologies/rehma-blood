"use client"

import React from 'react';
import { X, Droplet, MapPin, Phone, Clock, Star } from 'lucide-react';

export default function MatchModal({ request, onClose }: { request: any, onClose: () => void }) {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-300">
      <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] w-full max-w-[680px] rounded-[24px] flex flex-col overflow-hidden max-h-[90vh] shadow-2xl transition-colors">
        
        {/* Header */}
        <div className="p-6 md:p-8 relative">
          <button onClick={onClose} className="absolute right-6 top-6 text-[var(--adm-fg-faint)] hover:text-[var(--adm-fg)] transition-colors p-2 hover:bg-[var(--adm-hover)] rounded-full">
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-2 text-[13px] text-[var(--adm-fg-dim)] font-bold mb-3 uppercase tracking-wider">
            <Droplet size={14} className="text-[var(--adm-accent)]" />
            <span>Donor Matching · {request.id}</span>
          </div>
          
          <h2 className="text-[26px] font-bold text-[var(--adm-fg)] mb-2 tracking-tight">{request.patient}</h2>
          
          <div className="flex items-center gap-3 text-[15px] text-[var(--adm-fg-dim)] font-medium">
            <span>{request.hospital} · {request.city}</span>
            {request.priority === 'Critical' && (
              <span className="bg-[#dc2626] text-white px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm shadow-red-500/20">Critical</span>
            )}
            {request.priority === 'High' && (
              <span className="bg-[#ea580c] text-white px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm shadow-orange-500/20">High</span>
            )}
            {request.priority === 'Normal' && (
              <span className="bg-[#3b82f6] text-white px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm shadow-blue-500/20">Normal</span>
            )}
          </div>
        </div>

        {/* Summary Box */}
        <div className="px-6 md:px-8 py-6 bg-[var(--adm-surface-2)] border-y border-[color:var(--adm-border)] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="blood-badge h-16 w-16 shrink-0 rounded-[20px] text-2xl font-bold shadow-lg shadow-red-500/10 border-2">
              {request.bloodGroup}
            </div>
            
            <div className="flex flex-col gap-1 pr-8 border-r border-[color:var(--adm-border)]">
              <span className="text-[12px] text-[var(--adm-fg-faint)] font-bold uppercase tracking-wide">Required</span>
              <span className="text-[17px] text-[var(--adm-fg)] font-bold">{request.bloodGroup} · {request.units} units</span>
            </div>

            <div className="flex flex-col gap-1.5 pl-2">
              <span className="text-[12px] text-[var(--adm-fg-faint)] font-bold uppercase tracking-wide">Compatible types</span>
              <div className="flex items-center gap-2">
                {request.bloodGroup === 'O-' ? (
                  <span className="blood-badge px-2.5 py-0.5 min-w-[36px] rounded-lg">O-</span>
                ) : (
                  <>
                    <span className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] px-2 py-0.5 rounded-lg text-[12px] font-bold">O-</span>
                    <span className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] px-2 py-0.5 rounded-lg text-[12px] font-bold">O+</span>
                    <span className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] px-2 py-0.5 rounded-lg text-[12px] font-bold">A-</span>
                    <span className="blood-badge px-2.5 py-0.5 min-w-[36px] rounded-lg">A+</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end justify-center">
            <span className="text-[36px] font-black text-[var(--adm-accent)] leading-none drop-shadow-sm">{request.bloodGroup === 'O-' ? '2' : '7'}</span>
            <span className="text-[11px] text-[var(--adm-fg-dim)] mt-1 font-bold text-right uppercase tracking-wider">Matches</span>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[var(--adm-bg)]/50 flex flex-col gap-4 custom-scrollbar">
          
          <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-[20px] p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all group/card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-5">
                <span className="text-[13px] text-[var(--adm-fg-faint)] font-bold mt-2">01</span>
                <div className="blood-badge h-12 w-12 shrink-0 rounded-[14px] text-[16px] font-bold shadow-sm">
                  {request.bloodGroup === 'O-' ? 'O-' : 'O+'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-[17px] font-bold text-[var(--adm-fg)]">{request.bloodGroup === 'O-' ? 'Rida Hussain' : 'Sana Iqbal'}</h3>
                    {request.bloodGroup === 'O-' && (
                      <span className="flex items-center gap-1.5 bg-[var(--adm-accent-soft-bg)] text-[var(--adm-accent)] px-3 py-0.5 rounded-full text-[11px] font-bold border border-[var(--adm-accent-soft-border)] shadow-sm">
                        <Star size={10} fill="currentColor" /> EXACT MATCH
                      </span>
                    )}
                    <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-0.5 rounded-full text-[11px] font-bold shadow-sm">
                      INELIGIBLE
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[var(--adm-fg-dim)] font-medium mb-4">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[var(--adm-fg-faint)]" /> {request.bloodGroup === 'O-' ? 'Islamabad' : 'Karachi'}</span>
                    <span className="flex items-center gap-1.5"><Phone size={14} className="text-[var(--adm-fg-faint)]" /> {request.bloodGroup === 'O-' ? '+92 309 0123456' : '+92 307 8901234'}</span>
                    <span className="flex items-center gap-1.5"><Droplet size={14} className="text-[var(--adm-fg-faint)]" /> {request.bloodGroup === 'O-' ? '7' : '2'} donations</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[13px] font-bold mb-5">
                    {request.bloodGroup === 'O-' ? (
                      <div className="flex items-center gap-1.5 text-amber-600 bg-amber-500/5 px-2.5 py-1 rounded-lg">
                        <Clock size={14} /> 66 days since last donation
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-600 bg-red-500/5 px-2.5 py-1 rounded-lg">
                        <Clock size={14} /> 17 days ago – too soon
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[12px] text-[var(--adm-fg-faint)] font-bold uppercase tracking-wider w-24">Match score</span>
                    <div className="flex-1 max-w-[200px] h-2 bg-[var(--adm-surface-2)] rounded-full overflow-hidden border border-[color:var(--adm-border)]">
                      <div className={`h-full rounded-full transition-all duration-1000 ${request.bloodGroup === 'O-' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]'}`} style={{ width: request.bloodGroup === 'O-' ? '60%' : '30%' }}></div>
                    </div>
                    <span className={`text-[13px] font-black ${request.bloodGroup === 'O-' ? 'text-amber-600' : 'text-red-600'}`}>{request.bloodGroup === 'O-' ? '60%' : '30%'}</span>
                  </div>
                </div>
              </div>
              <button className="bg-[var(--adm-accent)] hover:bg-red-700 active:scale-95 text-white px-6 py-2 rounded-xl text-[13px] font-bold transition-all shadow-lg shadow-red-500/20">
                Assign
              </button>
            </div>
          </div>

          {request.bloodGroup === 'O-' && (
            <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-[20px] p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all group/card">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-5">
                  <span className="text-[13px] text-[var(--adm-fg-faint)] font-bold mt-2">02</span>
                  <div className="blood-badge h-12 w-12 shrink-0 rounded-[14px] text-[16px] font-bold shadow-sm">
                    O-
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-[17px] font-bold text-[var(--adm-fg)]">Omar Sheikh</h3>
                      <span className="flex items-center gap-1.5 bg-[var(--adm-accent-soft-bg)] text-[var(--adm-accent)] px-3 py-0.5 rounded-full text-[11px] font-bold border border-[var(--adm-accent-soft-border)] shadow-sm">
                        <Star size={10} fill="currentColor" /> EXACT MATCH
                      </span>
                      <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-0.5 rounded-full text-[11px] font-bold shadow-sm">
                        INELIGIBLE
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[var(--adm-fg-dim)] font-medium mb-4">
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[var(--adm-fg-faint)]" /> Multan</span>
                      <span className="flex items-center gap-1.5"><Phone size={14} className="text-[var(--adm-fg-faint)]" /> +92 304 5678901</span>
                      <span className="flex items-center gap-1.5"><Droplet size={14} className="text-[var(--adm-fg-faint)]" /> 6 donations</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[13px] font-bold mb-5">
                      <div className="flex items-center gap-1.5 text-red-600 bg-red-500/5 px-2.5 py-1 rounded-lg">
                        <Clock size={14} /> 26 days since last donation
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[12px] text-[var(--adm-fg-faint)] font-bold uppercase tracking-wider w-24">Match score</span>
                      <div className="flex-1 max-w-[200px] h-2 bg-[var(--adm-surface-2)] rounded-full overflow-hidden border border-[color:var(--adm-border)]">
                        <div className="h-full bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.3)]" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-[13px] font-black text-red-600">30%</span>
                    </div>
                  </div>
                </div>
                <button className="bg-[var(--adm-accent)] hover:bg-red-700 active:scale-95 text-white px-6 py-2 rounded-xl text-[13px] font-bold transition-all shadow-lg shadow-red-500/20">
                  Assign
                </button>
              </div>
            </div>
          )}
          
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-[color:var(--adm-border)] bg-[var(--adm-surface-2)]/50 flex items-center justify-between">
          <span className="text-[14px] text-[var(--adm-fg-dim)] font-medium">Please select a compatible donor to proceed.</span>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] text-[14px] font-bold transition-all bg-transparent">
              Cancel
            </button>
            <button onClick={onClose} className="bg-[var(--adm-accent)] hover:bg-red-700 active:scale-95 text-white px-8 py-2.5 rounded-xl text-[14px] font-black transition-all shadow-xl shadow-red-500/20 tracking-wide">
              CONFIRM MATCH
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
