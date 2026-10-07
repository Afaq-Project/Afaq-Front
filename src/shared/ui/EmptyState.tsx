import type { ReactNode } from "react";

interface EmptyStateProps {
  /** An invitation, not an apology: "Add your first skill to improve your matches." */
  message: string;
  /** The verb-first call to action (usually a secondary Button or a Link). */
  action?: ReactNode;
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-neutral-200 p-4">
      <p className="text-body text-neutral-600">{message}</p>
      {action}
    </div>
  );
}
