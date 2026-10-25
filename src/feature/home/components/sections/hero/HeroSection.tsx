import { ArrowRight } from "lucide-react";
import { HorizonLines } from "@/src/shared/ui/HorizonLines";
import { APP_SIGNUP_URL, type SectionTone } from "../../../constants";
import { useLandingContent } from "../../../content";
import { Section } from "../../layout/Section";
import { Button } from "../../ui/Button";
import { SectionLinkButton } from "../../ui/SectionLinkButton";
import { HeroMatchCard } from "./HeroMatchCard";
import { HeroPhoto } from "./HeroPhoto";
import { HeroPlane } from "./HeroPlane";
import { HeroScrollLink } from "./HeroScrollLink";
import { HeroReminder } from "./HeroReminder";

const TITLE_ID = "hero-title";
const RISE = "animate-landing-rise motion-reduce:animate-none";

/**
 * Hero: the page's H1, subtitle, sign-up and "how it works" buttons, and a photo with two
 * decorative example cards. The header overlaps it, so the top padding adds the header height.
 * Below 1280px the plane above the headline sets how small the padding can be (~12px clear of
 * the header); from 1280px the photo is taller than the text and the match card sets it (~28px).
 *
 * Layout and card placement:
 *  - From 1024px: text | photo (1fr / 1.1fr with a 48px gap; 1fr / 1.25fr with 64px from 1280px,
 *    where the wider ratio no longer pushes the headline to 5 lines). The match card overlaps the photo's top/inline-start corner, the
 *    reminder stack its bottom/inline-end corner (16px past the photo's inline-end edge, 28px from
 *    1440px, where the 1280px container leaves margin beside it).
 *  - 768–1023px: text | a stack of two match cards (static, vertically centered) on the first
 *    row, filling the space beside the text: the main card shifted 16px toward the inline-end,
 *    a second example in front of it (covering the main card below its meta row), 16px toward the
 *    inline-start. The photo spans
 *    both columns below, with the reminder half-overlapping its bottom/inline-end corner.
 *  - Below 768px: one column; no match card, the reminder sits below the photo.
 * The match card is rendered twice (tablet copy and desktop copy), each shown at its own sizes;
 * both are decorative and aria-hidden.
 */
export function HeroSection({ id, tone }: { id: string; tone: SectionTone }) {
  const content = useLandingContent();
  const { hero } = content;

  return (
    <Section
      id={id}
      tone={tone}
      aria-labelledby={TITLE_ID}
      className="relative isolate pt-[calc(var(--landing-header-height)+4rem)] md:pt-[calc(var(--landing-header-height)+5.25rem)] lg:pt-[calc(var(--landing-header-height)+5.5rem)] xl:pt-[calc(var(--landing-header-height)+3.5rem)] md:pb-12 lg:pb-22 overflow-hidden"
    >
      {/*
        * Horizon lines along the bottom edge of the section, full width, behind everything
        * (-z-10 inside the section's isolated stacking context). From 768px the scroll link sits
        * on them, 48px (tablet) / 88px (desktop) above the bottom edge; the gap above it clears the
        * reminder stack and keeps the lines at least 16px below the buttons (larger at 1024–1279px,
        * where the headline takes 4 lines).
        */}
      <HorizonLines variant="arc" className="-z-10 bottom-0 absolute inset-x-0" />

      <div className="items-center gap-10 lg:gap-12 xl:gap-16 grid md:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[1fr_1.1fr] xl:grid-cols-[1fr_1.25fr]">
        <div className={`relative ${RISE}`}>
          {/* Sits in the top padding above the headline; its lower edge overlaps the headline's top leading. */}
          <HeroPlane className="absolute start-0 bottom-[calc(100%-0.75rem)] lg:bottom-[calc(100%-1rem)] w-75 md:w-[min(100%,25rem)] lg:w-[min(100%,30rem)]" />
          <h1 id={TITLE_ID} className="max-w-[20ch] text-landing-display text-neutral-900 text-balance">
            {hero.title.before}
            {/* Rounded, slightly slanted lime underline just below the word (isolate keeps the -z-10 bar inside this span). */}
            <span className="isolate relative after:-z-10 after:absolute after:inset-x-0 after:bottom-[-0.14em] after:bg-highlight after:rounded-full after:h-[0.16em] after:-skew-x-12 whitespace-nowrap">
              {hero.title.highlight}
            </span>
            {hero.title.after}
          </h1>
          <p className="mt-5 max-w-[46ch] text-landing-body-lg text-neutral-600">{hero.subtitle}</p>
          <div className="flex min-[480px]:flex-row flex-col flex-wrap gap-3 mt-8">
            <Button href={APP_SIGNUP_URL} variant="primary" trailingIcon={ArrowRight} className="w-full min-[480px]:w-auto">
              {hero.primaryCta}
            </Button>
            <SectionLinkButton targetId="how-it-works" variant="secondary" className="w-full min-[480px]:w-auto">
              {hero.secondaryCta}
            </SectionLinkButton>
          </div>
        </div>

        <div aria-hidden="true" className="hidden md:flex lg:hidden flex-col">
          <HeroMatchCard className={`ms-4 [animation-delay:150ms] ${RISE}`} />
          <HeroMatchCard card={hero.matchCardSecondary} className={`z-10 relative -mt-20 me-4 [animation-delay:250ms] ${RISE}`} />
        </div>

        <div className="relative md:col-span-2 lg:col-span-1">
          <HeroPhoto />
          <HeroMatchCard
            className={`hidden lg:flex absolute z-10 [inset-block-start:-28px] -start-9 [animation-delay:150ms] ${RISE}`}
          />
          <HeroReminder
            className={`relative z-10 -mt-7 ms-auto w-full max-w-75 md:absolute md:mt-0 md:w-72 md:max-w-none md:[inset-block-end:-16px] md:-end-3.5 lg:[inset-block-end:-32px] lg:-end-4 2xl:-end-7 [animation-delay:300ms] ${RISE}`}
          />
        </div>
      </div>

      <div className="hidden md:flex justify-center mt-12 lg:mt-10 xl:mt-5">
        <HeroScrollLink />
      </div>
    </Section>
  );
}
