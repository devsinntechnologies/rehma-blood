"use client";

import { useState } from "react";

type MapFiltersProps = {
  bloodGroup: string | null;
  radiusKm: number | null;
  onBloodGroupChange: (bloodGroup: string | null) => void;
  onRadiusChange: (radiusKm: number | null) => void;
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function MapFilters({
  bloodGroup,
  radiusKm,
  onBloodGroupChange,
  onRadiusChange,
}: MapFiltersProps) {
  const [localRadius, setLocalRadius] = useState(radiusKm?.toString() || "25");

  const handleRadiusApply = () => {
    const radius = localRadius ? parseInt(localRadius, 10) : null;
    onRadiusChange(radius);
  };

  return (
    <div className="bg-[--adm-bg] border border-[--adm-border] rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold text-[--adm-fg]">Filters</h3>

      {/* Blood Group Filter */}
      <div className="space-y-2">
        <label htmlFor="blood-group" className="text-xs font-medium text-[--adm-fg]/80">
          Blood Group
        </label>
        <select
          id="blood-group"
          value={bloodGroup || ""}
          onChange={(e) => onBloodGroupChange(e.target.value || null)}
          className="w-full px-3 py-2 bg-[--adm-input-bg] border border-[--adm-border] rounded text-sm text-[--adm-fg] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Blood Groups</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>
      </div>

      {/* Radius Filter */}
      <div className="space-y-2">
        <label htmlFor="radius" className="text-xs font-medium text-[--adm-fg]/80">
          Search Radius (km)
        </label>
        <div className="flex gap-2">
          <input
            id="radius"
            type="number"
            value={localRadius}
            onChange={(e) => setLocalRadius(e.target.value)}
            min="1"
            max="100"
            className="flex-1 px-3 py-2 bg-[--adm-input-bg] border border-[--adm-border] rounded text-sm text-[--adm-fg] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter radius in km"
          />
          <button
            onClick={handleRadiusApply}
            className="px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
        {radiusKm && (
          <p className="text-xs text-[--adm-fg]/60">Current radius: {radiusKm} km</p>
        )}
      </div>
    </div>
  );
}
