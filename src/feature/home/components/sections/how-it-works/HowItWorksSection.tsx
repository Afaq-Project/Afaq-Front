import { CalendarCheck, Search, Sparkles, UserRound } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { APP_SIGNUP_URL, type SectionTone } from "../../../constants";
import { content } from "../../../content/en";
import { Section } from "../../layout/Section";
import { SectionHeader } from "../../layout/SectionHeader";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Reveal } from "../../ui/Reveal";
import { StepsConnector } from "./StepsConnector";

const TITLE_ID = "how-it-works-title";
/** One icon per step in content.howItWorks.steps, same order. */
const ICONS = [UserRound, Search, Sparkles, CalendarCheck];

/*
 * Step layout via grid areas, one DOM order (icon, label, title, description):
 *  - below 640px: a timeline row, the icon beside the label, title and description; no card chrome;
 *  - from 640px: a card, icon and label on the top row, title and description below.
 */
const STEP_GRID = cn(
  "grid content-start gap-x-4",
  "grid-cols-[2.5rem_1fr] [grid-template-areas:'icon_label'_'icon_title'_'icon_desc']",
  "sm:grid-cols-[auto_1fr] sm:[grid-template-areas:'icon_label'_'title_title'_'desc_desc']",
);

/**
 * How it works: the journey in four steps, ending with a soft (light green) sign-up button (the hero
 * holds the primary). Cards: 2×2 from 640px, 4 in a row from 1024px with a dashed connector behind them.
 * Below 640px the steps become a vertical timeline joined by dashed segments. The steps are an
 * ordered list, so the visual "Step n" labels are hidden from screen readers. The hero's "See how
 * it works" button lands focus on this section's h2.
 */
export function HowItWorksSection({ id, tone }: { id: string; tone: SectionTone }) {
  const { howItWorks } = content;
  const lastIndex = howItWorks.steps.length - 1;

  return (
    <Section id={id} tone={tone} aria-labelledby={TITLE_ID}>
      <SectionHeader titleId={TITLE_ID} eyebrow={howItWorks.eyebrow} title={howItWorks.title} intro={howItWorks.intro} />

      <ol className="isolate relative flex sm:grid sm:grid-cols-2 lg:grid-cols-4 flex-col gap-8 sm:gap-6">
        {/* Card border (1px) + padding (24px) + half the 40px icon tile = the tiles' vertical center. */}
        <StepsConnector className="hidden lg:block -z-10 absolute start-0 top-[45px]" />

        {howItWorks.steps.map((step, index) => {
          const Icon = ICONS[index];
          return (
            <Reveal as="li" key={step.title} delay={index * 100} distance="md" className="relative">
              {index < lastIndex && (
                // Timeline segment (below 640px): from under this icon tile to the next one.
                <span aria-hidden="true" className="sm:hidden -bottom-6 absolute border-primary-200 border-s border-dashed top-12 start-5" />
              )}
              <Card className={cn(STEP_GRID, "h-full max-sm:p-0 max-sm:border-0 max-sm:bg-transparent sm:p-6 lg:p-6")}>
                <span className="inline-flex justify-center items-center self-start bg-primary-50 rounded-md size-10 text-primary-800 [grid-area:icon]">
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span aria-hidden="true" className="sm:justify-self-end sm:self-center font-medium text-landing-caption text-neutral-600 [grid-area:label]">
                  {howItWorks.stepLabel.replace("{number}", String(index + 1))}
                </span>
                <h3 className="mt-0.5 sm:mt-5 text-landing-h3 text-neutral-900 [grid-area:title]">{step.title}</h3>
                <p className="mt-2 text-landing-small text-neutral-600 [grid-area:desc]">{step.description}</p>
              </Card>
            </Reveal>
          );
        })}
      </ol>

      <div className="flex justify-center mt-10">
        <Button href={APP_SIGNUP_URL} variant="soft">
          {howItWorks.cta}
        </Button>
      </div>
    </Section>
  );
}
