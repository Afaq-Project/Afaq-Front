import { AlertTriangle, CreditCard, DollarSign, Users } from "lucide-react";

import StatCard from "@/src/shared/ui/StatCard";
import { SubscriptionMetrics } from "../types/metrics";
import { formatCurrency, formatNumber } from "../services/utils";

export function SubscriptionMetricCards({ metrics }: { metrics: SubscriptionMetrics }) {
  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Users}
        tone="primary"
        label="Total Premium subscribers"
        value={formatNumber(metrics.totalPremiumSubscribers)}
      />

      <StatCard
        icon={CreditCard}
        tone="info"
        label="Billing cycle split"
        value={formatNumber(metrics.monthlySubscribers + metrics.annualSubscribers)}
        caption={`${formatNumber(metrics.monthlySubscribers)} monthly · ${formatNumber(metrics.annualSubscribers)} annual`}
      />

      <StatCard
        icon={DollarSign}
        tone="success"
        label="Mock MRR estimate"
        value={formatCurrency(metrics.mockMrrEstimate)}
        caption="Estimated, not billing-accurate"
      />

      <StatCard
        icon={AlertTriangle}
        tone="danger"
        label="Downgrades this month"
        value={formatNumber(metrics.downgradesThisMonth)}
        caption="Failed payment"
      />
    </div>
  );
}
