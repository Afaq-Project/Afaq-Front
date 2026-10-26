"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, Clock, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ApplicationSummary } from "@/src/feature/applications/types/application";
import { getApplicationDetail } from "@/src/feature/applications/services/utils";
import { reviewPath, useReviews } from "@/src/feature/documents/services/reviewStore";
import { HorizonMotif } from "@/src/shared/ui/HorizonMotif";
import { formatShortDay, getDeadlineUrgency, isoDateFromToday, type DeadlineUrgency } from "@/src/shared/lib/deadline";
import { cn } from "../services/utils";

const CHIP_CLASS: Record<DeadlineUrgency, string> = {
  urgent: "bg-danger-900 text-danger-100",
  soon: "bg-warning-900 text-warning-100",
  later: "bg-primary-800 text-primary-100",
};

const BUTTON_CLASS =
  "inline-flex justify-center items-center gap-2 px-4 py-[9px] rounded-[10px] font-medium text-sm whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900";

// The glow and rings animate on the first dashboard visit of a page load, not on every return.
let introPlayed = false;

type StepKey = "documents" | "essay" | "submitted";

interface Step {
  key: StepKey;
  done: boolean;
}

interface DashboardHeroProps {
  /** The greeting (the page's H1). */
  title: string;
  /** The line under it: what's due, or a nudge to explore. */
  summary: ReactNode;
  /** From pickFocusApplication; without one the hero is just the greeting. */
  application?: ApplicationSummary;
}

/**
 * The dashboard's top: a dark green surface with the greeting and, when there is one, the most
 * urgent unfinished application with its next step. ≥1200px one row. Below that: the greeting
 * (beside the application from 768px), the application with its actions beside it, then the
 * steps; on narrow phones the actions drop below the steps at full width.
 */
export function DashboardHero({ title, summary, application }: DashboardHeroProps) {
  const [intro] = useState(() => !introPlayed);
  useEffect(() => {
    introPlayed = true;
  }, []);

  return (
    <section
      aria-labelledby="dashboard-hero-heading"
      // The flat 900 shows while the glow fades in.
      className="isolate relative bg-primary-900 p-5 md:px-7 md:py-6 rounded-2xl overflow-hidden"
    >
      <div
        aria-hidden="true"
        className={cn("absolute inset-0 bg-sunrise-glow", intro && "motion-safe:animate-sunrise-glow")}
      />
      <HorizonMotif animate={intro} />
      <div
        className={cn(
          // A container so the actions can tell whether they fit beside the title (see FocusActions).
          "@container/hero relative z-[1]",
          // ≥1200px one row: the row wrappers below become `contents`, so their children join this grid.
          // The md flex rules stop at 1199px: Tailwind emits min-[1200px] before md, so md would win.
          application && "md:max-[1199px]:flex md:max-[1199px]:flex-col min-[1200px]:grid min-[1200px]:grid-cols-[220px_1px_260px_1fr_auto] min-[1200px]:items-center min-[1200px]:gap-7",
        )}
      >
        <div className="md:max-[1199px]:flex md:items-stretch md:gap-7 min-[1200px]:contents">
          {/* 768–1199px: as wide as its desktop column, so the application and its actions get the rest. */}
          <header className="md:max-[1199px]:flex-none md:self-center md:max-[1199px]:w-55 min-w-0">
            <h1 id="dashboard-hero-heading" className="text-h1 text-white">
              {title}
            </h1>
            <p className="mt-1 text-body text-primary-100">{summary}</p>
          </header>
          {application && <FocusApplication application={application} section="top" />}
        </div>
        {application && <FocusApplication application={application} section="bottom" />}
      </div>
    </section>
  );
}

/**
 * The focus application in two parts: "top" is the divider and the application with its actions
 * beside it (below 1200px); "bottom" is the steps, then the actions where they go otherwise.
 */
