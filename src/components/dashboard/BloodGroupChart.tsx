"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Donor } from "@/store/donorsSlice";

// Darkest red for the most common group, fading out for rarer ones.
const SHADES = ["#991b1b", "#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2"];

function buildDistribution(donors: Donor[]) {
  const counts = new Map<string, number>();
  donors.forEach((donor) => {
    const group = donor.bloodGroup || "Unknown";
    counts.set(group, (counts.get(group) ?? 0) + 1);
  });
  const total = donors.length || 1;
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([name, count], index) => ({
      name,
      value: count,
      percent: Math.round((count / total) * 100),
      color: SHADES[Math.min(index, SHADES.length - 1)],
    }));
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-lg p-3 shadow-lg">
        <p style={{ color: payload[0].payload.color }} className="text-xs font-medium">
          {payload[0].name}: {payload[0].value} donor{payload[0].value === 1 ? "" : "s"} ({payload[0].payload.percent}%)
        </p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center gap-2 text-xs font-medium">
          <span
            className="w-3.5 h-3.5 inline-block shrink-0 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[var(--adm-fg-dim)]">{entry.payload.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default function BloodGroupChart({ donors, loading }: { donors: Donor[]; loading: boolean }) {
  const data = useMemo(() => buildDistribution(donors), [donors]);

  return (
    <div className="flex flex-col rounded-xl border p-5 bg-[var(--adm-surface)] border-[color:var(--adm-border)] h-full min-h-[360px]">
      <h3 className="text-[var(--adm-fg)] text-[17px] font-semibold mb-8">
        Blood Group Distribution
        <span className="block text-[12px] font-normal text-[var(--adm-fg-dim)] mt-0.5">Registered donors</span>
      </h3>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--adm-fg-dim)]">
          {loading ? "Loading donors..." : "No donors registered yet."}
        </div>
      ) : (
      <div className="flex-1 w-full min-h-[260px] flex items-center justify-center min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend content={renderLegend} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      )}
    </div>
  );
}
