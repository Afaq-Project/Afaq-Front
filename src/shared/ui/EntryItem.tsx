import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EntryItemProps {
  icon: LucideIcon;
  title: string;
  /** Next to the title, e.g. a status badge. */
  titleAddon?: ReactNode;
  /** Lines under the title (institution, dates…). */
  children?: ReactNode;
  /** Right-aligned key figure, e.g. a GPA. */
  metric?: ReactNode;
  /** Secondary label/value details shown below. */
  details?: ReactNode;
  /** Controls such as an "Edit" button. */
  actions?: ReactNode;
}

/** A list entry: 40px icon tile, title with meta lines, an optional trailing metric and details. */
export function EntryItem({ icon: Icon, title, titleAddon, children, metric, details, actions }: EntryItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-800">
        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-h3 text-neutral-900">{title}</h4>
              {titleAddon}
            </div>
            {children && <div className="mt-1 flex flex-col gap-0.5">{children}</div>}
          </div>
          <div className="flex items-start gap-3">
            {metric}
            {actions}
          </div>
        </div>
        {details && <div className="mt-3">{details}</div>}
      </div>
    </div>
  );
}
