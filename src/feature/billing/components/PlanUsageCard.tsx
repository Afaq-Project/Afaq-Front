import { BarChart3 } from "lucide-react";

import { ProgressBar } from "@/src/shared/ui/ProgressBar";
import { USAGE_METRICS, USAGE_RESET_LABEL } from "../mocks/usage";

export function PlanUsageCard() {
  return (
    <div className="bg-white shadow-sm p-5 border border-neutral-100 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-neutral-900 text-body">
          Plan Usage
        </h2>
        <BarChart3
          size={18}
          strokeWidth={1.75}
          className="text-neutral-400"
        />
      </div>

      <div className="flex flex-col gap-4">
        {USAGE_METRICS.map((metric) => (
          <div key={metric.id}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-neutral-600 text-caption">
                {metric.label}
              </span>
              <span className="font-medium text-neutral-900 text-caption">
                {metric.used} / {metric.limit}
              </span>
            </div>
            <ProgressBar
              value={(metric.used / metric.limit) * 100}
              variant="application"
              label={metric.label}
            />
          </div>
        ))}
      </div>

      <p className="mt-4 text-neutral-400 text-caption">
        {USAGE_RESET_LABEL}
      </p>
    </div>
  );
}
