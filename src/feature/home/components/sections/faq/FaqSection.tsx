import { SUPPORT_EMAIL, type SectionTone } from "../../../constants";
import { content } from "../../../content/en";
import { Section } from "../../layout/Section";
import { SectionHeader } from "../../layout/SectionHeader";
import { FaqAccordion } from "./FaqAccordion";

const TITLE_ID = "faq-title";

/** FAQPage structured data from the same copy as the visible list. "<" is escaped so the JSON can't close the script tag. */
function faqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * FAQ: from 1024px the header (1fr) stays sticky at the inline-start, below the sticky nav, while
 * the accordion (2fr) scrolls beside it; one column below that.
 */
export function FaqSection({ id, tone }: { id: string; tone: SectionTone }) {
  const { faq } = content;

  return (
    <Section id={id} tone={tone} aria-labelledby={TITLE_ID}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd() }} />

      <div className="items-start gap-8 md:gap-10 lg:gap-16 grid lg:grid-cols-[1fr_2fr]">
        <div className="lg:top-[calc(var(--landing-header-height)+2rem)] lg:sticky">
          <SectionHeader
            titleId={TITLE_ID}
            eyebrow={faq.eyebrow}
            title={faq.title}
            className="mb-0 md:mb-0"
            intro={
              <>
                {faq.intro}{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="rounded-sm font-medium text-primary-800 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2"
                >
                  {faq.contact}
                </a>
              </>
            }
          />
        </div>
        <FaqAccordion items={faq.items} />
      </div>
    </Section>
  );
}
