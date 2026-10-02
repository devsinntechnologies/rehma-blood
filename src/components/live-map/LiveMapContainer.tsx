"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import LiveMapSidebar from './LiveMapSidebar';
import type { MapOverview } from '@/hooks/useMapOverview';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[var(--adm-surface-2)] rounded-xl border border-[color:var(--adm-border)] flex items-center justify-center text-[var(--adm-fg-dim)]">
      Loading map...
    </div>
  ),
});

export default function LiveMapContainer({ map }: { map: MapOverview }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:min-h-[500px] lg:h-[calc(100vh-280px)]">
      <LiveMapSidebar map={map} />
      <div className="flex-1 h-[60vh] lg:h-full min-h-[400px]">
        <MapComponent map={map} />
      </div>
    </div>
  );
}
