"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "O+", value: 35, color: "#dc2626" },
  { name: "A+", value: 28, color: "#ef4444" },
  { name: "B+", value: 20, color: "#f87171" },
  { name: "AB+", value: 10, color: "#fca5a5" },
  { name: "O-", value: 7, color: "#fecaca" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-lg p-3 shadow-lg">
        <p style={{ color: payload[0].payload.color }} className="text-xs font-medium">
          {payload[0].name}: {payload[0].value}%
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

export default function BloodGroupChart() {
  return (
    <div className="flex flex-col rounded-xl border p-5 bg-[var(--adm-surface)] border-[color:var(--adm-border)] h-full min-h-[360px]">
      <h3 className="text-[var(--adm-fg)] font-medium mb-8">
        Blood Group Distribution
      </h3>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
}
