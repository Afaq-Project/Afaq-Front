"use client";

import React, { useState } from "react";

export interface TagItem {
  key: string;
  label: string;
  onRemove?: () => void;
}

interface CollapsibleTagListProps {
  items: TagItem[];
  /** How many tags to show before collapsing. Default: 3 */
  defaultVisible?: number;
  emptyMessage?: string;
  /** Tailwind classes for each tag pill. Defaults to primary-container style. */
  tagClassName?: string;
  className?: string;
}

export function CollapsibleTagList({
  items,
  defaultVisible = 3,
  emptyMessage,
  tagClassName = "bg-primary-container text-on-primary-container",
  className = "",
}: CollapsibleTagListProps) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) {
    return emptyMessage ? (
      <span className="text-sm text-on-surface-variant/60 italic pl-1">{emptyMessage}</span>
    ) : null;
  }

  const visible = expanded ? items : items.slice(0, defaultVisible);
  const hiddenCount = items.length - defaultVisible;

  return (
    <div className={`flex flex-wrap gap-2 items-center ${className}`}>
      {visible.map((item) => (
        <div
          key={item.key}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm-subtle ${tagClassName}`}
        >
          <span>{item.label}</span>
          {item.onRemove && (
            <button
              type="button"
              onClick={item.onRemove}
              aria-label={`Remove ${item.label}`}
              className="hover:opacity-75 flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      ))}

      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
        >
          +{hiddenCount}
        </button>
      )}
    </div>
  );
}