function FocusApplication({ application, section }: { application: ApplicationSummary; section: "top" | "bottom" }) {
  const focus = useFocusSteps(application);

  if (section === "top") {
    return (
      <>
        <div aria-hidden="true" className="bg-primary-200/25 my-4 md:my-0 w-full md:w-px h-px md:h-auto md:self-stretch" />
        <div className="flex md:flex-1 items-start gap-3 min-w-0 min-[1200px]:contents">
          <ApplicationInfo application={application} />
          <FocusActions focus={focus} placement="beside" />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-5 mt-5 md:pt-5 md:border-primary-800 md:border-t min-[1200px]:contents">
      <StepsTracker focus={focus} />
      <FocusActions focus={focus} placement="end" />
    </div>
  );
}

function ApplicationInfo({ application }: { application: ApplicationSummary }) {
  const t = useTranslations("dashboard.hero");
  const locale = useLocale();
  const deadlineDate = getApplicationDetail(application.id)?.deadlineDate ?? isoDateFromToday(application.daysLeft);
  const date = formatShortDay(deadlineDate, locale);
  const days = application.daysLeft;
  const due =
    days <= 0 ? t("dueToday") : days === 1 ? t("dueTomorrow", { date }) : t("dueIn", { count: days, date });

  return (
    // min-w-0: a long title wraps (then clamps to 2 lines) instead of pushing the actions out.
    <div className="flex-1 min-[1200px]:self-center min-w-0">
      <p
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption",
          CHIP_CLASS[getDeadlineUrgency(days)],
        )}
      >
        <Clock size={14} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
        {due}
      </p>
      <h2 className="mt-2.5 font-semibold text-[20px] text-white leading-7 line-clamp-2">{application.title}</h2>
      <p className="mt-1 text-primary-200 text-small">{application.provider}</p>
    </div>
  );
}

type FocusSteps = ReturnType<typeof useFocusSteps>;

/** Steps from data the app already has: linked documents, an AI review of a linked essay, and submitting. */
function useFocusSteps(application: ApplicationSummary) {
  const t = useTranslations("dashboard.hero");
  const { reviews } = useReviews();
  // TODO: linked documents come from the application details mock until there's a tracker API.
  const documents = getApplicationDetail(application.id)?.documents ?? [];
  const essays = documents.filter((doc) => doc.type === "essay");
  const reviewedEssay = essays.find((doc) => reviews[doc.id]);

  // Candidates are never submitted, so the last step is always open.
  const steps: Step[] = [
    { key: "documents", done: documents.length > 0 },
    { key: "essay", done: Boolean(reviewedEssay) },
    { key: "submitted", done: false },
  ];
  const current = steps.find((step) => !step.done)?.key ?? "submitted";

  const detail = `/applications/${application.id}`;
  const essay = reviewedEssay ?? essays[0];
  // No linked essay yet: its review starts from linking one in the documents section.
  const primaryHref: Record<StepKey, string> = {
    documents: `${detail}#documents`,
    essay: essay ? reviewPath(essay.id, { application: application.id }) : `${detail}#documents`,
    submitted: `${detail}#update-status`,
  };

  return {
    steps,
    current,
    doneCount: steps.filter((step) => step.done).length,
    lastDone: steps.reduce((last, step, index) => (step.done ? index : last), -1),
    detail,
    primaryHref: primaryHref[current],
    primaryLabel: t(`actions.${current}`),
  };
}

/**
 * The two buttons, rendered in two places with exactly one shown (the other is display: none):
 *  - "beside": below 1200px, next to the application, stacked and as wide as the wider one
 *    (w-max grid). Only when the hero content is at least 400px wide: a ~180px title, the 12px
 *    gap and the widest button.
 *  - "end": desktop's last column, stacked; on narrower phones full width under the steps.
 */
function FocusActions({ focus, placement }: { focus: FocusSteps; placement: "beside" | "end" }) {
  const t = useTranslations("dashboard.hero");
  return (
    <div
      className={cn(
        "gap-2",
        placement === "beside"
          ? "hidden @min-[400px]/hero:max-[1199px]:grid w-max shrink-0"
          : "flex flex-col @min-[400px]/hero:max-[1199px]:hidden",
      )}
    >
      <Link href={focus.primaryHref} className={cn(BUTTON_CLASS, "bg-primary-50 hover:bg-white text-primary-900")}>
        <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" />
        {focus.primaryLabel}
      </Link>
      <Link
        href={focus.detail}
        className={cn(BUTTON_CLASS, "border border-primary-200 hover:bg-primary-50/8 text-primary-50")}
      >
        {t("actions.open")}
      </Link>
    </div>
  );
}

