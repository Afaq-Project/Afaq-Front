"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, ChevronDown, ExternalLink, Share2, Sparkles } from "lucide-react";
import { CARD_CLASS, GHOST_LINK_CLASS } from "@/src/feature/dashboard/components/styles";
import { cn } from "@/src/feature/dashboard/services/utils";
import { getMatchTier, MATCH_TIER_STROKE, MATCH_TIER_TEXT } from "@/src/feature/dashboard/types/status";
import { formatDeadlineDay } from "@/src/shared/lib/deadline";
import { notify } from "@/src/shared/lib/notify";
import type { ApplicationStatusKey } from "@/src/shared/lib/status-colors";
import Badge from "@/src/shared/ui/Badge";
import { buttonClasses } from "@/src/shared/ui/Button";
import { CompletionDonut } from "@/src/shared/ui/CompletionDonut";
import { Popover } from "@/src/shared/ui/Popover";
import { StatusTimeline } from "@/src/shared/ui/StatusTimeline";
import { MATCH_TIER_LABEL } from "../../services/utils";
import type { OpportunityDetail } from "../../types/opportunity";
import { FIT_LABEL, FIT_TEXT, FitIcon, MATCH_FACTORS } from "../matchFactors";

export const STATUS_LABEL: Record<ApplicationStatusKey, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  in_review: "In review",
  accepted: "Accepted",
  rejected: "Rejected",
};

const STATUS_STEP: Record<ApplicationStatusKey, number> = {
  not_started: 0,
  in_progress: 1,
  submitted: 2,
  in_review: 3,
  accepted: 4,
  rejected: 4,
};

const STATUSES = Object.keys(STATUS_LABEL) as ApplicationStatusKey[];

/** "Update status" button with a quick-pick list of statuses. */
export function UpdateStatusMenu({
  status,
  onChange,
  side = "bottom",
  className,
}: {
  status: ApplicationStatusKey;
  onChange: (status: ApplicationStatusKey) => void;
  side?: "top" | "bottom";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label="Update status"
      align="start"
      side={side}
      panelClassName="w-full p-2"
      trigger={(triggerProps) => (
        <button type="button" {...triggerProps} className={buttonClasses("secondary", cn("w-full", className))}>
          Update status
          <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    >
      <ul className="flex flex-col">
        {STATUSES.map((option) => (
          <li key={option}>
            <button
              type="button"
              aria-pressed={option === status}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={cn(
                "flex items-center px-3 rounded-sm w-full min-h-11 md:min-h-9 text-small text-left hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                option === status ? "font-medium text-neutral-900" : "text-neutral-800",
              )}
            >
              {STATUS_LABEL[option]}
            </button>
          </li>
        ))}
      </ul>
    </Popover>
  );
}

function ApplyLink({ href, disabled }: { href: string; disabled: boolean }) {
  const content = (
    <>
      Apply on official site
      <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
    </>
  );
  if (disabled) {
    return (
      <span aria-disabled="true" className={buttonClasses("secondary", "w-full opacity-50 cursor-not-allowed")}>
        {content}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "w-full")}>
      {content}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export interface TrackingState {
  tracked: boolean;
  status: ApplicationStatusKey;
  saved: boolean;
  onTrack: () => void;
  onStatusChange: (status: ApplicationStatusKey) => void;
  onToggleSaved: () => void;
}

/**
 * Primary actions. Untracked: track, apply, save. Tracked: the status chip, timeline and an
 * "Update status" menu. When closed, tracking and applying are disabled with a note.
 */
export function ActionsCard({
  opportunity,
  closed,
  tracking,
}: {
  opportunity: OpportunityDetail;
  closed: boolean;
  tracking: TrackingState;
}) {
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: opportunity.title, url });
        return;
      } catch {
        // Cancelled: fall back to copying the link.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      notify.success("Link copied");
    } catch {
      // Clipboard blocked; nothing else to try.
    }
  };

  const secondaryRow = (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-pressed={tracking.saved}
        onClick={tracking.onToggleSaved}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 rounded-sm min-h-11 md:min-h-9 font-medium text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
          tracking.saved ? "text-primary-600" : "text-neutral-600 hover:text-neutral-900",
        )}
      >
        <Bookmark size={16} strokeWidth={1.75} aria-hidden="true" className={cn(tracking.saved && "fill-current")} />
        {tracking.saved ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        onClick={share}
        aria-label="Share"
        className="flex justify-center items-center ml-auto rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 size-11 md:size-9 text-neutral-600 hover:text-neutral-900"
      >
        <Share2 size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );

  if (tracking.tracked) {
    return (
      <section aria-label="Your application" className={cn(CARD_CLASS, "flex flex-col gap-4")}>
        <div className="flex justify-between items-center gap-3">
          <h2 className="text-h3 text-neutral-900">Your application</h2>
          <Badge status={tracking.status}>{STATUS_LABEL[tracking.status]}</Badge>
        </div>
        <StatusTimeline currentStep={STATUS_STEP[tracking.status]} />
        <UpdateStatusMenu status={tracking.status} onChange={tracking.onStatusChange} />
        <ApplyLink href={opportunity.officialLink} disabled={closed} />
        {secondaryRow}
      </section>
    );
  }

  return (
    <section aria-label="Actions" className={cn(CARD_CLASS, "flex flex-col gap-3")}>
      <button type="button" onClick={tracking.onTrack} disabled={closed} className={buttonClasses("primary", "w-full")}>
        Track this application
      </button>
      <ApplyLink href={opportunity.officialLink} disabled={closed} />
      {secondaryRow}
      <p className="text-caption text-neutral-600">
        {closed ? `Applications closed on ${formatDeadlineDay(opportunity.deadlineDate)}` : "Tracking turns on deadline reminders."}
      </p>
    </section>
  );
}

