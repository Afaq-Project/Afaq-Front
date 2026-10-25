"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Clock, ExternalLink, MoreHorizontal } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { FlagTile } from "@/src/feature/opportunities/components/FlagTile";
import { getMockOpportunityById } from "@/src/feature/opportunities/services/utils";
import { countryName } from "@/src/shared/lib/countries";
import { DEADLINE_URGENCY_TEXT, getDeadlineUrgency, isoDateFromToday } from "@/src/shared/lib/deadline";
import { STATUS_COLORS } from "@/src/shared/lib/status-colors";
import { buttonClasses } from "@/src/shared/ui/Button";
import { Popover } from "@/src/shared/ui/Popover";
import { formatDeadline, isActive } from "../services/utils";
import type { ApplicationSummary } from "../types/application";
import { APPLICATION_STATUSES, STATUS_LABEL, STATUS_STAGE_INDEX, type ApplicationStatus } from "../types/status";
import { StatusChip } from "./StatusChip";

const STEPS = 5;

/** The tracked opportunity, when the application is linked to one. */
export const opportunityFor = (application: ApplicationSummary) =>
  application.opportunityId ? getMockOpportunityById(application.opportunityId) : undefined;

/** Every row opens the application's own details page. */
export const rowHref = (application: ApplicationSummary) => `/applications/${application.id}`;

/** "Oct 23" for an ISO date (YYYY-MM-DD), read as a local calendar day. */
function shortDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Five 6px dots: done and current steps filled in the status color, upcoming ones hollow. */
export function MiniTimeline({ status }: { status: ApplicationStatus }) {
  const step = STATUS_STAGE_INDEX[status];
  const label = `${STATUS_LABEL[status]}, step ${step + 1} of ${STEPS}, ${((step + 1) / STEPS) * 100}%`;

  return (
    <span role="img" aria-label={label} className="inline-flex items-center gap-1">
      {Array.from({ length: STEPS }, (_, index) => (
        <span
          key={index}
          className={cn(
            "rounded-full size-1.5",
            index <= step ? STATUS_COLORS[status].dot : "border border-neutral-200",
          )}
        />
      ))}
    </span>
  );
}

/** Status chip plus the mini timeline. */
export function ApplicationProgress({ status }: { status: ApplicationStatus }) {
  return (
    <span className="inline-flex items-center gap-2">
      <StatusChip status={status} />
      <MiniTimeline status={status} />
    </span>
  );
}

/** Flag, title and provider. `linked` makes the title the row's stretched link. */
export function OpportunityCell({ application, linked = false }: { application: ApplicationSummary; linked?: boolean }) {
  const opportunity = opportunityFor(application);
  const remote = Boolean(opportunity?.isRemote) || !opportunity?.countryCode;
  const country = opportunity?.countryCode ? countryName(opportunity.countryCode) : undefined;

  return (
    <div className="flex items-center gap-3 min-w-0">
      <FlagTile countryCode={opportunity?.countryCode} countryName={country} remote={remote} />
      <div className="min-w-0">
        <p className="font-medium text-body text-neutral-900 truncate">
          {linked ? (
            <Link
              href={rowHref(application)}
              // Stretches over the whole row; the action cell sits above it.
              className="after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-primary-400 focus-visible:after:ring-inset focus-visible:outline-none after:content-['']"
            >
              {application.title}
            </Link>
          ) : (
            application.title
          )}
        </p>
        <p className="text-neutral-600 text-small truncate">{application.provider}</p>
      </div>
    </div>
  );
}

/**
 * Active: the countdown in its urgency color with the date beneath. Submitted / in review: when
 * it was submitted. Decided: when, or just the outcome.
 */
export function ApplicationDeadline({ application }: { application: ApplicationSummary }) {
  if (isActive(application)) {
    const { daysLeft } = application;
    if (daysLeft < 0) return <span className="text-neutral-600 text-small">Deadline passed</span>;
    const urgency = getDeadlineUrgency(daysLeft);
    const text = urgency === "urgent" ? formatDeadline(daysLeft) : `Ends in ${daysLeft} days`;
    return (
      <span className="flex flex-col">
        <span className={cn("flex items-center gap-1.5 text-small", DEADLINE_URGENCY_TEXT[urgency])}>
          {urgency === "soon" && <Clock size={14} strokeWidth={2} aria-hidden="true" />}
          {text}
        </span>
        <span className="text-caption text-neutral-600">{shortDate(isoDateFromToday(daysLeft))}</span>
      </span>
    );
  }

  if (application.status === "submitted" || application.status === "in_review") {
    // TODO: every submitted application should carry submittedAt; without it the date is left out.
    return (
      <span className="text-neutral-600 text-small">
        {application.submittedAt ? `Submitted ${shortDate(application.submittedAt)}` : "Submitted"}
      </span>
    );
  }

  return application.decidedAt ? (
    <span className="text-neutral-600 text-small">Decided {shortDate(application.decidedAt)}</span>
  ) : (
    <StatusChip status={application.status} />
  );
}

