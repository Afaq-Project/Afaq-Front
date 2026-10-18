import type { ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { SectionTone } from "../../../constants";
import type { FeaturePoint } from "../../../content/en";
import { Section } from "../../layout/Section";
import { SectionHeader } from "../../layout/SectionHeader";
import { Chip } from "../../ui/Chip";
import { Reveal } from "../../ui/Reveal";

interface FeatureSectionProps {
  id: string;
  tone: SectionTone;
  eyebrow: string;
  title: string;
  intro: string;
  points: FeaturePoint[];
  /** The preview: static example UI built from real components. Hidden from assistive tech. */
  preview: ReactNode;
  /** Short description of the preview, read in place of it (role="img"). */
  previewLabel: string;
  /** From 1024px, show the preview at the inline-start side. The DOM order stays text first. */
  reversed?: boolean;
  /** Classes for the preview's wrapper, e.g. extra room for overlapping cards. */
  previewClassName?: string;
}

/**
 * Shared layout for the feature sections (Matching, AI guidance, Tracking). From 1024px: text
 * (1fr) and preview (1.2fr) side by side, vertically centered, 64px apart; `reversed` swaps them
 * visually with `order`, never in the DOM, so reading order (and the mobile order) is always text
 * then preview. Below 1024px: one column, 40px gap. The preview fades in and rises 12px once.
 */
export function FeatureSection({
  id,
  tone,
  eyebrow,
  title,
  intro,
  points,
  preview,
  previewLabel,
  reversed = false,
  previewClassName,
}: FeatureSectionProps) {
  const titleId = `${id}-title`;

  return (
    <Section id={id} tone={tone} aria-labelledby={titleId}>
      {/* The preview's track is always the 1.2fr one: when reversed, the preview is visually first, so the tracks flip too. */}
      <div className={cn("items-center gap-10 lg:gap-16 grid", reversed ? "lg:grid-cols-[1.2fr_1fr]" : "lg:grid-cols-[1fr_1.2fr]")}>
        <div className={cn("min-w-0", reversed && "lg:order-last")}>
          <SectionHeader titleId={titleId} eyebrow={eyebrow} title={title} intro={intro} introClassName="max-w-[52ch]" />
          <ul className="flex flex-col gap-5">
            {points.map((point) => (
              <li key={point.title} className="flex gap-3">
                <CircleCheck size={20} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 text-primary-600 shrink-0" />
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-landing-body text-neutral-900">{point.title}</h3>
                  <p className="text-landing-small text-neutral-600">{point.description}</p>
                  {point.chips && (
                    <ul className="flex flex-wrap gap-1.5 mt-1.5">
                      {point.chips.map((chip) => (
                        <li key={chip}>
                          <Chip>{chip}</Chip>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Reveal distance="md" className="min-w-0">
          <div role="img" aria-label={previewLabel} className={cn("relative mx-auto w-full", previewClassName)}>
            <div aria-hidden="true" className="pointer-events-none select-none">
              {preview}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