/** Match score as a tier-colored donut, the tier label, and the five weighted factors. */
export function MatchCard({ opportunity }: { opportunity: OpportunityDetail }) {
  const tier = getMatchTier(opportunity.matchScore);

  return (
    <section aria-labelledby="match-heading" className={CARD_CLASS}>
      <h2 id="match-heading" className="text-h3 text-neutral-900">
        Your match
      </h2>
      <div className="flex items-center gap-4 mt-4">
        <div role="img" aria-label={`${opportunity.matchScore}% match`}>
          <CompletionDonut
            percent={opportunity.matchScore}
            size={96}
            strokeWidth={8}
            arcClassName={MATCH_TIER_STROKE[tier]}
            center={<span className={cn("text-h2", MATCH_TIER_TEXT[tier])}>{opportunity.matchScore}%</span>}
          />
        </div>
        <p className="text-body text-neutral-800">{MATCH_TIER_LABEL[tier]}</p>
      </div>

      {/* TODO: every opportunity should carry matchFactors once the matching API returns them. */}
      {opportunity.matchFactors && (
        <ul className="flex flex-col gap-2.5 mt-5 pt-4 border-neutral-100 border-t">
          {MATCH_FACTORS.map((factor) => {
            const fit = opportunity.matchFactors![factor.key];
            return (
              <li key={factor.key} className="flex justify-between items-center gap-3 text-small">
                <span className="text-neutral-800">
                  {factor.label} <span className="text-neutral-600">{factor.weight}%</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  {fit === "missing" && (
                    <Link href={factor.profileHref} className="rounded-sm font-medium text-caption text-primary-600 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                      Add to profile
                    </Link>
                  )}
                  <span className={cn("flex items-center gap-1.5 text-caption", FIT_TEXT[fit])}>
                    <FitIcon fit={fit} />
                    {FIT_LABEL[fit]}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* TODO: point at a "How matching works" page once it exists. */}
      <Link href="#" className={cn(GHOST_LINK_CLASS, "mt-3")}>
        How matching works
      </Link>
    </section>
  );
}

const AI_QUESTIONS = [
  "Am I eligible for this?",
  "What should my personal statement focus on?",
  "Review my essay for this application",
];

/** Suggested questions that open the AI assistant about this opportunity (3 across from 1024px). */
export function AskAiCard({ opportunityId }: { opportunityId: string }) {
  return (
    <section aria-labelledby="ask-ai-heading" className={CARD_CLASS}>
      <h2 id="ask-ai-heading" className="flex items-center gap-2 text-h3 text-neutral-900">
        <Sparkles size={18} strokeWidth={1.75} aria-hidden="true" className="text-primary-600" />
        Questions about this opportunity?
      </h2>
      <ul className="gap-2 grid grid-cols-1 lg:grid-cols-3 mt-4">
        {AI_QUESTIONS.map((question) => (
          <li key={question} className="flex">
            {/* TODO: the AI assistant doesn't read `opportunity` or `q` yet, so it opens without the context or the question. */}
            <Link
              href={`/ai?opportunity=${encodeURIComponent(opportunityId)}&q=${encodeURIComponent(question)}`}
              className="flex items-center bg-white px-4 py-2 border border-neutral-200 hover:border-neutral-400 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 w-full min-h-11 md:min-h-10 font-medium text-primary-600 text-sm text-left transition-colors"
            >
              {question}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-caption text-neutral-600">AI guidance doesn&apos;t guarantee application outcomes.</p>
    </section>
  );
}
