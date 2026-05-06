"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Nov", donations: 46, requests: 48 },
  { month: "Dec", donations: 52, requests: 55 },
  { month: "Jan", donations: 58, requests: 62 },
  { month: "Feb", donations: 64, requests: 68 },
  { month: "Mar", donations: 70, requests: 72 },
  { month: "Apr", donations: 84, requests: 90 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-xl p-3 shadow-2xl backdrop-blur-md bg-opacity-90">
        <p className="text-[var(--adm-fg)] font-bold mb-2 text-sm">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[var(--adm-fg-dim)] text-xs font-semibold">{entry.name}:</span>
              </div>
              <span className="text-[var(--adm-fg)] text-xs font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function DonationsChart() {
  return (
    <div className="flex flex-col rounded-xl border p-5 bg-[var(--adm-surface)] border-[color:var(--adm-border)] h-full min-h-[360px] shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[var(--adm-fg)] text-[17px] font-semibold">
          Donations vs Requests
        </h3>
        <div className="flex items-center gap-4 text-xs text-[var(--adm-fg-dim)] font-bold">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] shadow-sm shadow-red-500/20" />
            Donations
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-sm shadow-blue-500/20" />
            Requests
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex-1 min-h-[260px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--adm-border-soft)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--adm-fg-faint)", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fill: "var(--adm-fg-faint)", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--adm-border)', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 0, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: 'var(--adm-surface)', strokeWidth: 3, fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="donations"
              stroke="#dc2626"
              strokeWidth={3}
              dot={{ fill: "#dc2626", r: 0, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: 'var(--adm-surface)', strokeWidth: 3, fill: '#dc2626' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
