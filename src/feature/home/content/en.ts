/**
 * All landing page copy. Components import `content` from here and never hardcode text, so a
 * translation can later be added as a second file with the same shape (LandingContent).
 *
 * Copy rules: short, warm, honest. Verb-first buttons, "Log in" / "Sign up", no em dashes,
 * no social proof, no promised outcomes, scholarships only.
 */

import type { ApplicationStatusKey } from "@/src/shared/lib/status-colors";

/** Plural forms by Intl.PluralRules category; `{count}` is replaced with the number. */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string;
};

/** A point in a feature section's list; `chips` are optional small tags under the description. */
export type FeaturePoint = { title: string; description: string; chips?: string[] };

/** A row in the tracking preview: a deadline (`daysLeft`) or, once submitted, a `note`. */
export type TrackingRow = {
  title: string;
  country: string;
  countryCode: string;
  status: ApplicationStatusKey;
  daysLeft?: number;
  note?: string;
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

  /** Trust row: eyebrow only (rendered as the section's h2), then four reasons. Icons are set in the component, in this order. */
  trust: {
    eyebrow: "What you can count on",
    items: [
      { title: "Refreshed every day", description: "New scholarships are gathered daily from trusted sources." },
      { title: "Reviewed before it's live", description: "Our team checks every listing before you see it." },
      { title: "No duplicate listings", description: "One scholarship, one listing, even when it appears on several sites." },
      {
        title: "AI that admits when it isn't sure",
        description: "If eligibility details aren't reliable, it says so and links the official source.",
      },
    ],
  },

  /** How it works: four steps. Icons are set in the component, in this order. */
  howItWorks: {
    eyebrow: "How it works",
    title: "From your profile to your result, step by step",
    intro: "Afaq stays with you through the whole journey. You always apply on each scholarship's official website.",
    /** Visual label above each step; `{number}` is replaced. Hidden from screen readers (the list conveys order). */
    stepLabel: "Step {number}",
    steps: [
      {
        title: "Create your profile",
        description:
          "Start with your education level, field of study, and nationality. Add GPA, skills, languages, and experience whenever you like.",
      },
      {
        title: "Get your matches",
        description:
          "See only the scholarships you're eligible for, ranked by how well they fit, with a clear reason for every match.",
      },
      {
        title: "Prepare with AI",
        description: "Ask about requirements and get honest feedback on your essays and personal statements.",
      },
      {
        title: "Track and apply",
        description: "Apply on the official site, then track your status and get reminders before every deadline.",
      },
    ],
    cta: "Create your free profile",
  },

  /** Feature sections share one layout: header, three points, and a preview built from real components. */
  matching: {
    eyebrow: "How matching works",
    title: "A match score you can actually understand",
    intro:
      "Afaq filters out scholarships you aren't eligible for, then ranks the rest. Every match shows exactly why it fits, and where it doesn't quite.",
    points: [
      {
        title: "Eligibility comes first",
        description: "Scholarships you can't apply for, because of nationality or study level, never clutter your list.",
      },
      {
        title: "Five factors, clearly weighted",
        description: "Field of study, skills, GPA, languages, and experience each count for a set share of your score.",
      },
      {
        title: "Honest about gaps",
        description: "When something doesn't quite fit, you see it, along with a tip on what to do about it.",
      },
    ] as FeaturePoint[],
    /** Static example match. Fictional scholarship. */
    preview: {
      label: "Example match: Water Management Scholarship, 89% strong match, with the score broken down by factor and one possible gap.",
      countryCode: "nl",
      title: "Water Management Scholarship",
      meta: "Master's · Netherlands",
      percent: 89,
      eligibility: ["Nationality eligible", "Master's level"],
      breakdownTitle: "How your score adds up",
      factors: [
        { label: "Field of study", value: "Environmental engineering", score: 30, max: 30 },
        { label: "Skills and interests", value: "GIS, data analysis", score: 22, max: 25 },
        { label: "GPA", value: "3.7 out of 4.0", score: 18, max: 20 },
        { label: "Languages", value: "English C1", score: 15, max: 15 },
        { label: "Experience", value: "6 months, 1 year preferred", score: 4, max: 10 },
      ],
      gapNote: "Possible gap: they prefer 1 year of experience. Mention your project work in your personal statement.",
      legend: { strong: "Strong match 70%+", possible: "Possible match 40–69%" },
    },
  },

  aiGuidance: {
    eyebrow: "AI guidance",
    title: "Help preparing, with honest answers",
    intro:
      "Ask about a specific scholarship's requirements and get thoughtful feedback on your essays and personal statements. It helps you prepare. It can't promise a result.",
    points: [
      { title: "Grounded in your profile", description: "Answers use your profile and the scholarship's details, not generic advice." },
      {
        title: "Says when it isn't sure",
        description: "If eligibility information isn't reliable, it tells you and points to the official source.",
      },
      {
        title: "Feedback on your essays",
        description: "Get strengths, weaknesses, and suggestions you can work through before you submit.",
      },
    ] as FeaturePoint[],
    /** Static example conversation and essay feedback. Fictional scholarship. */
    preview: {
      label: "Example AI conversation about the Commonwealth Leaders Scholarship, where the assistant answers from your profile and says when it isn't sure, with a note that essay feedback is ready: 2 strengths, 1 weakness, and 3 suggestions.",
      chat: {
        countryCode: "gb",
        title: "Commonwealth Leaders Scholarship",
        context: "Answers use your profile and this scholarship's details",
        messages: [
          { from: "user", text: "I graduated in 2024. Can I still apply?" },
          {
            from: "ai",
            text: "Yes. This scholarship accepts graduates within two years of finishing their degree, and your profile shows 2024. It also asks for a short motivation statement.",
          },
          { from: "user", text: "What's the language requirement?" },
          {
            from: "ai",
            text: "I don't have reliable language information for this year, so I won't guess. Please check the official page before you apply.",
            sourceLink: "Open official source",
          },
        ] as { from: "user" | "ai"; text: string; sourceLink?: string }[],
        disclaimer: "AI guidance can be wrong and doesn't guarantee outcomes.",
      },
      /** Small summary card overlapping the chat card. */
      essay: {
        title: "Essay feedback ready",
        meta: "Personal statement · v2",
        strengths: "2 strengths",
        weaknesses: "1 weakness",
        suggestions: "3 suggestions",
      },
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
