import type { ReactNode } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";

/** Clears the sticky top bar (60px) plus breathing room when a section is scrolled to. */
export const SCROLL_MARGIN = "scroll-mt-21";

/**
 * Rows are divided by a line above each one but the first. Explicit borders rather than
 * divide-y, so a dialog rendered between rows doesn't pick up a divider.
 */
const ROW = "py-4 border-t border-neutral-100 first:border-t-0 first:pt-3 last:pb-0";

interface SettingsSectionProps {
  id: string;
  title: string;
  description?: ReactNode;
  className?: string;
  /** SettingsRows (or SettingsBlocks). */
  children: ReactNode;
}

/** One white card on the Settings page: title and description on top, then its rows. `id` is the nav's anchor. */
export function SettingsSection({ id, title, description, className, children }: SettingsSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("bg-white p-5 border border-neutral-100 rounded-lg", SCROLL_MARGIN, className)}
    >
      <div className="flex flex-col gap-1">
        <h2 id={headingId} className="text-h2 text-neutral-900">
          {title}
        </h2>
        {description && <p className="text-neutral-600 text-small">{description}</p>}
      </div>
      <div className="flex flex-col mt-1">{children}</div>
    </section>
  );
}

interface SettingsRowProps {
  /** Anchor for links into the row, e.g. "Set a password first". */
  id?: string;
  label: ReactNode;
  /** ID for the label, so controls in the row can include it in their names. */
  labelId?: string;
  help?: ReactNode;
  /**
   * Full-width content under the row, e.g. an inline form or a confirmation. It brings its own
   * top spacing, so a collapsed form adds none.
   */
  after?: ReactNode;
  children: ReactNode;
}

/**
 * A setting in a section: label and help on the left, the control right-aligned. Below 768px it
 * stacks: label and help, then the control at full width.
 */
export function SettingsRow({ id, label, labelId, help, after, children }: SettingsRowProps) {
  return (
    <div id={id} className={cn(ROW, "flex flex-col", id && SCROLL_MARGIN)}>
      <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-3 md:gap-8">
        <div className="flex flex-col flex-1 gap-1 min-w-0">
          <h3 id={labelId} className="font-medium text-body text-neutral-900">
            {label}
          </h3>
          {help && <div className="flex flex-col gap-1 text-neutral-600 text-small">{help}</div>}
        </div>
        <div className="flex md:flex-row flex-col md:justify-end md:items-center gap-2 w-full md:w-auto shrink-0">
          {children}
        </div>
      </div>
      {after}
    </div>
  );
}

/** Full-width content in a section, e.g. the usage meter: no label column. */
export function SettingsBlock({ children }: { children: ReactNode }) {
  return <div className={ROW}>{children}</div>;
}
