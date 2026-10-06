import { Camera } from "lucide-react";
import Badge from "@/src/shared/ui/Badge";
import type { MatchFactor, NextStep } from "./completion";
import { ProfileCompletion } from "./ProfileCompletion";

interface ProfileHeaderProps {
  name: string;
  email: string;
  photoUrl?: string | null;
  completionPct: number;
  isMatchable?: boolean;
  nextStep?: NextStep;
  matchFactors?: MatchFactor[];
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Green-50 band with the avatar overlapping its bottom edge; identity on the left and
 * completion on the right (stacked below on mobile).
 */
export function ProfileHeader({
  name,
  email,
  photoUrl,
  completionPct,
  isMatchable,
  nextStep,
  matchFactors,
}: ProfileHeaderProps) {
  return (
    <header className="overflow-visible rounded-lg border border-neutral-100 bg-white">
      <div className="h-14 rounded-t-lg bg-primary-50" aria-hidden="true" />

      <div className="flex flex-col gap-4 px-4 pb-4 md:flex-row md:items-end md:justify-between md:px-5 md:pb-5">
        <div className="flex min-w-0 items-end gap-4">
          <div className="relative -mt-8 size-16 shrink-0">
            <div className="h-full w-full overflow-hidden rounded-full bg-primary-50 ring-4 ring-white">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-h3 text-primary-800" aria-hidden="true">
                  {initials(name) || "?"}
                </span>
              )}
            </div>
            {/* TODO: wire photo upload once the API has an endpoint for it (only profilePhotoUrl exists). */}
            <button
              type="button"
              disabled
              aria-label="Change photo (not available yet)"
              title="Photo upload isn't available yet"
              // after: widens the hit area to 44px without making the icon bigger.
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-neutral-100 bg-white text-neutral-600 after:absolute after:-inset-2 after:content-[''] hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed"
            >
              <Camera size={14} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          <div className="min-w-0 pt-3">
            <h1 className="truncate text-h1 text-neutral-900">{name}</h1>
            <p className="truncate text-small text-neutral-600">{email}</p>
            {isMatchable !== undefined && (
              <Badge tone={isMatchable ? "teal" : "amber"} className="mt-2">
                {isMatchable ? "Eligible for matching" : "Not yet eligible for matching"}
              </Badge>
            )}
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4 md:border-t-0 md:pt-0">
          <ProfileCompletion percent={completionPct} nextStep={nextStep} factors={matchFactors} />
        </div>
      </div>
    </header>
  );
}
