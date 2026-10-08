import Link from "next/link";
import { Check } from "lucide-react";
import type { NextStep } from "@/src/feature/profile/components/header/completion";
import Badge from "@/src/shared/ui/Badge";
import { CompletionDonut } from "@/src/shared/ui/CompletionDonut";
import { cn } from "../services/utils";
import { CARD_CLASS, GHOST_LINK_CLASS } from "./styles";

export interface ProfileSectionStatus {
  key: string;
  label: string;
  complete: boolean;
  /** Field-level progress, when known; turns an unfinished section into "{done} of {total}". */
  progress?: { done: number; total: number };
  /** Where "Add"/"Finish" takes the user to fill the section in. */
  href: string;
}

interface ProfileProgressCardProps {
  percent: number;
  sections: ProfileSectionStatus[];
  nextStep?: NextStep;
  className?: string;
}

const ACTION_LINK_CLASS =
  "inline-flex items-center rounded-sm min-h-11 md:min-h-0 font-medium text-primary-600 text-small hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2";

/** 20px ring for a partly filled section: primary-600 arc on a neutral-100 track. */
function MiniRing({ done, total }: { done: number; total: number }) {
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? Math.min(1, done / total) : 0;

  return (
    <svg width={20} height={20} viewBox="0 0 20 20" aria-hidden="true" className="-rotate-90 shrink-0">
      <circle cx={10} cy={10} r={radius} fill="none" strokeWidth={2.5} className="stroke-neutral-100" />
      <circle
        cx={10}
        cy={10}
        r={radius}
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - ratio)}
        className="stroke-primary-600"
      />
    </svg>
  );
}

/** Next-step anchors ("#education") point into the profile page. */
const profileHref = (href: string) => (href.startsWith("#") ? `/profile${href}` : href);

/**
 * Profile progress: the profile header's donut beside the next step, then a checklist of the
 * four sections. At 100% it collapses to a single "Profile complete" row.
 */
export function ProfileProgressCard({ percent, sections, nextStep, className }: ProfileProgressCardProps) {
  const value = Math.min(100, Math.max(0, Math.round(percent)));
  const viewProfile = (
    <Link href="/profile" className={GHOST_LINK_CLASS}>
      View profile
    </Link>
  );

  if (value >= 100) {
    return (
      <section aria-label="Profile progress" className={cn(CARD_CLASS, "flex justify-between items-center gap-3")}>
        <Badge tone="green">
          <Check size={12} strokeWidth={2.25} aria-hidden="true" />
          Profile complete
        </Badge>
        {viewProfile}
      </section>
    );
  }

  return (
    <section aria-labelledby="profile-progress-heading" className={cn(CARD_CLASS, "self-start w-full", className)}>
      <div className="flex justify-between items-baseline gap-3">
        <h2 id="profile-progress-heading" className="text-h3 text-neutral-900">
          Profile progress
        </h2>
        {viewProfile}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div role="img" aria-label={`Profile ${value}% complete`}>
          <CompletionDonut percent={value} size={56} />
        </div>
        {nextStep && (
          <div className="min-w-0">
            <Link
              href={profileHref(nextStep.href)}
              className="rounded-sm font-medium text-base text-neutral-900 hover:text-primary-800 leading-5.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            >
              {nextStep.label}
            </Link>
            <p className="mt-0.5 text-neutral-600 text-small">{nextStep.impact}</p>
          </div>
        )}
      </div>

      {/* 20px above the divider, 16px below it. */}
      <ul className="flex flex-col gap-1 mt-5 pt-4 border-neutral-100 border-t">
        {sections.map((section) => {
          const progress = section.progress;
          const partial = !section.complete && progress !== undefined && progress.done > 0;

          return (
            <li key={section.key} className="flex justify-between items-center gap-3 min-h-11 md:min-h-9 text-small">
              <span className="flex items-center gap-2.5 min-w-0 text-neutral-800">
                {section.complete ? (
                  <span className="flex justify-center items-center bg-primary-50 rounded-full size-5 text-primary-800 shrink-0">
                    <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                ) : partial ? (
                  <MiniRing done={progress.done} total={progress.total} />
                ) : (
                  <span aria-hidden="true" className="border-[1.5px] border-neutral-200 rounded-full size-5 shrink-0" />
                )}
                <span className="truncate">{section.label}</span>
                {partial && (
                  <span className="text-neutral-600 whitespace-nowrap">
                    {progress.done} of {progress.total}
                  </span>
                )}
                <span className="sr-only">{section.complete ? ", done" : partial ? ", in progress" : ", not started"}</span>
              </span>
              {!section.complete && (
                <Link
                  href={section.href}
                  aria-label={`${partial ? "Finish" : "Add"} ${section.label.toLowerCase()}`}
                  className={ACTION_LINK_CLASS}
                >
                  {partial ? "Finish" : "Add"}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
