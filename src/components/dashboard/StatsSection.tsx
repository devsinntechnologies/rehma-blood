"use client";

import React from "react";
import StatCard from "./StatCard";
import { Droplet, Heart, Users, Activity } from "lucide-react";
import { useStats } from "@/hooks/useStats";

export default function StatsSection() {
  const { stats } = useStats();

  const cards = [
    { title: "Total Donors", value: stats?.donors ?? "—", change: "+0%", positive: true, icon: <Droplet size={20} /> },
    { title: "Active Requests", value: stats?.activeRequests ?? "—", change: "+0%", positive: true, icon: <Heart size={20} /> },
    { title: "Donations (Month)", value: stats?.donations ?? "—", change: "+0%", positive: true, icon: <Users size={20} /> },
    { title: "Available Donors", value: stats?.availableDonors ?? "—", change: "+0%", positive: true, icon: <Activity size={20} /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
