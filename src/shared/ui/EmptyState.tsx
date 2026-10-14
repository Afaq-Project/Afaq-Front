import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** A white, centered card for page-level states (empty, not found, load errors). */
export const STATE_CARD_CLASS =
  "flex flex-col items-center gap-2 bg-white mx-auto px-6 py-12 border border-neutral-100 rounded-lg w-full text-center";

interface EmptyStateProps {
  /** An invitation, not an apology: "Add your first skill to improve your matches." */
  message: string;
  /** The verb-first call to action (usually a secondary Button or a Link). */
  action?: ReactNode;
  /**
   * inline (default): a dashed box inside a card. page: a centered card for an empty page or
   * section, with an optional icon and title.
   */
  variant?: "inline" | "page";
  /** page only. */
  title?: string;
  /** page only: shown in a tile above the title. */
  icon?: LucideIcon;
  /** page only: the title's heading level, so a page without other headings can use h1. */
  titleAs?: "h1" | "h2";
}

export function EmptyState({ message, action, variant = "inline", title, icon: Icon, titleAs: Title = "h2" }: EmptyStateProps) {
  if (variant === "page") {
    return (
      <div className={STATE_CARD_CLASS}>
        {Icon && (
          <span aria-hidden="true" className="flex justify-center items-center bg-neutral-50 mb-2 rounded-md size-12 text-neutral-600">
            <Icon size={22} strokeWidth={1.75} />
          </span>
        )}
        {title && <Title className="text-h2 text-neutral-900">{title}</Title>}
        <p className="max-w-md text-body text-neutral-600">{message}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-neutral-200 p-4">
      <p className="text-body text-neutral-600">{message}</p>
      {action}
    </div>
  );
}
