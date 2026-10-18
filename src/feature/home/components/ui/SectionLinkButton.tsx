"use client";

import type { MouseEvent } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { scrollToSection } from "../../lib/scrollToSection";
import { Button, type LandingButtonProps } from "./Button";

/**
 * Trailing icons by name. Server components can't pass icon components (functions) to this
 * client component, so they pass a name instead. arrowDown isn't directional along the line, so
 * it never flips in right-to-left layouts.
 */
const ICONS = {
  arrowDown: { icon: ArrowDown, flipIconInRtl: false },
  arrowRight: { icon: ArrowRight, flipIconInRtl: true },
};

type SectionLinkButtonProps = Omit<
  Extract<LandingButtonProps, { href: string }>,
  "href" | "onClick" | "trailingIcon" | "flipIconInRtl"
> & {
  /** id of the section to jump to. */
  targetId: string;
  trailingIcon?: keyof typeof ICONS;
};

/**
 * A Button linking to an in-page section. Scrolls there (smoothly unless reduced motion, and
 * clear of the sticky header via scroll-margin-top), then moves focus to the section's
 * heading so keyboard and screen reader users continue from there.
 */
export function SectionLinkButton({ targetId, trailingIcon, ...props }: SectionLinkButtonProps) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (scrollToSection(targetId)) event.preventDefault();
  }

  const icon = trailingIcon ? ICONS[trailingIcon] : undefined;
  return (
    <Button
      {...props}
      href={`#${targetId}`}
      onClick={onClick}
      trailingIcon={icon?.icon}
      flipIconInRtl={icon?.flipIconInRtl}
    />
  );
}
