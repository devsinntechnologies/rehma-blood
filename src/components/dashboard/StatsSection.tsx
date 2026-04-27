import React from "react";
import StatCard from "./StatCard";
import { Droplet, Heart, Users, Activity } from "lucide-react";

const stats = [
  { title: "Total Donors", value: "2,431", change: "+12.4%", positive: true, icon: <Droplet size={20} /> },
  { title: "Active Requests", value: "148", change: "+6.1%", positive: true, icon: <Heart size={20} /> },
  { title: "Donations (Month)", value: "84", change: "+18.2%", positive: true, icon: <Users size={20} /> },
  { title: "Match Rate", value: "92%", change: "-1.3%", positive: false, icon: <Activity size={20} /> },
];

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
