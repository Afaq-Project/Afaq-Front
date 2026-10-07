"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Renders the trigger; spread `triggerProps` onto the button that opens the popover. */
  trigger: (triggerProps: {
    "aria-expanded": boolean;
    "aria-controls": string;
    onClick: () => void;
  }) => ReactNode;
  /** Accessible name of the panel. */
  label: string;
  children: ReactNode;
}

/**
 * A floating panel anchored below its trigger (shadow-sm, radius-lg). Closes on outside
 * click and Escape, returning focus to the page.
 */
export function Popover({ open, onOpenChange, trigger, label, children }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  useClickOutside(ref, () => onOpenChange(false));

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  return (
    <div ref={ref} className="relative">
      {trigger({ "aria-expanded": open, "aria-controls": panelId, onClick: () => onOpenChange(!open) })}
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute right-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-neutral-100 bg-white p-4 shadow-sm"
        >
          {children}
        </div>
      )}
    </div>
  );
}
