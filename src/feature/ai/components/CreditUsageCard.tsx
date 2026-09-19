import { Zap } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import { ProgressBar } from "@/src/shared/ui/ProgressBar";

export function CreditUsageCard({
  used,
  limit,
}: {
  used: number;
  limit: number;
}) {
  const remaining = Math.max(0, limit - used);
  const percentUsed = limit === 0 ? 0 : (used / limit) * 100;

  return (
    <Card className="flex flex-col gap-3 shrink-0">
      <h2 className="flex items-center gap-1.5 text-h3">
        <Zap size={15} strokeWidth={1.75} className="text-primary-600" />
        Credit Usage
      </h2>

      <div>
        <ProgressBar
          value={percentUsed}
          variant="application"
          label="Messages used this month"
        />
        <p className="mt-2 text-neutral-600 text-caption">
          {remaining} / {limit} messages remaining this month
        </p>
      </div>

      <button
        type="button"
        className="font-medium text-primary-600 hover:text-primary-800 text-small text-left transition-colors"
      >
        Upgrade Plan
      </button>
    </Card>
  );
}
