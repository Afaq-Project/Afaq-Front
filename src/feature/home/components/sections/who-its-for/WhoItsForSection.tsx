import { Award, Briefcase, FlaskConical, GraduationCap, Repeat } from "lucide-react";
import type { SectionTone } from "../../../constants";
import { useLandingContent } from "../../../content";
import { Section } from "../../layout/Section";
import { SectionHeader } from "../../layout/SectionHeader";
import { Card } from "../../ui/Card";

const TITLE_ID = "who-its-for-title";
/** One icon per persona in content.whoItsFor.personas, same order. */
const ICONS = [GraduationCap, Award, FlaskConical, Briefcase, Repeat];

/**
 * Who it's for: five personas.
 *  - Below 640px: compact rows (icon beside the text), divided by 1px rules, no card chrome.
 *  - 640–1023px: 2 columns of cards; the 5th spans both, so the grid never ends half empty.
 *  - From 1024px: 5 in a row (16px padding and caption-size descriptions until 1280px).
 */
export function WhoItsForSection({ id, tone }: { id: string; tone: SectionTone }) {
  const content = useLandingContent();
  const { whoItsFor } = content;

  return (
    <Section id={id} tone={tone} aria-labelledby={TITLE_ID}>
      <SectionHeader titleId={TITLE_ID} eyebrow={whoItsFor.eyebrow} title={whoItsFor.title} intro={whoItsFor.intro} />

      <ul className="max-sm:divide-y max-sm:divide-neutral-100 sm:gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-5">
        {whoItsFor.personas.map((persona, index) => {
          const Icon = ICONS[index];
          return (
            <li key={persona.title} className="sm:last:odd:col-span-2 lg:last:odd:col-span-1 py-4 sm:py-0 first:pt-0 last:pb-0">
              <Card className="flex sm:flex-col gap-4 sm:gap-0 max-sm:bg-transparent p-0 sm:p-5 lg:p-4 xl:p-5 max-sm:border-0 h-full">
                <span className="inline-flex justify-center items-center bg-primary-50 rounded-md size-9 text-primary-800 shrink-0">
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="sm:mt-4">
                  <h3 className="font-semibold text-landing-body text-neutral-900">{persona.title}</h3>
                  <p className="mt-1 text-landing-small lg:text-landing-caption xl:text-landing-small text-neutral-600">{persona.description}</p>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
