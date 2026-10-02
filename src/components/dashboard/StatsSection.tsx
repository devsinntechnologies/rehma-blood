"use client";

import React from "react";
import StatCard from "./StatCard";
import { Droplet, Heart, Users, Activity } from "lucide-react";
import { useStats } from "@/hooks/useStats";
import type { Donation } from "@/store/donationsSlice";

export default function StatsSection({ donations }: { donations: Donation[] }) {
  const { stats, status, error } = useStats();
  const completed = donations.filter((donation) => donation.status === "completed").length;
  const value = (n: number | undefined) => (n == null ? "—" : n);

  const cards = [
    { title: "Total Donors", value: value(stats?.donors), icon: <Droplet size={20} /> },
    {
      title: "Open Requests",
      value: value(stats?.activeRequests),
      detail: stats ? `${stats.urgentRequests} urgent` : undefined,
      icon: <Heart size={20} />,
    },
    {
      title: "Completed Donations",
      value: value(stats ? completed : undefined),
      detail: stats ? `${stats.donations - completed} in progress` : undefined,
      icon: <Users size={20} />,
    },
    {
      title: "Available Donors",
      value: value(stats?.availableDonors),
      detail: stats && stats.donors > 0 ? `${Math.round((stats.availableDonors / stats.donors) * 100)}% of donors` : undefined,
      icon: <Activity size={20} />,
    },
  ];

  return (
    <div className="space-y-3">
      {status === "failed" && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error ?? "Unable to load stats."}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
}
