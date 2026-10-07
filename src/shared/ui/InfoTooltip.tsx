"use client";

import { useId } from "react";
import { Info } from "lucide-react";

/**
 * A small info icon with a tooltip. The tooltip shows on hover and on keyboard focus, and is
 * linked to the button so screen readers announce it.
 */
export function InfoTooltip({ text }: { text: string }) {
  const tooltipId = useId();

  return (
    <span className="group/tip relative inline-flex align-middle">
      <button
        type="button"
        aria-label="More info"
        aria-describedby={tooltipId}
        // 44px tap target on touch screens without changing the layout.
        className="-m-3 inline-flex size-11 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 md:m-0 md:size-5"
      >
        <Info size={14} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <span
        role="tooltip"
        id={tooltipId}
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-sm bg-neutral-900 px-2 py-1 text-caption text-white opacity-0 transition-opacity group-focus-within/tip:opacity-100 group-hover/tip:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
