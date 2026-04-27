"use client"

import React from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false, loading: () => <div className="w-full h-full bg-[#111111] rounded-xl border border-[color:var(--adm-border)] flex items-center justify-center text-[var(--adm-fg-dim)]">Loading map...</div> });
import LiveMapSidebar from './LiveMapSidebar';

export default function LiveMapContainer() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[500px] h-[calc(100vh-280px)]">
      <LiveMapSidebar />
      <div className="flex-1 h-full min-h-[400px]">
        <MapComponent />
      </div>
    </div>
  );
}
