import Link from "next/link";
import { Clock } from "lucide-react";
import { StatusChip } from "@/src/feature/applications/components/StatusChip";
import type { ApplicationSummary } from "@/src/feature/applications/types/application";
import { buttonClasses } from "@/src/shared/ui/Button";
import { useTranslations } from "next-intl";
import { useDeadlineText } from "@/src/shared/lib/useDeadlineText";

const MAX_ITEMS = 3;

const ROW = "flex sm:flex-row flex-col sm:items-center gap-3 px-4 py-3 min-h-14";

/**
 * Applications that end within two days and still need work, as a slim alert list under the
 * greeting: white, with a red left edge, one row each. Renders nothing when there are none.
 */
export function AttentionStrip({ applications }: { applications: ApplicationSummary[] }) {
  const t = useTranslations("dashboard.attention");
  const deadline = useDeadlineText();

  if (applications.length === 0) return null;

  const shown = applications.slice(0, MAX_ITEMS);
  const more = applications.length - shown.length;

  return (
    <section
      aria-label={t("label")}
      className="bg-white border border-neutral-100 border-s-4 border-s-danger-600 rounded-lg"
    >
      <ul>
        {shown.map((application) => (
          <li key={application.id} className={`${ROW} border-neutral-100 border-t first:border-t-0`}>
            <div className="flex flex-1 items-start sm:items-center gap-3 min-w-0">
              <Clock size={20} strokeWidth={1.75} aria-hidden="true" className="mt-px sm:mt-0 text-danger-800 shrink-0" />
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 text-body">
                <span>
                  <span className="font-semibold text-neutral-900">{application.title}</span>{" "}
                  <span className="text-danger-800">{deadline.endsInInline(application.daysLeft)}</span>
                </span>
                <StatusChip status={application.status} />
              </p>
            </div>
            <Link
              href={`/applications/${application.id}`}
              className={buttonClasses("soft", "w-full sm:w-auto md:h-8 px-3 text-small shrink-0")}
            >
              {t("open")}
            </Link>
          </li>
        ))}
        {more > 0 && (
          <li className="border-neutral-100 border-t">
            {/* TODO: /applications has no deadline filter in its URL yet; its default order is active applications by soonest deadline. */}
            <Link
              href="/applications"
              className="flex items-center hover:bg-neutral-50 px-4 py-3 rounded-b-lg min-h-14 font-medium text-primary-600 text-small hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-inset transition-colors"
            >
              {t("more", { count: more })}
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
}
