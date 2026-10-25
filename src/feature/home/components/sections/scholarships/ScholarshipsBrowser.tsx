"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { APP_SIGNUP_URL } from "../../../constants";
import { useLandingContent } from "../../../content";
import type { Funding, PublicScholarship } from "../../../data/scholarships";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Chip, type ChipTone } from "../../ui/Chip";
import { DeadlineText } from "../../ui/DeadlineText";
import { FlagTile } from "../../ui/FlagTile";
import { Reveal } from "../../ui/Reveal";

export type ScholarshipItem = PublicScholarship & { daysLeft: number };
type Tab = "all" | Funding;

const TABS: Tab[] = ["all", "full", "partial"];
const VISIBLE = 6;
const FADE_MS = 150;

/** One public scholarship. Not a link itself: only "Official site" and "See your match" are interactive. */
function ScholarshipCard({ item }: { item: ScholarshipItem }) {
  const content = useLandingContent();
  const copy = content.openScholarships;
  const chips: { label: string; tone: ChipTone }[] = [
    ...(item.funding ? [{ label: copy.funding[item.funding], tone: item.funding === "full" ? ("green" as const) : ("neutral" as const) }] : []),
    ...(item.level ? [{ label: content.common.levels[item.level], tone: "neutral" as const }] : []),
    ...(item.isRemote ? [{ label: content.common.remote, tone: "neutral" as const }] : []),
  ];
  const location = item.location ?? (item.isRemote ? content.common.remote : undefined);

  return (
    <Card className="flex flex-col p-5 lg:p-5 h-full hover:border-neutral-200 transition-colors">
      <div className="flex items-center gap-3">
        <FlagTile code={item.isRemote ? "remote" : item.countryCode} />
        <div className="min-w-0">
          {item.provider && <p className="font-medium text-landing-small text-neutral-800">{item.provider}</p>}
          {location && <p className="text-landing-caption text-neutral-600">{location}</p>}
        </div>
      </div>

      <h3 className="mt-3 font-semibold text-[18px] text-neutral-900 leading-6.5 line-clamp-2">{item.title}</h3>

      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mt-3">
          {chips.slice(0, 3).map((chip) => (
            <li key={chip.label}>
              <Chip tone={chip.tone}>{chip.label}</Chip>
            </li>
          ))}
        </ul>
      )}

      {/* Listings from the API have no description yet; the margin keeps the footer clear of the title. */}
      {item.description ? (
        <p className="mt-3 mb-4 text-landing-small text-neutral-600 line-clamp-2">{item.description}</p>
      ) : (
        <div className="mb-4" />
      )}

      <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-2 mt-auto pt-4 border-neutral-100 border-t">
        <DeadlineText daysLeft={item.daysLeft} />
        <div className="flex items-center gap-2 ms-auto">
          {item.officialUrl && (
            <Button href={item.officialUrl} target="_blank" rel="noopener noreferrer" variant="ghost" size="sm" trailingIcon={ExternalLink} className="px-2.5">
              {copy.officialSite}
              <span className="sr-only">{copy.opensInNewTab}</span>
            </Button>
          )}
          <Button href={APP_SIGNUP_URL} variant="soft" size="sm">
            {copy.seeMatch}
          </Button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Header with the funding filter, the grid of the 6 soonest-closing scholarships for the chosen
 * tab, and the closing call to action.
 *  - Filter: a radio group ("All", "Fully funded", "Partially funded"); tabs with no items are
 *    hidden. Arrow keys move between options and select them, mirrored in right-to-left layouts.
 *    At the inline-end of the title row from 768px, under the intro below that.
 *  - Grid: 3 / 2 / 1 columns at 1024 / 640px, equal-height cards; with two columns an odd last
 *    card spans both, so a row is never half empty. Switching tabs crossfades it (150ms); cards
 *    also fade in, 60ms apart, when first scrolled to. No motion with reduced motion.
 */
export function ScholarshipsBrowser({ items, titleId }: { items: ScholarshipItem[]; titleId: string }) {
  const content = useLandingContent();
  const copy = content.openScholarships;
  const tabs = TABS.filter((tab) => tab === "all" || items.some((item) => item.funding === tab));
  const [tab, setTab] = useState<Tab>("all");
  const [shownTab, setShownTab] = useState<Tab>("all");
  const [fading, setFading] = useState(false);
  const fadeTimer = useRef<number | undefined>(undefined);
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});

  const shown = items.filter((item) => shownTab === "all" || item.funding === shownTab).slice(0, VISIBLE);

  function select(next: Tab) {
    if (next === tab) return;
    setTab(next);
    window.clearTimeout(fadeTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShownTab(next);
      return;
    }
    setFading(true);
    fadeTimer.current = window.setTimeout(() => {
      setShownTab(next);
      setFading(false);
    }, FADE_MS);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = event.key === "ArrowDown" || event.key === (rtl ? "ArrowLeft" : "ArrowRight");
    const back = event.key === "ArrowUp" || event.key === (rtl ? "ArrowRight" : "ArrowLeft");
    if (!forward && !back) return;
    event.preventDefault();
    const index = tabs.indexOf(tab);
    const next = tabs[(index + (forward ? 1 : -1) + tabs.length) % tabs.length];
    select(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <>
      <header className="items-baseline gap-x-6 gap-y-3 grid md:grid-cols-[1fr_auto] mb-8 md:mb-10 md:[grid-template-areas:'eyebrow_.'_'title_tabs'_'intro_.']">
        <p className="font-medium text-landing-small text-primary-800 md:[grid-area:eyebrow]">{copy.eyebrow}</p>
        <h2 id={titleId} className="text-landing-h2 text-neutral-900 md:[grid-area:title]">
          {copy.title}
        </h2>
        <p className="max-w-[60ch] text-landing-body-lg text-neutral-600 md:[grid-area:intro]">{copy.intro}</p>

        {/* Only when there's something to choose: live listings have no funding data yet. */}
        {tabs.length > 1 && (
          <div
            role="radiogroup"
            aria-label={copy.tabsLabel}
            onKeyDown={onKeyDown}
            className="inline-flex justify-self-start gap-1 bg-offwhite mt-2 md:mt-0 p-1 border border-neutral-100 rounded-md md:[grid-area:tabs]"
          >
            {tabs.map((option) => {
              const selected = option === tab;
              return (
                <button
                  key={option}
                  ref={(element) => {
                    tabRefs.current[option] = element;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(option)}
                  className={cn(
                    "px-3 border rounded-sm h-9 font-medium text-landing-small whitespace-nowrap transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2",
                    selected ? "bg-white border-neutral-100 text-neutral-900" : "border-transparent text-neutral-600 hover:text-neutral-900",
                  )}
                >
                  {copy.tabs[option]}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <div className={cn("transition-opacity duration-150 motion-reduce:transition-none", fading && "opacity-0")}>
        {shown.length === 0 ? (
          <p className="py-10 text-landing-body text-neutral-600 text-center">{copy.empty}</p>
        ) : (
          <ul className="gap-5 grid sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((item, index) => (
              <Reveal
                as="li"
                key={item.id}
                delay={index * 60}
                className="sm:max-lg:[&:last-child:nth-child(odd)]:col-span-2"
              >
                <ScholarshipCard item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 mt-8 text-center">
        <Button href={APP_SIGNUP_URL} variant="primary">
          {copy.cta}
        </Button>
        <p className="text-landing-caption text-neutral-600">{copy.ctaNote}</p>
      </div>
    </>
  );
}
