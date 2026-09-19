import { CheckCircle2, Clock, FileStack, HardDrive } from "lucide-react";

import { MetricTile } from "@/src/feature/dashboard/components/MetricTile";
import { DOCUMENTS } from "../mocks/documents";
import { getDocumentsSummary } from "../services/utils";

export function DocumentStatCards() {
  const summary = getDocumentsSummary(DOCUMENTS);

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <MetricTile
        icon={FileStack}
        label="Total documents"
        value={summary.total}
        tone="green"
      />
      <MetricTile
        icon={HardDrive}
        label="Used space"
        value={summary.usedSpace}
        tone="blue"
      />
      <MetricTile
        icon={Clock}
        label="Added this week"
        value={summary.recentlyAdded}
        tone="amber"
      />
      <MetricTile
        icon={CheckCircle2}
        label="Verified documents"
        value={summary.verified}
        tone="teal"
      />
    </div>
  );
}
