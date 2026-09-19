import { DASHBOARD_METRICS } from "../mocks/dashboardMetrics";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardMetricCards } from "./DashboardMetricCards";
import { ApplicationsStatusChart } from "./ApplicationsStatusChart";
import { UsersByTierChart } from "./UsersByTierChart";
import { RecentActivityFeed } from "./RecentActivityFeed";
import { ScrapingHealthList } from "./ScrapingHealthList";

export function AdminDashboardView() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <DashboardMetricCards metrics={DASHBOARD_METRICS} />

      <div className="items-stretch gap-4 grid grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ApplicationsStatusChart />
        </div>
        <UsersByTierChart users={DASHBOARD_METRICS.users} />
      </div>

      <div className="items-stretch gap-4 grid grid-cols-1 xl:grid-cols-2">
        <RecentActivityFeed />
        <ScrapingHealthList />
      </div>
    </div>
  );
}
