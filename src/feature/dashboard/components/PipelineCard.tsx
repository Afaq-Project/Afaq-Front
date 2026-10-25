"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { STATUS_COLORS, type ApplicationStatusKey } from "@/src/shared/lib/status-colors";
import { buttonClasses } from "@/src/shared/ui/Button";
import { cn } from "../services/utils";
import { CARD_CLASS, GHOST_LINK_CLASS } from "./styles";
import { useTranslations } from "next-intl";

export type PipelineStage = ApplicationStatusKey;

type Column = "not_started" | "in_progress" | "submitted" | "in_review" | "result";

const BAR_ORDER: PipelineStage[] = ["not_started", "in_progress", "submitted", "in_review", "accepted", "rejected"];

// Labels: the status name for the first four, dashboard.pipeline.decision for the result.
const COLUMNS: { key: Column; stages: PipelineStage[] }[] = [
  { key: "not_started", stages: ["not_started"] },
  { key: "in_progress", stages: ["in_progress"] },
  { key: "submitted", stages: ["submitted"] },
  { key: "in_review", stages: ["in_review"] },
  { key: "result", stages: ["accepted", "rejected"] },
];

const GROW_MS = 220;
const STAGGER_MS = 60;

interface PipelineCardProps {
  /** Applications per stage; a missing stage counts as 0. */
  counts: Partial<Record<PipelineStage, number>>;
  /** Days left for each not started / in progress application that closes within 7 days. */
  closingDaysLeft: number[];
  /**
   * The attention strip is showing the urgent ones above, so the closing-soon line is plain text
   * rather than a second alert.
   */
  attentionVisible?: boolean;
}


function Dot({ className, hollow }: { className: string; hollow: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("rounded-full size-2 shrink-0", hollow ? "border-[1.5px] border-neutral-400" : className)}
    />
  );
}

/**
 * Applications by stage: a segmented bar over five linked stage columns, plus one line about
 * what to do next. Hovering or focusing a column highlights its segment(s) in the bar.
 */