/** Upcoming: primary-600 disappears against the glow, so a translucent 200. */
const lineClass = (done: boolean) => (done ? "bg-primary-200" : "bg-primary-200/35");

function StepCircle({ step, isCurrent }: { step: Step; isCurrent: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "z-10 relative flex justify-center items-center rounded-full size-6",
        step.done
          ? "bg-primary-200 text-primary-900"
          : isCurrent
            ? "bg-primary-900 border-2 border-primary-50"
            : "bg-primary-900 border-2 border-primary-600",
      )}
    >
      {step.done && <Check size={14} strokeWidth={2.5} />}
    </span>
  );
}

function StepLabel({ step, isCurrent, className }: { step: Step; isCurrent: boolean; className?: string }) {
  const t = useTranslations("dashboard.hero");
  return (
    <span
      className={cn(
        "text-small whitespace-nowrap",
        isCurrent ? "font-medium text-white" : "text-primary-100",
        className,
      )}
    >
      <span className="@min-[380px]:hidden">{t(`steps.${step.key}Short`)}</span>
      <span className="hidden @min-[380px]:inline">{t(`steps.${step.key}`)}</span>
      <span className="sr-only">
        {step.done ? t("steps.stateDone") : isCurrent ? t("steps.stateCurrent") : t("steps.stateUpcoming")}
      </span>
    </span>
  );
}

/**
 * "{done} of {total} steps done" over the steps, joined by a line. Two layouts, one shown:
 * desktop centers each step in an equal column; below 1200px the first and last circles sit on
 * the content edges (labels aligned start, centered, end) with the rest spread evenly between.
 */
function StepsTracker({ focus }: { focus: FocusSteps }) {
  const t = useTranslations("dashboard.hero");
  const { steps, current, lastDone } = focus;
  const gaps = steps.length - 1;

  return (
    // A container: full step labels need about 380px, else the short ones.
    <div className="@container flex-1 min-w-0">
      <p className="text-primary-100 text-small">{t("progress", { done: focus.doneCount, total: steps.length })}</p>

      <ol
        className="hidden min-[1200px]:grid mt-3"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, index) => {
          const isCurrent = step.key === current;
          return (
            <li
              key={step.key}
              aria-current={isCurrent ? "step" : undefined}
              className="relative flex flex-col items-center text-center"
            >
              {index > 0 && (
                // From the previous circle's center to this one's.
                <span aria-hidden="true" className={cn("top-[11px] end-1/2 absolute w-full h-0.5", lineClass(index <= lastDone))} />
              )}
              <StepCircle step={step} isCurrent={isCurrent} />
              <StepLabel step={step} isCurrent={isCurrent} className="mt-2 px-1" />
            </li>
          );
        })}
      </ol>

      <div className="relative mt-3 min-[1200px]:hidden">
        {/* Segment i runs from circle i to circle i + 1; circle centers sit 12px in from each edge. */}
        {steps.slice(1).map((step, index) => (
          <span
            key={step.key}
            aria-hidden="true"
            className={cn("top-[11px] absolute h-0.5", lineClass(index + 1 <= lastDone))}
            style={{
              insetInlineStart: `calc(12px + (100% - 24px) * ${index / gaps})`,
              width: `calc((100% - 24px) / ${gaps})`,
            }}
          />
        ))}
        {/* Labels hang below their circles; pb holds their 8px gap and 18px line. */}
        <ol className="flex justify-between pb-6.5">
          {steps.map((step, index) => {
            const isCurrent = step.key === current;
            const align = index === 0 ? "start-0" : index === gaps ? "end-0" : "start-1/2 -translate-x-1/2 rtl:translate-x-1/2";
            return (
              <li key={step.key} aria-current={isCurrent ? "step" : undefined} className="relative">
                <StepCircle step={step} isCurrent={isCurrent} />
                <StepLabel step={step} isCurrent={isCurrent} className={cn("top-8 absolute", align)} />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
