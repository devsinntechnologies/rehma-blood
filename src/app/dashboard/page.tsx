import DonationsChart from "@/components/dashboard/DonationsChart";
import BloodGroupChart from "@/components/dashboard/BloodGroupChart";
import RecentBloodRequests from "@/components/dashboard/RecentBloodRequests";
import TopDonors from "@/components/dashboard/TopDonors";
import StatsSection from "@/components/dashboard/StatsSection";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-2">
        <h1 className="text-[var(--adm-fg)] text-[22px] font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-[var(--adm-fg-dim)] text-[13px] mt-1">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stat Cards */}
      <StatsSection />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px]">
          <DonationsChart />
        </div>
        <div className="h-[400px]">
          <BloodGroupChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBloodRequests />
        <TopDonors />
      </div>
    </div>
  );
}
