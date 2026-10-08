import Link from "next/link";
import { StatusChip } from "@/src/feature/applications/components/StatusChip";
import { formatDeadline } from "@/src/feature/applications/services/utils";
import type { ApplicationSummary } from "@/src/feature/applications/types/application";
import { buttonClasses } from "@/src/shared/ui/Button";

const MAX_ITEMS = 3;

/** Applications that end within two days and still need work. Renders nothing when there are none. */
export function AttentionStrip({ applications }: { applications: ApplicationSummary[] }) {
  if (applications.length === 0) return null;

  const shown = applications.slice(0, MAX_ITEMS);
  const more = applications.length - shown.length;

  return (
    // danger-100 isn't a token, so the border is the 400 stop at low opacity.
    <section
      aria-labelledby="attention-heading"
      className="bg-danger-50 p-5 md:p-6 border border-danger-400/30 rounded-lg"
    >
      <h2 id="attention-heading" className="text-danger-800 text-h3">
        Needs your attention
      </h2>

      <ul className="divide-y divide-danger-400/20 mt-2">
        {shown.map((application) => (
          <li
            key={application.id}
            className="flex sm:flex-row flex-col sm:items-center gap-3 py-3 last:pb-0"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-h3 text-neutral-900">{application.title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="font-medium text-danger-800 text-small">
                  {formatDeadline(application.daysLeft)}
                </span>
                <StatusChip status={application.status} />
              </div>
            </div>
            <Link
              href={`/applications/${application.id}`}
              className={buttonClasses("secondary", "bg-white shrink-0 self-start sm:self-auto")}
            >
              Open application
            </Link>
          </li>
        ))}
      </ul>

      {more > 0 && (
        <Link
          href="/applications"
          className="inline-flex items-center mt-3 rounded-sm min-h-11 md:min-h-0 font-medium text-primary-600 text-small hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
        >
          +{more} more
        </Link>
      )}
    </section>
  );
}
