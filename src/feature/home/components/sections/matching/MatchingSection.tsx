import { Check, Lightbulb } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { SectionTone } from "../../../constants";
import { useLocale } from "next-intl";
import { intlLocale } from "@/src/i18n/format";
import { useLandingContent } from "../../../content";
import { Card } from "../../ui/Card";
import { Chip } from "../../ui/Chip";
import { FlagTile } from "../../ui/FlagTile";
import { FeatureSection } from "../feature/FeatureSection";

/** Factors scoring under half their share are a possible gap: amber instead of green. */
const isGap = (score: number, max: number) => score / max < 0.5;

/**
 * Matching preview: an example match card (max 520px) with eligibility chips, the five-factor
 * score breakdown and a possible-gap tip. From 1280px a small legend card overlaps its bottom
 * corner at the inline-start side (16px, over the bottom padding only).
 */
function MatchingPreview() {
  const content = useLandingContent();
  const preview = content.matching.preview;
  const locale = useLocale();
  const { factorScore, match } = content.common;
  const percent = new Intl.NumberFormat(intlLocale(locale), { style: "percent" }).format(preview.percent / 100);

  return (
    <>
      <Card floating className="flex flex-col gap-5 p-5 sm:p-6 lg:p-6">
        <div className="flex items-start gap-3">
          <FlagTile code={preview.countryCode} className="mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-landing-body text-neutral-900">{preview.title}</h3>
            <p className="text-landing-small text-neutral-600">{preview.meta}</p>
          </div>
          <div className="flex flex-col items-end text-success-800 shrink-0">
            <span className="font-semibold text-[30px] leading-9">{percent}</span>
            <span className="font-medium text-landing-caption">{match.strong}</span>
          </div>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {preview.eligibility.map((item) => (
            <li key={item}>
              <Chip tone="green">
                <Check size={12} strokeWidth={2.25} className="shrink-0" />
                {item}
              </Chip>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3.5">
          <p className="font-medium text-landing-caption text-neutral-600">{preview.breakdownTitle}</p>
          {preview.factors.map((factor) => (
            <div key={factor.label} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap justify-between items-baseline gap-x-3 text-landing-small">
                <span className="font-medium text-neutral-900">{factor.label}</span>
                <span className="text-neutral-600">
                  {factor.value} · {factorScore.replace("{score}", String(factor.score)).replace("{max}", String(factor.max))}
                </span>
              </div>
              <div className="bg-neutral-50 rounded-full h-2 overflow-hidden">
                <div
                  className={cn("rounded-full h-full", isGap(factor.score, factor.max) ? "bg-warning-600" : "bg-primary-600")}
                  style={{ width: `${(factor.score / factor.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="flex gap-2 bg-warning-50 p-3 rounded-md text-landing-small text-warning-800">
          <Lightbulb size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          {preview.gapNote}
        </p>
      </Card>

      {/* Only its top 16px overlaps the card, over the card's bottom padding, so no text is covered. */}
      <Card floating className="hidden xl:flex top-[calc(100%-1rem)] absolute flex-col items-start gap-2 p-3 lg:p-3 -start-12">
        <Chip tone="teal">{preview.legend.strong}</Chip>
        <Chip tone="amber">{preview.legend.possible}</Chip>
      </Card>
    </>
  );
}

/** Section 5: how matching works, text at the inline-start and the example match at the inline-end. */
export function MatchingSection({ id, tone }: { id: string; tone: SectionTone }) {
  const content = useLandingContent();
  const { matching } = content;
  return (
    <FeatureSection
      id={id}
      tone={tone}
      eyebrow={matching.eyebrow}
      title={matching.title}
      intro={matching.intro}
      points={matching.points}
      preview={<MatchingPreview />}
      previewLabel={matching.preview.label}
      previewClassName="max-w-130"
    />
  );
}
