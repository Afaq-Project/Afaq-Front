import { Bell } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { STATUS_COLORS, type ApplicationStatusKey } from "@/src/shared/lib/status-colors";
import type { SectionTone } from "../../../constants";
import { useLandingContent } from "../../../content";
import { Card } from "../../ui/Card";
import { DeadlineText } from "../../ui/DeadlineText";
import { FlagTile } from "../../ui/FlagTile";
import { StatusChip } from "../../ui/StatusChip";
import { FeatureSection } from "../feature/FeatureSection";

/** How far along the 5-step journey (not started → in progress → submitted → in review → decision) each status is. */
const STATUS_STEP: Record<ApplicationStatusKey, number> = {
  not_started: 1,
  in_progress: 2,
  submitted: 3,
  in_review: 4,
  accepted: 5,
  rejected: 5,
};
const STEPS = 5;

/** Five 6px dots, filled up to the status's step in its status color. */
function ProgressDots({ status }: { status: ApplicationStatusKey }) {
  return (
    <span className="flex gap-1 mt-1.5">
      {Array.from({ length: STEPS }, (_, step) => (
        <span key={step} className={cn("rounded-full size-1.5", step < STATUS_STEP[status] ? STATUS_COLORS[status].dot : "bg-neutral-100")} />
      ))}
    </span>
  );
}

/**
 * Reminder card: overlaps the list's top/inline-end corner from 1024px. Its bottom edge sits
 * 12px below the list's top edge, so it never covers the header text; it reaches 12px past the
 * inline-end edge until 1280px (the container padding is only 24px there), then 24px. Below
 * 1024px it sits above the list at the inline-end.
 */
function ReminderCard({ className }: { className?: string }) {
  const content = useLandingContent();
  const { reminder } = content.tracking.preview;
  return (
    <Card floating className={cn("flex items-start gap-3 p-3.5 lg:p-3.5", className)}>
      <span className="inline-flex justify-center items-center bg-primary-50 rounded-sm size-7 text-primary-800 shrink-0">
        <Bell size={16} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-landing-caption text-neutral-600">{reminder.meta}</p>
        <p className="font-medium text-landing-small text-neutral-900">{reminder.text}</p>
      </div>
    </Card>
  );
}

/** Tracking preview: an applications list sorted by deadline, plus a floating reminder. */
function TrackingPreview() {
  const content = useLandingContent();
  const preview = content.tracking.preview;

  return (
    <div className="flex flex-col">
      <ReminderCard className="lg:-end-3 xl:-end-6 z-10 lg:absolute mb-3 lg:mb-0 ms-auto w-full max-w-70 lg:top-3 lg:-translate-y-full" />

      <Card floating className="p-0 lg:p-0 overflow-hidden">
        <div className="flex justify-between items-baseline gap-3 px-5 py-4 border-neutral-100 border-b">
          <p className="font-semibold text-landing-small text-neutral-900">{preview.title}</p>
          <p className="text-landing-caption text-neutral-600">{preview.sortNote}</p>
        </div>
        <ul className="divide-y divide-neutral-100">
          {preview.rows.map((row) => (
            <li key={row.title} className="flex items-start gap-3 px-5 py-3.5">
              <FlagTile code={row.countryCode} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-landing-small text-neutral-900 line-clamp-2 sm:line-clamp-1">{row.title}</p>
                <p className="text-landing-caption text-neutral-600">{preview.rowMeta.replace("{country}", row.country)}</p>
                <ProgressDots status={row.status} />
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <StatusChip status={row.status} />
                {row.daysLeft !== undefined ? (
                  <DeadlineText daysLeft={row.daysLeft} className="text-landing-caption" />
                ) : (
                  <span className="text-landing-caption text-neutral-600">{row.note}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/** Section 7: tracking and reminders, text at the inline-start and the example list at the inline-end. */
export function TrackingSection({ id, tone }: { id: string; tone: SectionTone }) {
  const content = useLandingContent();
  const { tracking } = content;
  return (
    <FeatureSection
      id={id}
      tone={tone}
      eyebrow={tracking.eyebrow}
      title={tracking.title}
      intro={tracking.intro}
      points={tracking.points}
      preview={<TrackingPreview />}
      previewLabel={tracking.preview.label}
      previewClassName="max-w-130"
    />
  );
}
