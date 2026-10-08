"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusChip } from "@/src/feature/applications/components/StatusChip";
import { formatDeadline } from "@/src/feature/applications/services/utils";
import type { ApplicationSummary } from "@/src/feature/applications/types/application";
import { DEADLINE_URGENCY_DOT, getDeadlineUrgency } from "@/src/shared/lib/deadline";
import { cn } from "../services/utils";
import { CARD_CLASS, GHOST_LINK_CLASS } from "./styles";

const MAX_ROWS = 5;
const HORIZON_DAYS = 30;

const GROUPS = [
  { label: "This week", max: 7 },
  { label: "Next week", max: 14 },
  { label: "Later", max: HORIZON_DAYS },
];

/** "Thu, Oct 15" for a date `daysLeft` days from `today` (applications only carry days left). */
function formatDay(today: Date, daysLeft: number) {
  const date = new Date(today);
  date.setDate(date.getDate() + daysLeft);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function DeadlineWhen({ daysLeft, today }: { daysLeft: number; today: Date }) {
  const day = formatDay(today, daysLeft);
  const urgency = getDeadlineUrgency(daysLeft);

  if (urgency === "later") {
    return (
      <p className="text-neutral-600 text-small">
        <span className="text-neutral-800">{day}</span> · in {daysLeft} days
      </p>
    );
  }

  return (
    <p className="text-neutral-600 text-small">
      {urgency === "urgent" ? (
        <span className="font-medium text-danger-800">{formatDeadline(daysLeft)}</span>
      ) : (
        <span className="font-medium text-neutral-900">In {daysLeft} days</span>
      )}{" "}
      · {day}
    </p>
  );
}

/**
 * The next few deadlines on a timeline rail, grouped into this week / next week / later.
 * Pass only applications that still need work, soonest first.
 */
export function DeadlineList({
  applications,
  className,
}: {
  applications: ApplicationSummary[];
  className?: string;
}) {
  // The dashboard renders this twice (tablet and desktop positions), so the id must be unique.
  const headingId = useId();
  // Signed-in pages render on the client only, so "today" is the viewer's local date.
  const [today] = useState(() => new Date());

  const inHorizon = applications.filter((a) => a.daysLeft >= 0 && a.daysLeft <= HORIZON_DAYS);
  const rows = inHorizon.slice(0, MAX_ROWS);
  const groups = GROUPS.map((group, index) => ({
    label: group.label,
    items: rows.filter((a) => a.daysLeft <= group.max && (index === 0 || a.daysLeft > GROUPS[index - 1].max)),
  })).filter((group) => group.items.length > 0);

  return (
    <section aria-labelledby={headingId} className={cn(CARD_CLASS, className)}>
      <div className="flex justify-between items-baseline gap-3">
        <h2 id={headingId} className="text-h3 text-neutral-900">
          Upcoming deadlines
        </h2>
        {rows.length > 0 && (
          <Link href="/applications" className={GHOST_LINK_CLASS}>
            View all
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-start gap-1 mt-3">
          <p className="text-neutral-600 text-small">No deadlines in the next 30 days</p>
          <Link href="/discover" className={GHOST_LINK_CLASS}>
            Discover opportunities
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {groups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-1 font-medium text-caption text-neutral-600">{group.label}</h3>
              <ul>
                {group.items.map((application, index) => {
                  const isLast = index === group.items.length - 1;

                  return (
                    // pl-5 leaves room for the rail; the dot sits on the title line (8px padding + half of 22px).
                    <li key={application.id} className="relative pl-5">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "top-3.5 left-0 absolute rounded-full size-2.5",
                          DEADLINE_URGENCY_DOT[getDeadlineUrgency(application.daysLeft)],
                        )}
                      />
                      {!isLast && (
                        // From under this dot to the top of the next one.
                        <span aria-hidden="true" className="top-6 -bottom-3.5 left-[4.5px] absolute bg-neutral-100 w-px" />
                      )}

                      <Link
                        href={`/applications/${application.id}`}
                        className="group flex items-center gap-2 hover:bg-neutral-50 px-2 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 transition-colors"
                      >
                        <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                          <div className="flex justify-between items-center gap-2">
                            <span className="font-medium text-body text-neutral-900 truncate">{application.title}</span>
                            <StatusChip status={application.status} className="shrink-0" />
                          </div>
                          <p className="text-neutral-600 text-small truncate">
                            {[application.provider, application.type].filter(Boolean).join(" · ")}
                          </p>
                          <DeadlineWhen daysLeft={application.daysLeft} today={today} />
                        </div>
                        <ChevronRight
                          size={16}
                          strokeWidth={1.75}
                          aria-hidden="true"
                          className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100 text-neutral-400 transition-opacity shrink-0"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {inHorizon.length > MAX_ROWS && (
            <Link href="/applications" className={cn(GHOST_LINK_CLASS, "self-start")}>
              View all {inHorizon.length} deadlines
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
