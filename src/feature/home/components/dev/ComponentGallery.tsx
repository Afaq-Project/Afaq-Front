import type { ReactNode } from "react";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import type { ApplicationStatusKey } from "@/src/shared/lib/status-colors";
import { HorizonLines } from "@/src/shared/ui/HorizonLines";
import { content } from "../../content/en";
import { Section } from "../layout/Section";
import { SectionHeader } from "../layout/SectionHeader";
import { SectionPlaceholder } from "../layout/SectionPlaceholder";
import { Button, type LandingButtonVariant } from "../ui/Button";
import { Card } from "../ui/Card";
import { Chip, type ChipTone } from "../ui/Chip";
import { DeadlineText } from "../ui/DeadlineText";
import { FlagTile } from "../ui/FlagTile";
import { MatchBadge } from "../ui/MatchBadge";
import { StatusChip } from "../ui/StatusChip";

/*
 * Internal review gallery (/dev/components). Its own labels are
 * developer-facing and stay in English; component copy comes from the content files.
 */

const BUTTON_VARIANTS: LandingButtonVariant[] = ["primary", "secondary", "soft", "ghost"];
const CHIP_TONES: ChipTone[] = ["neutral", "green", "teal", "amber", "blue", "purple", "red"];
const STATUSES: ApplicationStatusKey[] = ["not_started", "in_progress", "submitted", "in_review", "accepted", "rejected"];
const FLAGS = ["jo", "sa", "eg", "de", "gb", "jp", "remote"];
const DEADLINE_DAYS = [0, 1, 2, 5, 14, -1];
const MATCHES = [86, 70, 55, 40, 22];

const COLOR_SCALES: { name: string; swatches: string[] }[] = [
  { name: "Green (primary)", swatches: ["bg-primary-50", "bg-primary-100", "bg-primary-200", "bg-primary-400", "bg-primary-600", "bg-primary-800", "bg-primary-900"] },
  { name: "Neutral", swatches: ["bg-offwhite", "bg-neutral-50", "bg-neutral-100", "bg-neutral-200", "bg-neutral-400", "bg-neutral-600", "bg-neutral-800", "bg-neutral-900"] },
  { name: "Teal (success)", swatches: ["bg-success-50", "bg-success-600", "bg-success-800"] },
  { name: "Amber (warning)", swatches: ["bg-warning-50", "bg-warning-600", "bg-warning-800"] },
  { name: "Blue (info)", swatches: ["bg-info-50", "bg-info-600", "bg-info-800"] },
  { name: "Purple", swatches: ["bg-purple-50", "bg-purple-600", "bg-purple-800"] },
  { name: "Red (danger)", swatches: ["bg-danger-50", "bg-danger-600", "bg-danger-800"] },
];

const TYPE_SCALE = [
  { className: "text-landing-display", name: "Display 48/56 (34/42)" },
  { className: "text-landing-h2", name: "H2 36/44 (28/36)" },
  { className: "text-landing-h3", name: "H3 20/28" },
  { className: "text-landing-body-lg", name: "Body large 18/28" },
  { className: "text-landing-body", name: "Body 16/24" },
  { className: "text-landing-small", name: "Small 14/20" },
  { className: "text-landing-caption", name: "Caption 12/16" },
];

function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-landing-h3">{title}</h3>
      {children}
    </div>
  );
}

