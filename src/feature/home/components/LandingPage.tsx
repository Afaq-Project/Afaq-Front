import { SECTION_SLOTS } from "../constants";
import { content } from "../content/en";
import { LandingRoot } from "./LandingRoot";
import { LandingFooter } from "./layout/LandingFooter";
import { LandingHeader } from "./layout/LandingHeader";
import { Section } from "./layout/Section";
import { SectionPlaceholder } from "./layout/SectionPlaceholder";

/** The public landing page: header, every section slot in order, footer. */
export function LandingPage() {
  return (
    <LandingRoot>
      <a
        href="#main"
        className="top-3 z-50 fixed bg-white shadow-sm px-4 py-2 rounded-md font-medium text-landing-small text-primary-800 -translate-y-24 focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2 start-3"
      >
        {content.skipLink}
      </a>

      <LandingHeader />

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none scroll-mt-(--landing-header-height)">
        {SECTION_SLOTS.map(({ id, tone, contentKey }) => {
          const { name } = content.sections[contentKey];
          return (
            <Section key={id} id={id} tone={tone} aria-label={name}>
              <SectionPlaceholder name={name} anchor={id} />
            </Section>
          );
        })}
      </main>

      <LandingFooter />
    </LandingRoot>
  );
}
