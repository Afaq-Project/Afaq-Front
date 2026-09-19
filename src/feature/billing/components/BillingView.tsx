import PageHeader from "@/src/shared/ui/PageHeader";
import { ChoosePlanCard } from "./ChoosePlanCard";
import { DowngradeNoticeCard } from "./DowngradeNoticeCard";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { PlanUsageCard } from "./PlanUsageCard";

export function BillingView() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Subscription & Billing"
        description="Manage your workspace plan and payment methods."
      />

      <div className="items-start gap-4 grid grid-cols-1 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <PlanUsageCard />
          <DowngradeNoticeCard />
        </div>
        <div className="lg:col-span-2">
          <ChoosePlanCard />
        </div>
      </div>

      <PaymentMethodCard />
    </div>
  );
}
