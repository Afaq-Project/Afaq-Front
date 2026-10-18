import type { ReactNode } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";

interface SectionHeaderProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  intro?: ReactNode;
  align?: "start" | "center";
  /** Id for the h2, so the section can point aria-labelledby at it. */
  titleId?: string;
  className?: string;
  /** Overrides for the intro paragraph, e.g. a narrower max width. */
  introClassName?: string;
}

/** Eyebrow, h2 title and intro, with a 32px (mobile) / 40px gap before the section content. */
export function SectionHeader({ title, eyebrow, intro, align = "start", titleId, className, introClassName }: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <header className={cn("flex flex-col gap-3 mb-8 md:mb-10", centered ? "items-center text-center" : "items-start text-start", className)}>
      {eyebrow && <p className="font-medium text-landing-small text-primary-800">{eyebrow}</p>}
      <h2 id={titleId} className="text-landing-h2 text-neutral-900">
        {title}
      </h2>
      {intro && <p className={cn("max-w-[60ch] text-landing-body-lg text-neutral-600", introClassName)}>{intro}</p>}
    </header>
  );
}
