"use client";

import React from 'react';
import LiveMapHeader from '@/components/live-map/LiveMapHeader';
import LiveMapFilters from '@/components/live-map/LiveMapFilters';
import LiveMapContainer from '@/components/live-map/LiveMapContainer';
import { useMapOverview } from '@/hooks/useMapOverview';

export default function LiveMapPage() {
  const map = useMapOverview();

  return (
    <div className="flex flex-col gap-6 h-full">
      <LiveMapHeader map={map} />
      <LiveMapFilters map={map} />
      <LiveMapContainer map={map} />
    </div>
  );
}
