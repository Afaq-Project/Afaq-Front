import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface LabeledGroupProps {
  label: string;
  /** 16px outline icon before the label. */
  icon?: LucideIcon;
  /** Shown in the label when there are 3 or more items: "Target fields of study · 4". */
  count?: number;
  children: ReactNode;
}

/** A caption-labeled group inside a card, e.g. "Target degrees" above its chips. */
export function LabeledGroup({ label, icon: Icon, count, children }: LabeledGroupProps) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-1.5 text-caption text-neutral-600">
        {Icon && <Icon size={16} strokeWidth={1.75} aria-hidden="true" />}
        {label}
        {count !== undefined && count >= 3 && <span>· {count}</span>}
      </h4>
      {children}
    </div>
  );
}