export function ComponentGallery() {
  return (
    <main className="flex-1">
      <Section id="tokens" tone="white">
        <SectionHeader eyebrow="Dev" title="Landing components" intro="Shared building blocks for the landing page." />
        <div className="gap-10 grid lg:grid-cols-2">
          <Demo title="Colors">
            <div className="flex flex-col gap-3">
              {COLOR_SCALES.map((scale) => (
                <div key={scale.name} className="flex flex-wrap items-center gap-2">
                  <span className="w-36 text-landing-small text-neutral-600">{scale.name}</span>
                  {scale.swatches.map((swatch) => (
                    <span key={swatch} title={swatch} className={`size-8 rounded-sm border border-neutral-100 ${swatch}`} />
                  ))}
                </div>
              ))}
            </div>
          </Demo>
          <Demo title="Type scale">
            <div className="flex flex-col gap-3">
              {TYPE_SCALE.map((type) => (
                <p key={type.className} className={type.className}>
                  {type.name}
                </p>
              ))}
            </div>
          </Demo>
        </div>
      </Section>

      <Section id="buttons" tone="offwhite">
        <SectionHeader title="Buttons" intro="primary, secondary, soft, ghost. Sizes sm 36px and md 44px. Trailing icons are directional and flip right to left." />
        <div className="flex flex-col gap-4">
          {(["md", "sm"] as const).map((size) => (
            <div key={size} className="flex flex-wrap items-center gap-3">
              {BUTTON_VARIANTS.map((variant) => (
                <Button key={variant} variant={variant} size={size} href="#buttons" trailingIcon={variant === "ghost" ? ChevronRight : ArrowRight}>
                  {content.nav.signUp}
                </Button>
              ))}
              <Button variant="secondary" size={size} disabled>
                {content.nav.logIn}
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section id="cards" tone="white">
        <SectionHeader title="Cards" />
        <div className="gap-4 lg:gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-3">
              <FlagTile code="jo" />
              <MatchBadge percent={86} />
            </div>
            <p className="text-landing-h3">Static card</p>
            <DeadlineText daysLeft={5} />
          </Card>
          <Card floating className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-3">
              <FlagTile code="remote" />
              <StatusChip status="in_review" />
            </div>
            <p className="text-landing-h3">Floating card</p>
            <DeadlineText daysLeft={1} />
          </Card>
          <Card as="article" className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
            <Chip tone="green">
              <Sparkles size={12} strokeWidth={2} aria-hidden="true" />
              {content.sections.aiGuidance.name}
            </Chip>
            <p className="text-landing-h3">Card as article</p>
            <p className="text-neutral-600">{content.placeholder.note}</p>
          </Card>
        </div>
      </Section>

      <Section id="chips" tone="offwhite">
        <SectionHeader title="Chips, badges and deadlines" />
        <div className="gap-10 grid md:grid-cols-2">
          <Demo title="Chip tones">
            <div className="flex flex-wrap gap-2">
              {CHIP_TONES.map((tone) => (
                <Chip key={tone} tone={tone}>
                  {tone}
                </Chip>
              ))}
            </div>
          </Demo>
          <Demo title="Match badge">
            <div className="flex flex-wrap gap-2">
              {MATCHES.map((percent) => (
                <MatchBadge key={percent} percent={percent} />
              ))}
            </div>
          </Demo>
          <Demo title="Status chip">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                <StatusChip key={status} status={status} />
              ))}
            </div>
          </Demo>
          <Demo title="Deadline text">
            <div className="flex flex-col items-start gap-2">
              {DEADLINE_DAYS.map((days) => (
                <DeadlineText key={days} daysLeft={days} />
              ))}
            </div>
          </Demo>
          <Demo title="Flag tile (md 40×30, sm 24×18)">
            <div className="flex flex-col gap-3">
              {(["md", "sm"] as const).map((size) => (
                <div key={size} className="flex flex-wrap items-center gap-2">
                  {FLAGS.map((code) => (
                    <FlagTile key={code} code={code} size={size} label={code} />
                  ))}
                </div>
              ))}
            </div>
          </Demo>
        </div>
      </Section>

      <Section id="headers" tone="white">
        <SectionHeader
          align="center"
          eyebrow={content.sections.howItWorks.name}
          title="Centered section header"
          intro="Eyebrow, title and an intro capped at 60 characters per line, with a 40px gap before the content (32px on mobile)."
        />
        <SectionPlaceholder name={content.sections.howItWorks.name} anchor="how-it-works" />
      </Section>

      <Section id="same-tone" tone="white" aria-label="Same tone sections">
        <SectionHeader title="Same tone, reduced gap" intro="This white section follows another white one, so its top padding drops to 48px." />
      </Section>

      <Section id="horizon" tone="offwhite" className="relative overflow-hidden">
        <HorizonLines className="absolute inset-0 h-full" lineClassName="stroke-primary-200 opacity-40" />
        <div className="relative">
          <SectionHeader title="Horizon lines" intro="Decorative, aria-hidden. Hero and final call to action only." />
        </div>
      </Section>
    </main>
  );
}
