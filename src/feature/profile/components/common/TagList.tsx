import type { ReactNode } from "react";

/** Read-only tags, or a muted message when there are none. */
export function TagList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-neutral-400">{emptyText}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-900"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">{children}</p>;
}
