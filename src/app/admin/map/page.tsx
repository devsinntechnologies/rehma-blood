import React from 'react';
import LiveMapHeader from '@/components/live-map/LiveMapHeader';
import LiveMapFilters from '@/components/live-map/LiveMapFilters';
import LiveMapContainer from '@/components/live-map/LiveMapContainer';

export default function LiveMapPage() {

  return (
    <div className="flex flex-col gap-6 h-full">
      <LiveMapHeader />
      <LiveMapFilters />
      <LiveMapContainer />
    </div>
  );
}
