"use client";

import Link from "next/link";
import { CircleCheck, Clock, PenLine, Send, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ApplicationStatusKey } from "@/src/shared/lib/status-colors";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import { cn } from "../services/utils";
import { GHOST_LINK_CLASS } from "./styles";

/** Deadlines this close (in days) turn the deadlines card red. */
const URGENT_DAYS = 2;

// Solid icon tile fill per ramp (the 600 stop).
const RAMP_FILL = {
  info: "bg-info-600",
  primary: "bg-primary-600",
  success: "bg-success-600",
  warning: "bg-warning-600",
  danger: "bg-danger-600",
} as const;

type Ramp = keyof typeof RAMP_FILL;

const CARD_CLASS =
  "flex justify-between items-center gap-3 bg-white px-5 py-4 border border-neutral-100 rounded-2xl min-h-21";

const GRID_CLASS = "gap-3 grid grid-cols-2 md:grid-cols-4 mt-4";

interface ApplicationMetricsProps {
  /** Applications per status; a missing status counts as 0. */
  counts: Partial<Record<ApplicationStatusKey, number>>;
  /** Days left for each not started / in progress application that closes within 14 days. */
  deadlineDaysLeft: number[];
  loading?: boolean;
}

interface Metric {
  key: string;
  label: string;
  accessibleName: string;
  value: number;
  icon: LucideIcon;
  ramp: Ramp;
  href: string;
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  return (
    <li>
      <Link
        href={metric.href}
        aria-label={metric.accessibleName}
        className={cn(
          CARD_CLASS,
          "h-full hover:border-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
        )}
      >
        <span className="flex flex-col min-w-0">
          <span className="text-neutral-600 text-small truncate">{metric.label}</span>
          {/* Size stays out of cn(): tailwind-merge reads custom text-* tokens as colors and drops them. */}
          <span className="mt-1 font-semibold tabular-nums text-[26px] text-neutral-900 leading-8">{metric.value}</span>
        </span>
        <span
          aria-hidden="true"
          className={cn("flex justify-center items-center rounded-[10px] size-10 text-white shrink-0", RAMP_FILL[metric.ramp])}
        >
          <Icon size={20} strokeWidth={1.75} />
        </span>
      </Link>
    </li>
  );
}

/**
 * "Your applications": four linked counts (in progress, submitted, accepted offers, deadlines in
 * the next 14 days). The deadlines card turns red when one of them is 2 days away or less.
 */
export function ApplicationMetrics({ counts, deadlineDaysLeft, loading = false }: ApplicationMetricsProps) {
  const t = useTranslations("dashboard.applicationMetrics");
  const tc = useTranslations("common");
  const count = (status: ApplicationStatusKey) => counts[status] ?? 0;

  const inProgress = count("in_progress");
  const submitted = count("submitted") + count("in_review");
  const accepted = count("accepted");
  const deadlines = deadlineDaysLeft.length;
  const urgent = deadlineDaysLeft.filter((days) => days <= URGENT_DAYS).length;

  const metrics: Metric[] = [
    {
      key: "in_progress",
      label: t("inProgress"),
      accessibleName: t("inProgressLabel", { count: inProgress }),
      value: inProgress,
      icon: PenLine,
      ramp: "info",
      href: "/applications?status=in_progress",
    },
    {
      key: "submitted",
      label: t("submitted"),
      accessibleName: t("submittedLabel", { count: submitted }),
      value: submitted,
      icon: Send,
      ramp: "primary",
      // TODO: filter to submitted + in review once /applications has a tab (or status list) for both.
      href: "/applications",
    },
    {
      key: "accepted",
      label: t("accepted"),
      accessibleName: t("acceptedLabel", { count: accepted }),
      value: accepted,
      icon: CircleCheck,
      ramp: "success",
      // TODO: the decision tab also lists rejected ones; filter to accepted once /applications can.
      href: "/applications?status=decision",
    },
    {
      key: "deadlines",
      label: t("deadlines"),
      accessibleName:
        urgent > 0
          ? t("deadlinesUrgentLabel", { count: deadlines, urgent })
          : t("deadlinesLabel", { count: deadlines }),
      value: deadlines,
      icon: Clock,
      ramp: urgent > 0 ? "danger" : "warning",
      // The list's default order is active ones first, soonest deadline first.
      href: "/applications",
    },
  ];

  return (
    <section aria-labelledby="applications-metrics-heading">
      <div className="flex justify-between items-baseline gap-3">
        <h2 id="applications-metrics-heading" className="text-h2 text-neutral-900">
          {t("title")}
        </h2>
        <Link href="/applications" className={GHOST_LINK_CLASS}>
          {tc("viewAll")}
        </Link>
      </div>

      {loading ? (
        <div role="status" className={GRID_CLASS}>
          <span className="sr-only">{t("loading")}</span>
          {metrics.map((metric) => (
            <div key={metric.key} className={CARD_CLASS}>
              <div className="flex flex-col flex-1 gap-2">
                <Skeleton className="w-20 h-3.5" />
                <Skeleton className="w-10 h-7" />
              </div>
              <Skeleton className="rounded-[10px] size-10 shrink-0" />
            </div>
          ))}
        </div>
      ) : (
        <ul className={GRID_CLASS}>
          {metrics.map((metric) => (
            <MetricCard key={metric.key} metric={metric} />
          ))}
        </ul>
      )}
    </section>
  );
}
