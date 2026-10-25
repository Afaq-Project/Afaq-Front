import Link from "next/link";
import { cn } from "@/src/feature/dashboard/services/utils";
import { formatDeadlineDay } from "@/src/shared/lib/deadline";
import { useLocale, useTranslations } from "next-intl";

export interface UsageRow {
  label: string;
  used: number;
  limit: number;
}

/** Bar fill: green normally, amber from 80%, red at the limit. */
function fillClass(used: number, limit: number) {
  if (used >= limit) return "bg-danger-600";
  if (used / limit >= 0.8) return "bg-warning-400";
  return "bg-primary-600";
}

/**
 * "Your AI usage this month": one thin bar per quota with the numbers in text, the reset date,
 * and an upgrade link. Premium users get a single line instead. Color is never the only signal.
 */
export function AiUsageCard({
  rows,
  resetsOn,
  premium = false,
  showUpgrade = true,
  headingLevel = "h2",
  className,
}: {
  rows: UsageRow[];
  /** ISO date (YYYY-MM-DD). */
  resetsOn?: string;
  premium?: boolean;
  /** Off where the page already has its own upgrade button. */
  showUpgrade?: boolean;
  /** "h3" when the card sits under a section heading. */
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const t = useTranslations("aiUsage");
  const locale = useLocale();
  const Heading = headingLevel;

  if (premium) {
    return <p className={cn("text-caption text-neutral-600", className)}>{t("premium")}</p>;
  }

  return (
    <section aria-labelledby="ai-usage-heading" className={cn("flex flex-col gap-3", className)}>
      <Heading id="ai-usage-heading" className="font-medium text-neutral-900 text-small">
        {t("title")}
      </Heading>
      {rows.map((row) => {
        const atLimit = row.used >= row.limit;
        const percent = Math.min(100, Math.round((row.used / row.limit) * 100));
        return (
          <div key={row.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline gap-2 text-small">
              <span className="text-neutral-800">{row.label}</span>
              <span className={atLimit ? "font-medium text-danger-800" : "text-neutral-600"}>
                {atLimit ? t("limitReached") : t("used", { used: row.used, limit: row.limit })}
              </span>
            </div>
            <div aria-hidden="true" className="bg-neutral-100 rounded-full h-1.5 overflow-hidden">
              <div className={cn("rounded-full h-full", fillClass(row.used, row.limit))} style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
      <div className="flex justify-between items-center gap-2">
        {resetsOn && <p className="text-caption text-neutral-600">{t("resets", { date: formatDeadlineDay(resetsOn, locale) })}</p>}
        {showUpgrade && (
          <Link
            href="/billing"
            className="rounded-sm min-h-11 md:min-h-0 inline-flex items-center font-medium text-neutral-600 text-small hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            {t("upgrade")}
          </Link>
        )}
      </div>
    </section>
  );
}