export function PipelineCard({ counts, closingDaysLeft: closing, attentionVisible = false }: PipelineCardProps) {
  const t = useTranslations();
  const count = (stage: PipelineStage) => counts[stage] ?? 0;
  const total = BAR_ORDER.reduce((sum, stage) => sum + count(stage), 0);
  const [active, setActive] = useState<Column | null>(null);
  const [grown, setGrown] = useState(false);

  // Start from zero width and grow on the next frame so the transition runs.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const activeStages = COLUMNS.find((column) => column.key === active)?.stages ?? [];
  const segments = BAR_ORDER.filter((stage) => count(stage) > 0);

  const unfinished = count("not_started") + count("in_progress");
  const waiting = count("submitted") + count("in_review");

  return (
    <section aria-labelledby="pipeline-heading" className={CARD_CLASS}>
      <div className="flex justify-between items-baseline gap-3">
        <h2 id="pipeline-heading" className="text-h3 text-neutral-900">
          {t("dashboard.pipeline.title")}
          {total > 0 && <span className="ms-2 font-normal text-neutral-600 text-small">{t("dashboard.pipeline.total", { count: total })}</span>}
        </h2>
        {total > 0 && (
          <Link href="/applications" className={GHOST_LINK_CLASS}>
            {t("common.viewAll")}
          </Link>
        )}
      </div>

      {total === 0 ? (
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 mt-4">
          <p className="text-body text-neutral-600">{t("dashboard.pipeline.empty")}</p>
          <Link href="/discover" className={buttonClasses("secondary", "shrink-0 self-start sm:self-auto")}>
            {t("common.discoverOpportunities")}
          </Link>
        </div>
      ) : (
        <>
          {/* The columns below carry the same numbers as text. */}
          <div aria-hidden="true" className="flex gap-1 mt-5 h-3">
            {segments.map((stage, index) => (
              <div
                key={stage}
                className={cn(
                  "rounded-full origin-left rtl:origin-right motion-reduce:transition-none!",
                  STATUS_COLORS[stage].dot,
                  active && !activeStages.includes(stage) && "opacity-40",
                )}
                style={{
                  flexGrow: count(stage),
                  transform: grown ? "scaleX(1)" : "scaleX(0)",
                  transition: `transform ${GROW_MS}ms ease-out ${index * STAGGER_MS}ms, opacity 150ms ease-out`,
                }}
              />
            ))}
          </div>

          {/* TODO: link each column to /applications filtered by status once that page reads a status from the URL. */}
          <ul className="gap-x-4 gap-y-5 grid grid-cols-3 md:flex md:items-start md:gap-2 mt-5">
            {COLUMNS.map((column, index) => {
              const value = column.stages.reduce((sum, stage) => sum + count(stage), 0);
              const zero = value === 0;
              const isResult = column.key === "result";
              // Only the outcomes that happened, e.g. "1 accepted" or "1 accepted · 1 rejected".
              const outcomes = [
                { key: "accepted", text: t("dashboard.pipeline.accepted", { count: count("accepted") }), count: count("accepted"), className: STATUS_COLORS.accepted.text },
                { key: "rejected", text: t("dashboard.pipeline.rejected", { count: count("rejected") }), count: count("rejected"), className: STATUS_COLORS.rejected.text },
              ].filter((outcome) => outcome.count > 0);
              const columnLabel = isResult ? t("dashboard.pipeline.decision") : t(`applicationStatus.${column.key as PipelineStage}`);
              const outcomeText = outcomes.map((outcome) => outcome.text).join(", ");
              const label =
                isResult && outcomeText
                  ? t("dashboard.pipeline.columnLabelOutcomes", { label: columnLabel, count: value, outcomes: outcomeText })
                  : t("dashboard.pipeline.columnLabel", { label: columnLabel, count: value });
              const dotClass = isResult
                ? count("accepted") > 0
                  ? STATUS_COLORS.accepted.dot
                  : "bg-neutral-400"
                : STATUS_COLORS[column.stages[0]].dot;

              return (
                <Fragment key={column.key}>
                  {index > 0 && (
                    // Same height as the count (36px) so the chevron centers on the number row.
                    <li aria-hidden="true" className="hidden md:flex items-center h-9">
                      <ChevronRight size={16} strokeWidth={1.5} className="rtl:-scale-x-100 text-neutral-200" />
                    </li>
                  )}
                  <li className="md:flex-1 min-w-0">
                    <Link
                      href="/applications"
                      aria-label={label}
                      onMouseEnter={() => setActive(column.key)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(column.key)}
                      onBlur={() => setActive(null)}
                      className="flex flex-col gap-1 hover:bg-neutral-50 -m-2 p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 transition-colors"
                    >
                      {/* Size stays out of cn(): tailwind-merge reads custom text-* tokens as colors and drops them. */}
                      <span
                        className={`text-[30px] leading-9 font-semibold ${zero ? "text-neutral-400" : "text-neutral-900"}`}
                      >
                        {value}
                      </span>
                      <span className="flex items-center gap-1.5 text-neutral-600 text-small">
                        <Dot hollow={zero} className={dotClass} />
                        <span className="truncate">{columnLabel}</span>
                      </span>
                      {isResult && outcomes.length > 0 && (
                        <span className="text-caption truncate whitespace-nowrap">
                          {outcomes.map((outcome, i) => (
                            <Fragment key={outcome.key}>
                              {i > 0 && <span className="text-neutral-600"> · </span>}
                              <span className={outcome.className}>{outcome.text}</span>
                            </Fragment>
                          ))}
                        </span>
                      )}
                    </Link>
                  </li>
                </Fragment>
              );
            })}
          </ul>

          {closing.length > 0 && attentionVisible ? (
            <p className="mt-5 text-neutral-600 text-small">
              {t("dashboard.pipeline.closingPlain", { unfinished, count: closing.length })}
            </p>
          ) : closing.length > 0 ? (
            // Amber, never red: urgent deadlines have the attention strip (warning-100 isn't a token, so the border is the 400 stop at low opacity).
            <div className="flex sm:flex-row flex-col sm:items-center gap-3 bg-warning-50 mt-5 px-4 py-3 border border-warning-400/30 rounded-md">
              <p className="flex flex-1 items-start gap-2 text-body text-warning-800">
                <Clock size={20} strokeWidth={1.75} aria-hidden="true" className="mt-px shrink-0" />
                {t("dashboard.pipeline.closing", { unfinished, count: closing.length })}
              </p>
              {/* TODO: filter to not started / in progress once /applications reads a status from the URL. */}
              <Link
                href="/applications"
                className="after:absolute relative inline-flex justify-center items-center self-start sm:self-auto bg-white px-3 border border-neutral-200 hover:border-neutral-400 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 h-8 font-medium text-primary-600 text-small transition-colors shrink-0 after:-inset-y-1.5 after:content-['']"
              >
                {t("common.review")}
              </Link>
            </div>
          ) : waiting > 0 ? (
            <p className="mt-5 text-neutral-600 text-small">{t("dashboard.pipeline.waiting", { count: waiting })}</p>
          ) : null}
        </>
      )}
    </section>
  );
}
