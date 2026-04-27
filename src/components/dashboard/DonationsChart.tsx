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
      <div className="bg-[#111] border border-[#333] rounded-lg p-3 shadow-2xl backdrop-blur-md bg-opacity-90">
        <p className="text-[#fff] font-semibold mb-1.5 text-sm">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <span style={{ color: entry.color }} className="text-xs font-medium">{entry.name}:</span>
              <span className="text-white text-xs font-bold">{entry.value}</span>
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
    <div className="flex flex-col rounded-xl border p-5 bg-[var(--adm-surface)] border-[color:var(--adm-border)] h-full min-h-[360px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[var(--adm-fg)] font-medium">
          Donations vs Requests
        </h3>
        <div className="flex items-center gap-3 text-xs text-[var(--adm-fg-dim)] font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
            Donations
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
            Requests
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--adm-border-soft)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--adm-fg-faint)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fill: "var(--adm-fg-faint)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 23, 46, 69, 92]}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--adm-border)', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Line
              type="linear"
              dataKey="requests"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: 'var(--adm-surface)', strokeWidth: 2 }}
            />
            <Line
              type="linear"
              dataKey="donations"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ fill: "#dc2626", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: 'var(--adm-surface)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
