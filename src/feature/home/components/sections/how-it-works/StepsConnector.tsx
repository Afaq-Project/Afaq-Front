"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";

/**
 * Dashed line behind the step cards (from 1024px), at the icon tiles' vertical center. One
 * full-width line behind the grid, so only the gaps between cards show it, in either direction.
 * Draws in from the inline-start side over 600ms when it scrolls into view: this wrapper (anchored
 * at inset-inline-start by the caller) grows from 0 to full width and clips a fixed-width line, so
 * the dashes never stretch and the direction follows the writing direction with no RTL override.
 * Already on screen at load, or with reduced motion, it is simply shown.
 */
export function StepsConnector({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none overflow-hidden h-px",
        state !== "static" && "transition-[width] duration-600 ease-out",
        state === "hidden" ? "w-0" : "w-full",
        className,
      )}
    >
      {/* Wider than any grid, so the wrapper's width alone decides how much shows. */}
      <svg className="block w-[1280px] max-w-none h-px overflow-visible">
        <line x1="0" y1="0.5" x2="100%" y2="0.5" className="stroke-primary-200" strokeWidth={1} strokeDasharray="6 6" />
      </svg>
    </div>
  );
}
