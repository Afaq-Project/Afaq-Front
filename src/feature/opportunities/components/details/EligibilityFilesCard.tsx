import { CheckCircle2, FileText } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import { OpportunityDetail } from "../../types/opportunity";

export function EligibilityFilesCard({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  return (
    <Card>
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
        <div>
          <h2 className="text-h2">Eligibility</h2>
          <ul className="flex flex-col gap-2.5 mt-3">
            {opportunity.eligibility.map((item) => (
              <li key={item} className="flex items-start gap-2 text-small">
                <CheckCircle2
                  size={16}
                  strokeWidth={1.75}
                  className="mt-0.5 text-primary-600 shrink-0"
                />
                <span className="text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-h2">Files required</h2>
          <ul className="flex flex-col gap-2.5 mt-3">
            {opportunity.requiredDocuments.map((item) => (
              <li key={item} className="flex items-start gap-2 text-small">
                <FileText
                  size={16}
                  strokeWidth={1.75}
                  className="mt-0.5 text-neutral-500 shrink-0"
                />
                <span className="text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
