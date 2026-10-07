import { X } from "lucide-react";
import { Skeleton } from "./Skeleton";

export interface ChipItem {
  key: string;
  label: string;
}

interface ChipListProps {
  items: ChipItem[];
  /** Remove buttons only appear in edit mode. */
  editable?: boolean;
  onRemove?: (key: string) => void;
  /** Shown when there are no items. */
  emptyText?: string;
  /** Shows placeholder pills while the labels load. */
  loading?: boolean;
}

/** Outlined pills (white, 1px neutral-200 border, radius-full, caption); removable in edit mode. */
export function ChipList({ items, editable = false, onRemove, emptyText, loading = false }: ChipListProps) {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {/* One placeholder per item, capped so long lists don't flash a wall of pills. */}
        {Array.from({ length: Math.min(Math.max(items.length, 1), 4) }, (_, i) => (
          <Skeleton key={i} className="h-6 w-24 rounded-full" />
        ))}
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (items.length === 0) {
    return emptyText ? <p className="text-small text-neutral-600">{emptyText}</p> : null;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item.key}
          className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white py-1 pl-3 pr-3 text-caption text-neutral-800 has-[button]:pr-1"
        >
          {item.label}
          {editable && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.key)}
              aria-label={`Remove ${item.label}`}
              // 44px tap target on touch screens without making the pill taller.
              className="-my-3 flex size-11 items-center justify-center rounded-full text-neutral-600 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 md:my-0 md:size-6"
            >
              <X size={14} strokeWidth={1.75} aria-hidden="true" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
