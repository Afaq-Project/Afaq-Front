import { CircleHelp, Layers, RefreshCw, ShieldCheck } from "lucide-react";
import type { SectionTone } from "../../../constants";
import { useLandingContent } from "../../../content";
import { Section } from "../../layout/Section";
import { Reveal } from "../../ui/Reveal";

const TITLE_ID = "trust-title";
/** One icon per item in content.trust.items, same order. */
const ICONS = [RefreshCw, ShieldCheck, Layers, CircleHelp];

/**
 * Trust row: four specific reasons to trust Afaq, no numbers or logos. Compact padding (40px,
 * 48px from 768px). Items: 1 column with the icon beside the text, 2 columns from 640px and 4
 * from 1024px with the icon above, divided by 1px rules on the inline-start side.
 */
export function TrustSection({ id, tone }: { id: string; tone: SectionTone }) {
  const content = useLandingContent();
  const { trust } = content;

  return (
    <Section id={id} tone={tone} aria-labelledby={TITLE_ID} className="py-10 md:py-12 lg:py-12">
      {/* The eyebrow is the section's heading, styled small. */}
      <h2 id={TITLE_ID} className="mb-6 font-medium text-landing-small text-primary-800">
        {trust.eyebrow}
      </h2>

      <ul className="gap-6 lg:gap-8 grid sm:grid-cols-2 lg:grid-cols-4">
        {trust.items.map((item, index) => {
          const Icon = ICONS[index];
          return (
            <Reveal
              as="li"
              key={item.title}
              delay={index * 80}
              className="flex sm:flex-col gap-4 sm:gap-3 lg:[&:not(:first-child)]:ps-8 lg:[&:not(:first-child)]:border-s lg:border-neutral-100"
            >
              <span className="inline-flex justify-center items-center bg-primary-50 rounded-md size-9 text-primary-800 shrink-0">
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-landing-body text-neutral-900">{item.title}</h3>
                <p className="max-w-[32ch] text-landing-small text-neutral-600">{item.description}</p>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
