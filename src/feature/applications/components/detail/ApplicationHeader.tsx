"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CalendarDays, ExternalLink } from "lucide-react";
import { CARD_CLASS } from "@/src/feature/dashboard/components/styles";
import { cn } from "@/src/feature/dashboard/services/utils";
import { FlagTile } from "@/src/feature/opportunities/components/FlagTile";
import { UpdateStatusMenu } from "@/src/feature/opportunities/components/details/SideCards";
import type { OpportunityDetail } from "@/src/feature/opportunities/types/opportunity";
import { countryName } from "@/src/shared/lib/countries";
import { DEADLINE_URGENCY_TEXT, daysUntil, formatShortDay, getDeadlineUrgency, relativeDay } from "@/src/shared/lib/deadline";
import { buttonClasses } from "@/src/shared/ui/Button";
import { Popover } from "@/src/shared/ui/Popover";
import { STATUS_STEPS, StatusTimeline } from "@/src/shared/ui/StatusTimeline";
import { formatDeadline } from "../../services/utils";
import type { ApplicationDetail } from "../../types/detail";
import { STATUS_PROGRESS, STATUS_STAGE_INDEX, type ApplicationStatus } from "../../types/status";
import { StatusChip } from "../StatusChip";
import { useTranslations } from "next-intl";

/** The status each of the first four steps sets; the last ("Decision") asks for the outcome. */
const STEP_STATUS: ApplicationStatus[] = ["not_started", "in_progress", "submitted", "in_review"];
const DECISION_STEP = 4;

const POPOVER_BUTTON = buttonClasses("secondary", "h-9 md:h-9 px-3 text-small");

function reminderText(days: number[]) {
  const sorted = [...days].sort((a, b) => b - a).map(String);
  return `Reminders ${new Intl.ListFormat("en", { type: "conjunction" }).format(sorted)} days before`;
}

/**
 * Countdown (urgency-colored), date and reminder note while the application is active;
 * "Submitted {date}" once sent; "Decided {date}" with the outcome once decided.
 */
function DeadlineRow({ application, status, now }: { application: ApplicationDetail; status: ApplicationStatus; now: Date }) {
  if (status === "submitted" || status === "in_review") {
    return (
      <p className="flex items-center gap-2 text-body text-neutral-800">
        <CalendarDays size={18} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600" />
        {application.submittedAt ? `Submitted ${formatShortDay(application.submittedAt)}` : "Submitted"}
      </p>
    );
  }

  if (status === "accepted" || status === "rejected") {
    return (
      <p className="flex flex-wrap items-center gap-2 text-body text-neutral-800">
        <CalendarDays size={18} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600" />
        {application.decidedAt ? `Decided ${formatShortDay(application.decidedAt)}` : "Decided"}
        <StatusChip status={status} />
      </p>
    );
  }

  const days = daysUntil(application.deadlineDate, now);
  const urgency = getDeadlineUrgency(days);
  const countdown = days < 0 ? "Deadline passed" : urgency === "urgent" ? formatDeadline(days) : `Ends in ${days} days`;

  return (
    <div className="flex flex-col gap-1">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body">
        <CalendarDays size={18} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600" />
        <span className={cn("font-medium", days < 0 ? "text-neutral-600" : DEADLINE_URGENCY_TEXT[urgency])}>{countdown}</span>
        <span className="text-neutral-600">· {formatShortDay(application.deadlineDate)}</span>
      </p>
      {application.reminderDays && application.reminderDays.length > 0 && days >= 0 && (
        <p className="flex items-center gap-1.5 text-caption text-neutral-600">
          <Bell size={14} strokeWidth={1.75} aria-hidden="true" />
          {reminderText(application.reminderDays)}
        </p>
      )}
    </div>
  );
}

interface ApplicationHeaderProps {
  application: ApplicationDetail;
  opportunity?: OpportunityDetail;
  status: ApplicationStatus;
  onStatusChange: (status: ApplicationStatus) => void;
  updatedAt?: string;
  now: Date;
}

/**
 * Header card: flag, title, provider and type with the status chip; the deadline row; the
 * interactive status timeline (each step sets the status, moving back asks first) with the
 * progress %; and the actions.
 */
