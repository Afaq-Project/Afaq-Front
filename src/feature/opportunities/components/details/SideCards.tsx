"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, ChevronDown, ExternalLink, Share2, Sparkles } from "lucide-react";
import { CARD_CLASS, GHOST_LINK_CLASS } from "@/src/feature/dashboard/components/styles";
import { cn } from "@/src/feature/dashboard/services/utils";
import { getMatchTier, MATCH_TIER_STROKE, MATCH_TIER_TEXT } from "@/src/feature/dashboard/types/status";
import { APPLICATION_STATUSES, STATUS_STAGE_INDEX } from "@/src/feature/applications/types/status";
import type { MissingField } from "@/src/feature/discover/hooks/useMatchingReadiness";
import { formatDeadlineDay } from "@/src/shared/lib/deadline";
import { notify } from "@/src/shared/lib/notify";
import type { ApplicationStatusKey } from "@/src/shared/lib/status-colors";
import Badge from "@/src/shared/ui/Badge";
import { buttonClasses } from "@/src/shared/ui/Button";
import { CompletionDonut } from "@/src/shared/ui/CompletionDonut";
import { Popover } from "@/src/shared/ui/Popover";
import { StatusTimeline } from "@/src/shared/ui/StatusTimeline";
import type { MatchBreakdown, OpportunityDetail } from "../../types/opportunity";
import { FIT_TEXT, FitIcon, matchFactorRows, type KnownFactorKey } from "../matchFactors";
import { useLocale, useTranslations } from "next-intl";

const STATUSES = APPLICATION_STATUSES;

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
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label={t("opportunity.details.updateStatus")}
      align="start"
      side={side}
      panelClassName="w-full p-2"
      trigger={(triggerProps) => (
        <button type="button" {...triggerProps} className={buttonClasses("secondary", cn("w-full", className))}>
          {t("opportunity.details.updateStatus")}
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
                "flex items-center px-3 rounded-sm w-full min-h-11 md:min-h-9 text-small text-start hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                option === status ? "font-medium text-neutral-900" : "text-neutral-800",
              )}
            >
              {t(`applicationStatus.${option}`)}
            </button>
          </li>
        ))}
      </ul>
    </Popover>
  );
}

function ApplyLink({ href, disabled }: { href?: string; disabled: boolean }) {
  const t = useTranslations();
  const content = (
    <>
      {t("opportunity.details.apply")}
      <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
    </>
  );
  if (disabled || !href) {
    return (
      <span aria-disabled="true" className={buttonClasses("secondary", "w-full opacity-50 cursor-not-allowed")}>
        {content}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "w-full")}>
      {content}
      <span className="sr-only">{t("common.opensInNewTab")}</span>
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
  const t = useTranslations();
  const locale = useLocale();
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
      notify.success(t("opportunity.details.linkCopied"));
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
        {tracking.saved ? t("opportunity.details.savedLabel") : t("opportunity.details.saveLabel")}
      </button>
      <button
        type="button"
        onClick={share}
        aria-label={t("opportunity.details.share")}
        className="flex justify-center items-center ms-auto rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 size-11 md:size-9 text-neutral-600 hover:text-neutral-900"
      >
        <Share2 size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );

  if (tracking.tracked) {
    return (
      <section aria-label={t("opportunity.details.yourApplication")} className={cn(CARD_CLASS, "flex flex-col gap-4")}>
        <div className="flex justify-between items-center gap-3">
          <h2 className="text-h3 text-neutral-900">{t("opportunity.details.yourApplication")}</h2>
          <Badge status={tracking.status}>{t(`applicationStatus.${tracking.status}`)}</Badge>
        </div>
        <StatusTimeline currentStep={STATUS_STAGE_INDEX[tracking.status]} />
        <UpdateStatusMenu status={tracking.status} onChange={tracking.onStatusChange} />
        <ApplyLink href={opportunity.officialLink} disabled={closed} />
        {secondaryRow}
      </section>
    );
  }

  return (
    <section aria-label={t("opportunity.details.actions")} className={cn(CARD_CLASS, "flex flex-col gap-3")}>
      <button type="button" onClick={tracking.onTrack} disabled={closed} className={buttonClasses("primary", "w-full")}>
        {t("opportunity.details.track")}
      </button>
      <ApplyLink href={opportunity.officialLink} disabled={closed} />
      {secondaryRow}
      <p className="text-caption text-neutral-600">
        {closed && opportunity.deadlineDate
          ? t("opportunity.details.closedOn", { date: formatDeadlineDay(opportunity.deadlineDate, locale) })
          : t("opportunity.details.trackingHint")}
      </p>
    </section>
  );
}

/**
 * Match score as a tier-colored donut, the tier label, and the five weighted factors.
 * Without a score: what the profile is missing, or that no score exists yet.
 */
