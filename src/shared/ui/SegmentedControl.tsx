"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

/**
 * A row of mutually exclusive options, announced as a radiogroup. Only the selected option is in
 * the tab order; arrow keys move the selection, as with native radio buttons.
 */
export function SegmentedControl<T extends string>({ label, value, options, onChange, className }: SegmentedControlProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent, index: number) {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex gap-1 bg-neutral-50 p-1 border border-neutral-100 rounded-md", className)}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "inline-flex flex-1 md:flex-none justify-center items-center gap-2 px-4 rounded-sm min-h-11 md:min-h-9 text-small transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
              selected ? "bg-white shadow-sm font-medium text-neutral-900" : "text-neutral-600 hover:text-neutral-900",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
