import { Circle, CircleCheck } from "lucide-react";
import { smoothScrollToHash } from "@/src/shared/lib/scroll";
import type { MatchFactor } from "./completion";

interface MatchFactorListProps {
  factors: MatchFactor[];
  /** Called after jumping to a field, e.g. to close the popover. */
  onNavigate?: () => void;
}

/** Match factors with their state as icon + text (never color alone) and jump links. */
export function MatchFactorList({ factors, onNavigate }: MatchFactorListProps) {
  return (
    <div>
      <h3 className="mb-3 text-h3 text-neutral-900">What your match score uses</h3>
      <ul className="flex flex-col gap-1">
        {factors.map((factor) => (
          <li key={factor.key} className="flex min-h-11 items-center gap-2 md:min-h-9">
            {factor.complete ? (
              <CircleCheck size={20} strokeWidth={1.75} className="shrink-0 text-success-600" aria-hidden="true" />
            ) : (
              <Circle size={20} strokeWidth={1.75} className="shrink-0 text-neutral-400" aria-hidden="true" />
            )}
            <span className="flex-1 text-small text-neutral-900">
              {factor.label}
              <span className="sr-only">{factor.complete ? ", added" : ", missing"}</span>
            </span>
            {factor.complete ? (
              <span className="text-caption text-neutral-600">Added</span>
            ) : (
              <a
                href={factor.href}
                onClick={(e) => {
                  smoothScrollToHash(e, factor.href);
                  onNavigate?.();
                }}
                className="rounded-sm text-caption text-primary-600 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              >
                Add it
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
