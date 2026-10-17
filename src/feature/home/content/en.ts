/**
 * All landing page copy. Components import `content` from here and never hardcode text, so a
 * translation can later be added as a second file with the same shape (LandingContent).
 *
 * Copy rules: short, warm, honest. Verb-first buttons, "Log in" / "Sign up", no em dashes,
 * no social proof, no promised outcomes, scholarships only.
 */

/** Plural forms by Intl.PluralRules category; `{count}` is replaced with the number. */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

export const content = {
  meta: {
    title: "Afaq · Find scholarships that fit you",
    description:
      "Afaq gathers scholarships from trusted sources every day, shows the ones you can apply for with a clear match percentage, and helps you prepare and track your applications.",
    siteName: "Afaq",
    ogLocale: "en_US",
  },

  skipLink: "Skip to content",

  nav: {
    label: "Main",
    homeLabel: "Afaq home",
    brand: "Afaq",
    links: [
      { href: "#how-it-works", label: "How it works" },
      { href: "#matching", label: "Matching" },
      { href: "#ai-guidance", label: "AI guidance" },
      { href: "#scholarships", label: "Scholarships" },
      { href: "#pricing", label: "Pricing" },
      { href: "#faq", label: "FAQ" },
    ],
    logIn: "Log in",
    signUp: "Sign up",
    menu: {
      title: "Menu",
      open: "Open menu",
      close: "Close menu",
    },
  },

  /** Section names, used as the accessible name of each slot and its placeholder label. */
  sections: {
    hero: { name: "Hero" },
    trust: { name: "Trust row" },
    howItWorks: { name: "How it works" },
    matching: { name: "Matching" },
    aiGuidance: { name: "AI guidance" },
    tracking: { name: "Tracking and reminders" },
    scholarships: { name: "Open scholarships" },
    whoItsFor: { name: "Who it's for" },
    pricing: { name: "Pricing" },
    faq: { name: "FAQ" },
    getStarted: { name: "Final call to action" },
  },

  footer: { name: "Footer" },

  placeholder: {
    note: "Placeholder. This section is built in a later step.",
  },

  common: {
    match: {
      strong: "Strong match",
      possible: "Possible match",
      low: "Low match",
    },
    status: {
      not_started: "Not started",
      in_progress: "In progress",
      submitted: "Submitted",
      in_review: "In review",
      accepted: "Accepted",
      rejected: "Rejected",
    },
    deadline: {
      today: "Ends today",
      tomorrow: "Ends tomorrow",
      inDays: { one: "Ends in {count} day", other: "Ends in {count} days" } as PluralForms,
      closed: "Closed",
    },
    remote: "Remote",
  },
};

export type LandingContent = typeof content;
