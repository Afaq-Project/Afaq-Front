"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, File } from "lucide-react";
import { CARD_CLASS } from "@/src/feature/dashboard/components/styles";
import { cn } from "@/src/feature/dashboard/services/utils";
import { getDeadlineUrgency } from "@/src/shared/lib/deadline";
import { documentType, type DocumentTypeKey } from "@/src/shared/lib/document-types";
import { buttonClasses } from "@/src/shared/ui/Button";
import { Popover } from "@/src/shared/ui/Popover";
import type { TrackedApplication } from "../../types/document";

interface MissingGroup {
  key: string;
  type?: DocumentTypeKey;
  label: string;
  applications: TrackedApplication[];
}

/**
 * What active applications still need: each required document type the user has no document of,
 * grouped by type, with where it's needed and the soonest deadline. Requirements with no type
 * can't be matched, so they're listed by name.
 */
function missingDocuments(applications: TrackedApplication[], userTypes: Set<DocumentTypeKey>) {
  const groups = new Map<string, MissingGroup>();
  for (const application of applications) {
    for (const requirement of application.opportunity?.requiredDocuments ?? []) {
      if (requirement.type && userTypes.has(requirement.type)) continue;
      const key = requirement.type ?? `name:${requirement.name}`;
      const group = groups.get(key) ?? {
        key,
        type: requirement.type,
        label: requirement.type ? documentType(requirement.type).label : requirement.name,
        applications: [],
      };
      if (!group.applications.some((a) => a.id === application.id)) group.applications.push(application);
      groups.set(key, group);
    }
  }
  const soonest = (group: MissingGroup) => Math.min(...group.applications.map((a) => a.daysLeft));
  return [...groups.values()].sort((a, b) => soonest(a) - soonest(b));
}

const HOVER_LINK =
  "rounded-sm hover:underline focus-visible:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400";

/** "{n} applications": plain text that underlines on hover and opens the list of applications. */
function NeededFor({ applications }: { applications: TrackedApplication[] }) {
  const [open, setOpen] = useState(false);
  const label = `${applications.length} ${applications.length === 1 ? "application" : "applications"}`;
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label="Applications that need it"
      align="start"
      panelClassName="w-64"
      trigger={(triggerProps) => (
        <button type="button" {...triggerProps} className={cn(HOVER_LINK, "text-neutral-600 hover:text-neutral-900")}>
          {label}
        </button>
      )}
    >
      <ul className="flex flex-col gap-1">
        {applications.map((application) => (
          <li key={application.id}>
            <Link
              href={`/applications/${application.id}`}
              className="block hover:bg-neutral-50 px-2 py-1.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 text-neutral-800 text-small"
            >
              {application.title}
            </Link>
          </li>
        ))}
      </ul>
    </Popover>
  );
}

/** "Ends in {d} days": red within 2 days, near-black with a clock within the week, else muted. */
export function Deadline({ days }: { days: number }) {
  if (days < 0) return <span className="text-neutral-600">Deadline passed</span>;
  const urgency = getDeadlineUrgency(days);
  const text = days === 0 ? "Ends today" : `Ends in ${days} ${days === 1 ? "day" : "days"}`;
  if (urgency === "later") return <span className="text-neutral-600">{text}</span>;
  return (
    <span className={cn("inline-flex items-center gap-1 font-medium", urgency === "urgent" ? "text-danger-800" : "text-neutral-900")}>
      <Clock size={13} strokeWidth={2} aria-hidden="true" />
      {text}
    </span>
  );
}

/**
 * What active applications still need, as a grid of cards (4 / 2 / 1 columns), soonest deadline
 * first. Each says how many applications need it and when the first is due, with an Upload
 * button that preselects the type and those applications. Due within 7 days: an amber top
 * border; within 2 days: red.
 */
export function NeededSection({
  applications,
  userTypes,
  onUpload,
}: {
  applications: TrackedApplication[];
  userTypes: Set<DocumentTypeKey>;
  onUpload: (type: DocumentTypeKey | undefined, applicationIds: string[]) => void;
}) {
  // TODO: applications that aren't linked to an opportunity have no requirement data and are left out.
  const withRequirements = applications.filter((a) => (a.opportunity?.requiredDocuments.length ?? 0) > 0);
  if (withRequirements.length === 0) return null;

  const missing = missingDocuments(withRequirements, userTypes);
  if (missing.length === 0) {
    return (
      <p className={cn(CARD_CLASS, "flex items-center gap-2 text-body text-neutral-800")}>
        <span aria-hidden="true" className="flex justify-center items-center bg-primary-600 rounded-full size-5 text-white">
          <Check size={12} strokeWidth={3} />
        </span>
        You have every document your active applications need.
      </p>
    );
  }

  return (
    <section aria-labelledby="needed-heading" className="flex flex-col gap-4">
      <h2 id="needed-heading" className="flex items-center gap-2 text-h2 text-neutral-900">
        Needed for your applications
        <span className="flex justify-center items-center bg-neutral-100 px-1.5 rounded-full min-w-5 h-5 font-medium text-caption text-neutral-600">
          {missing.length}
        </span>
      </h2>
      <ul className="gap-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {missing.map((group) => {
          const Icon = group.type ? documentType(group.type).icon : File;
          const days = Math.min(...group.applications.map((a) => a.daysLeft));
          const urgency = days < 0 ? null : getDeadlineUrgency(days);
          return (
            <li
              key={group.key}
              className={cn(
                "flex flex-col gap-3 bg-white p-4 border border-neutral-100 rounded-md",
                urgency === "urgent" && "border-t-[3px] border-t-danger-600",
                urgency === "soon" && "border-t-[3px] border-t-warning-400",
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span aria-hidden="true" className="flex justify-center items-center bg-neutral-50 rounded-sm size-8 text-neutral-600 shrink-0">
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <p className="font-medium text-body text-neutral-900 truncate">{group.label}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 text-neutral-600 text-small">
                <NeededFor applications={group.applications} />
                <span aria-hidden="true">·</span>
                <Deadline days={days} />
              </div>
              <button
                type="button"
                onClick={() => onUpload(group.type, group.applications.map((a) => a.id))}
                aria-label={`Upload ${group.label.toLowerCase()}`}
                className={buttonClasses("soft", "mt-auto w-full h-9 md:h-9 text-small")}
              >
                Upload
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
