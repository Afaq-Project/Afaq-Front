"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { useLandingContent } from "../../../content";
import { scrollToSection } from "../../../lib/scrollToSection";

const TARGET_ID = "scholarships";

/**
 * "Browse open scholarships" pill, centered at the bottom of the hero (768px and up). Opaque white
 * so the horizon lines never cross the text; the arrow sits in a 32px circle at the inline-end.
 * The arrow bounces 4px inside the circle, starting 1s after load and stopping for good as soon
 * as the page scrolls; never with reduced motion. Hover and focus tint the pill (green-50 at 40%,
 * mixed with white so it stays opaque) and fill the circle green.
 */
export function HeroScrollLink({ className }: { className?: string }) {
  const content = useLandingContent();
  const [bouncing, setBouncing] = useState(true);

  useEffect(() => {
    const stop = () => setBouncing(false);
    window.addEventListener("scroll", stop, { once: true, passive: true });
    return () => window.removeEventListener("scroll", stop);
  }, []);

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (scrollToSection(TARGET_ID)) event.preventDefault();
  }

  return (
    <a
      href={`#${TARGET_ID}`}
      onClick={onClick}
      className={cn(
        "group z-10 relative inline-flex items-center gap-2.5 bg-white py-2 ps-4.5 pe-2 border border-primary-200 rounded-full",
        "transition-colors duration-150 motion-reduce:transition-none",
        "hover:border-primary-400 focus-visible:border-primary-400",
        "hover:bg-[color-mix(in_srgb,var(--color-primary-50)_40%,white)] focus-visible:bg-[color-mix(in_srgb,var(--color-primary-50)_40%,white)]",
        "focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2",
        className,
      )}
    >
      <span className="font-medium text-landing-body text-primary-800">{content.hero.scrollLink}</span>
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex justify-center items-center bg-primary-50 rounded-full size-8 text-primary-800 shrink-0",
          "transition-colors duration-150 motion-reduce:transition-none",
          "group-hover:bg-primary-600 group-hover:text-white group-focus-visible:bg-primary-600 group-focus-visible:text-white",
        )}
      >
        <ArrowDown size={18} strokeWidth={1.75} className={cn(bouncing && "motion-safe:animate-landing-bounce")} />
      </span>
    </a>
  );
}
