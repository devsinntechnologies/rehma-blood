import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function BloodRequestsHeader({ onRefresh, refreshing }: { onRefresh: () => void; refreshing: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--adm-fg)]">Blood Requests</h1>
        <p className="text-[13px] text-[var(--adm-fg-dim)] mt-1">Track and manage blood requests</p>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="flex items-center gap-2 border border-[color:var(--adm-border)] bg-[var(--adm-surface)] hover:bg-[var(--adm-hover)] text-[var(--adm-fg)] px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
      >
        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        Refresh
      </button>
    </div>
  );
}
