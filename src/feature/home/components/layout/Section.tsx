import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { SectionTone } from "../../constants";
import { Container } from "./Container";

/*
 * Background per tone. The arbitrary variant cuts the top padding to 48px when the previous
 * section has the same tone, so two same-tone sections never stack a doubled gap.
 */
const TONES: Record<SectionTone, string> = {
  white: "bg-white [[data-tone=white]+&]:pt-12",
  offwhite: "bg-offwhite [[data-tone=offwhite]+&]:pt-12",
  green: "bg-primary-50 [[data-tone=green]+&]:pt-12",
};

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  id: string;
  tone?: SectionTone;
  /** Class for the inner Container. */
  containerClassName?: string;
}

/**
 * A full-width landing band with a centered Container. Vertical padding: 48px mobile, 64px
 * tablet, 96px desktop. Anchor jumps stop below the sticky header.
 */
export function Section({ id, tone = "white", className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn(
        "py-12 md:py-16 lg:py-24 scroll-mt-(--landing-header-height)",
        TONES[tone],
        className,
      )}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
