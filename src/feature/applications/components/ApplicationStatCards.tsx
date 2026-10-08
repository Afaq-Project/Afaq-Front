import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  PartyPopper,
} from "lucide-react";

import { MetricTile } from "@/src/feature/dashboard/components/MetricTile";
import { STATUS_COLORS } from "@/src/shared/lib/status-colors";
import { APPLICATIONS } from "../mocks/applications";
import { getApplicationsSummary } from "../services/utils";

export function ApplicationStatCards() {
  const summary = getApplicationsSummary(APPLICATIONS);

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <MetricTile
        icon={ClipboardList}
        label="Total applications"
        value={summary.total}
        tone="green"
      />
      <MetricTile
        icon={CheckCircle2}
        label="Submitted"
        value={summary.submitted}
        className={STATUS_COLORS.submitted.tile}
      />
      <MetricTile
        icon={CalendarClock}
        label="Upcoming deadlines"
        value={summary.upcomingDeadlines}
        tone="amber"
      />
      <MetricTile
        icon={PartyPopper}
        label="Accepted"
        value={summary.accepted}
        className={STATUS_COLORS.accepted.tile}
      />
    </div>
  );
}
