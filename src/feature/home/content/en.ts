/**
 * All landing page copy. Components import `content` from here and never hardcode text, so a
 * translation can later be added as a second file with the same shape (LandingContent).
 *
 * Copy rules: short, warm, honest. Verb-first buttons, "Log in" / "Sign up", no em dashes,
 * no social proof, no promised outcomes, scholarships only.
 */

/** Plural forms by Intl.PluralRules category; `{count}` is replaced with the number. */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string;
};

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

  hero: {
    /** The page's only H1, in three parts; `highlight` gets the lime underline. */
    title: {
      before: "Find ",
      highlight: "opportunities",
      after: " that fit you and never miss a deadline",
    },
    subtitle:
      "Afaq gathers scholarships from trusted sources every day, shows you the ones you're eligible for, and helps you prepare each application with honest AI guidance.",
    primaryCta: "Create your free profile",
    secondaryCta: "See how it works",
    /** Centered link at the bottom of the hero (768px and up). */
    scrollLink: "Browse open scholarships",
    /** Slideshow photos, in order. */
    photos: [
      { alt: "Three graduates in caps and gowns taking a selfie outside a university building" },
      { alt: "A group of graduates in caps and gowns smiling in front of a university" },
      { alt: "Graduates throwing their caps in the air outside a university building" },
    ],
    /** Decorative example cards. Fictional scholarships. */
    matchCard: {
      countryCode: "de",
      title: "Global Excellence Scholarship",
      meta: "Master's · Germany",
      percent: 92,
      /** Requirements the example profile meets, shown as checked chips. */
      criteria: ["Field of study", "Skills", "GPA", "English C1", "Experience"],
    },
    /** Second example, stacked in front of the first on tablet (768–1023px). Fictional. */
    matchCardSecondary: {
      countryCode: "ca",
      title: "Future Leaders Scholarship",
      meta: "Bachelor's · Canada",
      percent: 64,
      criteria: ["Field of study", "GPA", "English B2"],
    },
    reminder: {
      meta: "Reminder · 2h ago",
      text: "Future Leaders Scholarship ends in",
      deadline: "3 days",
      daysLeft: 3,
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
      inDays: {
        one: "Ends in {count} day",
        other: "Ends in {count} days",
      } as PluralForms,
      closed: "Closed",
    },
    remote: "Remote",
    /** Match factor score; `{score}` and `{max}` are replaced with the numbers. */
    factorScore: "{score} of {max}",
  },
};

export type LandingContent = typeof content;