const ACTION_LABEL: Record<ApplicationStatus, string> = {
  not_started: "Start",
  in_progress: "Continue",
  submitted: "View",
  in_review: "View",
  accepted: "View",
  rejected: "View",
};

const MENU_ITEM_CLASS =
  "flex items-center gap-2 px-3 rounded-sm w-full min-h-11 md:min-h-9 text-small text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400";

/**
 * One secondary button for every row (Start / Continue / View) and a "more" menu with update
 * status, the official site, and remove. Sits above the row's stretched link.
 */
export function RowActions({
  application,
  onStatusChange,
  onRemove,
  fullWidth = false,
}: {
  application: ApplicationSummary;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  /** Asks to remove; `trigger` gets focus back when the confirmation closes. */
  onRemove: (application: ApplicationSummary, trigger: HTMLElement | null) => void;
  fullWidth?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"main" | "status">("main");
  const moreButton = useRef<HTMLButtonElement>(null);
  // Not started / in progress get the tinted "soft" button; everything else a quiet "View".
  const ongoing = isActive(application);
  const officialLink = opportunityFor(application)?.officialLink;

  const setMenu = (next: boolean) => {
    setOpen(next);
    if (!next) setView("main");
  };

  return (
    // Above the row's stretched link; raised further while the menu is open so later rows don't cover it.
    <div className={cn("relative z-10 has-aria-expanded:z-30 flex items-center gap-2", fullWidth ? "w-full" : "justify-end")}>
      <Link
        href={`/applications/${application.id}`}
        // Same min width and height on every row so the column lines up; 44px tall on touch.
        className={buttonClasses(
          ongoing ? "soft" : "ghost",
          cn(
            "gap-1.5 px-3 rounded-md min-w-28 h-11 md:h-9",
            !ongoing && "text-neutral-800 hover:text-neutral-900 hover:bg-neutral-50",
            fullWidth && "flex-1",
          ),
        )}
      >
        {ACTION_LABEL[application.status]}
        {ongoing ? (
          <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" className="rtl:-scale-x-100" />
        ) : (
          <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" className="rtl:-scale-x-100" />
        )}
      </Link>

      <Popover
        open={open}
        onOpenChange={setMenu}
        label={`More actions for ${application.title}`}
        panelClassName="w-56 p-1"
        trigger={(triggerProps) => (
          <button
            ref={moreButton}
            type="button"
            {...triggerProps}
            aria-label={`More actions for ${application.title}`}
            className="flex justify-center items-center hover:bg-neutral-50 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 size-11 md:size-8 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <MoreHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        )}
      >
        {view === "main" ? (
          <ul className="flex flex-col">
            <li>
              <button type="button" onClick={() => setView("status")} className={cn(MENU_ITEM_CLASS, "text-neutral-800 hover:bg-neutral-50")}>
                Update status
              </button>
            </li>
            {officialLink && (
              <li>
                <a
                  href={officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenu(false)}
                  className={cn(MENU_ITEM_CLASS, "text-neutral-800 hover:bg-neutral-50")}
                >
                  Open official site
                  <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" className="ms-auto text-neutral-600" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
            <li role="separator" className="my-1 border-neutral-100 border-t" />
            <li>
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  onRemove(application, moreButton.current);
                }}
                className={cn(MENU_ITEM_CLASS, "text-danger-800 hover:bg-danger-50")}
              >
                Remove from tracker
              </button>
            </li>
          </ul>
        ) : (
          <div>
            <button type="button" onClick={() => setView("main")} className={cn(MENU_ITEM_CLASS, "text-neutral-600 hover:bg-neutral-50")}>
              <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" className="rtl:-scale-x-100" />
              Update status
            </button>
            <ul className="flex flex-col mt-1 pt-1 border-neutral-100 border-t">
              {APPLICATION_STATUSES.map((status) => (
                <li key={status}>
                  <button
                    type="button"
                    aria-pressed={status === application.status}
                    onClick={() => {
                      // TODO: there's no status-update API yet; this changes local state only.
                      onStatusChange(application.id, status);
                      setMenu(false);
                    }}
                    className={cn(
                      MENU_ITEM_CLASS,
                      "hover:bg-neutral-50",
                      status === application.status ? "font-medium text-neutral-900" : "text-neutral-800",
                    )}
                  >
                    <span aria-hidden="true" className={cn("rounded-full size-2", STATUS_COLORS[status].dot)} />
                    {STATUS_LABEL[status]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Popover>
    </div>
  );
}