export function ApplicationHeader({ application, opportunity, status, onStatusChange, updatedAt, now }: ApplicationHeaderProps) {
  const tSteps = useTranslations("statusTimeline.steps");
  const [openStep, setOpenStep] = useState<number | null>(null);
  const currentStep = STATUS_STAGE_INDEX[status];
  const remote = Boolean(opportunity?.isRemote) || !opportunity?.countryCode;
  const country = opportunity?.countryCode ? countryName(opportunity.countryCode) : undefined;
  const officialLink = opportunity?.officialLink;

  const pickStep = (index: number) => {
    if (index === DECISION_STEP) return setOpenStep(openStep === index ? null : index);
    if (index === currentStep) return;
    if (index < currentStep) return setOpenStep(openStep === index ? null : index);
    onStatusChange(STEP_STATUS[index]);
  };
  const choose = (next: ApplicationStatus) => {
    onStatusChange(next);
    setOpenStep(null);
  };

  return (
    <header className={cn(CARD_CLASS, "flex flex-col gap-5")}>
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-3">
        <div className="flex items-start gap-4 min-w-0">
          <FlagTile size="lg" countryCode={opportunity?.countryCode} countryName={country} remote={remote} />
          <div className="min-w-0">
            <h1 className="text-h1 text-neutral-900">{application.title}</h1>
            <p className="text-body text-neutral-600">
              {opportunity ? (
                <Link
                  href={`/discover/${opportunity.id}`}
                  className="rounded-sm hover:text-neutral-900 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                >
                  {application.provider}
                </Link>
              ) : (
                application.provider
              )}
            </p>
            <span className="inline-block bg-white mt-2 px-2.5 py-0.5 border border-neutral-200 rounded-full text-caption text-neutral-800">
              {application.type}
            </span>
          </div>
        </div>
        <StatusChip status={status} className="self-start shrink-0" />
      </div>

      <DeadlineRow application={application} status={status} now={now} />

      <div className="flex md:flex-row flex-col md:items-start gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <StatusTimeline
            currentStep={currentStep}
            stackOnMobile
            renderStep={(index, content, className) => {
              const label = tSteps(STATUS_STEPS[index]);
              const backwards = index < currentStep;
              return (
                <Popover
                  open={openStep === index}
                  onOpenChange={(next) => setOpenStep(next ? index : null)}
                  label={index === DECISION_STEP ? "Record the decision" : `Move back to ${label}`}
                  align={index >= 3 ? "end" : "start"}
                  panelClassName="w-64"
                  trigger={(triggerProps) => (
                    <button
                      type="button"
                      aria-expanded={triggerProps["aria-expanded"]}
                      aria-controls={triggerProps["aria-controls"]}
                      aria-label={index === currentStep && index !== DECISION_STEP ? `${label} (current status)` : `Set status to ${label}`}
                      onClick={() => pickStep(index)}
                      className={cn(
                        className,
                        "md:-mx-1 md:px-1 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 w-full hover:bg-neutral-50 transition-colors",
                      )}
                    >
                      {content}
                    </button>
                  )}
                >
                  {index === DECISION_STEP ? (
                    <>
                      <p className="font-medium text-neutral-900 text-small">What was the decision?</p>
                      <div className="flex gap-2 mt-3">
                        <button type="button" onClick={() => choose("accepted")} className={POPOVER_BUTTON}>
                          Accepted
                        </button>
                        <button type="button" onClick={() => choose("rejected")} className={POPOVER_BUTTON}>
                          Not selected
                        </button>
                      </div>
                    </>
                  ) : backwards ? (
                    <>
                      <p className="font-medium text-neutral-900 text-small">Move back to {label}?</p>
                      <div className="flex gap-2 mt-3">
                        <button type="button" onClick={() => choose(STEP_STATUS[index])} className={POPOVER_BUTTON}>
                          Move back
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenStep(null)}
                          className={buttonClasses("ghost", "h-9 md:h-9 px-3 text-small")}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : null}
                </Popover>
              );
            }}
          />
        </div>
        <p className="text-caption text-neutral-600 md:text-end shrink-0 md:mt-1" aria-label={`Progress ${STATUS_PROGRESS[status]}%`}>
          {STATUS_PROGRESS[status]}%
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4 border-neutral-100 border-t">
        <div className="flex flex-wrap items-center gap-2">
          {/* Phones get "Update status" in the sticky bottom bar instead. */}
          <div className="hidden md:block">
            <UpdateStatusMenu status={status} onChange={onStatusChange} className="w-auto" />
          </div>
          {/* TODO: unlinked applications have no official link to continue on. */}
          {officialLink && (
            <a href={officialLink} target="_blank" rel="noopener noreferrer" className={buttonClasses("soft")}>
              Continue on official site
              <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
        {updatedAt && <p className="text-caption text-neutral-600">Updated {relativeDay(updatedAt, now)}</p>}
      </div>
    </header>
  );
}
