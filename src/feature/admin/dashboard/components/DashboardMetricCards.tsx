import { Crown, GraduationCap, ShieldCheck, Sparkles, Users } from "lucide-react";

import StatCard from "@/src/shared/ui/StatCard";
import { DashboardMetrics } from "../types/metrics";
import { formatNumber } from "../services/utils";

export function DashboardMetricCards({ metrics }: { metrics: DashboardMetrics }) {
  const { users, pendingApprovalCount, liveOpportunities, aiUsage, subscriptions } = metrics;

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        icon={Users}
        tone="primary"
        label="Total users"
        value={formatNumber(users.total)}
        caption={`${formatNumber(users.free)} free · ${formatNumber(users.premium)} premium`}
      />

      <StatCard
        icon={ShieldCheck}
        tone="warning"
        label="Pending approval"
        value={formatNumber(pendingApprovalCount)}
        caption="Opportunities awaiting review"
        href="/admin/opportunities/approval-queue"
      />

      <StatCard
        icon={GraduationCap}
        tone="info"
        label="Live opportunities"
        value={formatNumber(liveOpportunities.scholarships + liveOpportunities.internships)}
        caption={`${formatNumber(liveOpportunities.scholarships)} scholarships · ${formatNumber(liveOpportunities.internships)} internships`}
      />

      <StatCard
        icon={Sparkles}
        tone="success"
        label="AI usage this month"
        value={formatNumber(aiUsage.totalEssayReviews + aiUsage.totalChatMessages)}
        caption={`${formatNumber(aiUsage.totalEssayReviews)} reviews · ${formatNumber(aiUsage.totalChatMessages)} messages`}
      />

      <StatCard
        icon={Crown}
        tone="danger"
        label="Premium subscribers"
        value={formatNumber(subscriptions.activePremiumSubscribers)}
        caption={`${formatNumber(subscriptions.failedPaymentDowngradesThisMonth)} downgrades (failed payment)`}
      />
    </div>
  );
}