export function MatchCard({
  score,
  breakdown,
  missing,
}: {
  score?: number;
  breakdown?: MatchBreakdown;
  /** Set while the profile can't be matched. */
  missing: MissingField | null;
}) {
  const t = useTranslations();
  const heading = (
    <h2 id="match-heading" className="text-h3 text-neutral-900">
      {t("opportunity.details.yourMatch")}
    </h2>
  );

  if (score === undefined) {
    return (
      <section aria-labelledby="match-heading" className={CARD_CLASS}>
        {heading}
        {missing ? (
          <>
            <p className="mt-2 text-body text-neutral-800">
              {t("opportunity.details.matchMissing", { field: t(`discover.missing.${missing.key}`) })}
            </p>
            {/* Soft, not primary: the actions card above already has the page's primary button. */}
            <Link href={missing.href} className={buttonClasses("soft", "mt-4 w-full")}>
              {t("discover.completeProfile")}
            </Link>
          </>
        ) : (
          // TODO: there's no endpoint for one opportunity's match, so only matches already loaded
          // by Discover or the dashboard have a score here.
          <p className="mt-2 text-body text-neutral-600">{t("opportunity.details.noScore")}</p>
        )}
      </section>
    );
  }

  const tier = getMatchTier(score);

  return (
    <section aria-labelledby="match-heading" className={CARD_CLASS}>
      {heading}
      <div className="flex items-center gap-4 mt-4">
        <div role="img" aria-label={t("opportunity.percentMatch", { score })}>
          <CompletionDonut
            percent={score}
            size={96}
            strokeWidth={8}
            arcClassName={MATCH_TIER_STROKE[tier]}
            center={<span className={cn("text-h2", MATCH_TIER_TEXT[tier])}>{score}%</span>}
          />
        </div>
        <p className="text-body text-neutral-800">{t(`opportunity.tierDetail.${tier}`)}</p>
      </div>

      {breakdown && (
        <ul className="flex flex-col gap-2.5 mt-5 pt-4 border-neutral-100 border-t">
          {matchFactorRows(breakdown).map((factor) => (
            <li key={factor.key} className="flex justify-between items-center gap-3 text-small">
              <span className="text-neutral-800">
                {factor.known ? t(`opportunity.factors.${factor.key as KnownFactorKey}`) : factor.label} <span className="text-neutral-600">{factor.weight}%</span>
              </span>
              <span className="flex items-center gap-2 shrink-0">
                {factor.fit === "missing" && factor.profileHref && (
                  <Link href={factor.profileHref} className="rounded-sm font-medium text-caption text-primary-600 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                    {t("opportunity.details.addToProfile")}
                  </Link>
                )}
                <span className={cn("flex items-center gap-1.5 text-caption", FIT_TEXT[factor.fit])}>
                  <FitIcon fit={factor.fit} />
                  {t(`opportunity.fit.${factor.fit}`)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* TODO: point at a "How matching works" page once it exists. */}
      <Link href="#" className={cn(GHOST_LINK_CLASS, "mt-3")}>
        {t("opportunity.details.howMatching")}
      </Link>
    </section>
  );
}

/**
 * Suggested questions that open the AI assistant with some context: a white card with a
 * sparkle title, the questions as buttons (3 across from 1024px when `layout="row"`, stacked
 * otherwise) and a disclaimer. Shared by the opportunity and application details pages.
 */
export function AskAiCard({
  title,
  questions,
  hrefFor,
  layout = "row",
}: {
  title: string;
  questions: string[];
  /** Where a question goes: the assistant with the context and the question prefilled. */
  hrefFor: (question: string) => string;
  layout?: "row" | "stack";
}) {
  const t = useTranslations("opportunity.details");
  return (
    <section aria-labelledby="ask-ai-heading" className={CARD_CLASS}>
      <h2 id="ask-ai-heading" className="flex items-center gap-2 text-h3 text-neutral-900">
        <Sparkles size={18} strokeWidth={1.75} aria-hidden="true" className="text-primary-600" />
        {title}
      </h2>
      <ul className={cn("gap-2 grid grid-cols-1 mt-4", layout === "row" && "lg:grid-cols-3")}>
        {questions.map((question) => (
          <li key={question} className="flex">
            {/* The assistant opens the chat for this context and prefills the question. */}
            <Link
              href={hrefFor(question)}
              className="flex items-center bg-white px-4 py-2 border border-neutral-200 hover:border-neutral-400 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 w-full min-h-11 md:min-h-10 font-medium text-primary-600 text-sm text-start transition-colors"
            >
              {question}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-caption text-neutral-600">{t("askDisclaimer")}</p>
    </section>
  );
}
