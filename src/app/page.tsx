import DashboardGuidance from "@/features/dashboard/components/DashboardGuidance";
import DashboardHero from "@/features/dashboard/components/DashboardHero";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import RecentDecisions from "@/features/dashboard/components/RecentDecisions";

export default function Home() {
  return (
    <div className="space-y-8">
      <DashboardHero />

      <DashboardStats />

      <RecentDecisions />
      <DashboardGuidance />
    </div>
  );
}