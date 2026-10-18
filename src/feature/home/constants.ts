import type { LandingContent } from "./content/en";

export type SectionTone = "white" | "offwhite" | "green";

interface SectionSlot {
  /** Anchor id; also what nav links point to. */
  id: string;
  tone: SectionTone;
  /** Key of the section's copy in the content file. */
  contentKey: keyof LandingContent["sections"];
}

/** Every landing section, in render order. Tones alternate so adjacent sections never match. */
export const SECTION_SLOTS: SectionSlot[] = [
  { id: "hero", tone: "white", contentKey: "hero" },
  { id: "trust", tone: "offwhite", contentKey: "trust" },
  { id: "how-it-works", tone: "white", contentKey: "howItWorks" },
  { id: "matching", tone: "offwhite", contentKey: "matching" },
  { id: "ai-guidance", tone: "white", contentKey: "aiGuidance" },
  { id: "tracking", tone: "offwhite", contentKey: "tracking" },
  { id: "scholarships", tone: "white", contentKey: "scholarships" },
  { id: "who-its-for", tone: "offwhite", contentKey: "whoItsFor" },
  { id: "pricing", tone: "white", contentKey: "pricing" },
  { id: "faq", tone: "offwhite", contentKey: "faq" },
  { id: "get-started", tone: "white", contentKey: "getStarted" },
];

/** Where the landing page's account actions go (the app's own auth pages). */
export const APP_LOGIN_URL = "/login";
export const APP_SIGNUP_URL = "/register";

/** Support contact and legal pages, linked from the FAQ and the footer. TODO: confirm the real address and URLs. */
export const SUPPORT_EMAIL = "support@afaq.app";
export const PRIVACY_URL = "/privacy";
export const TERMS_URL = "/terms";

/** Social profiles shown in the footer. Only the ones set here are rendered; none set renders nothing. */
export const SOCIAL_LINKS: { linkedin?: string; instagram?: string } = {
  // linkedin: "https://www.linkedin.com/company/...",
  // instagram: "https://www.instagram.com/...",
};

/** id of the mobile menu panel (the menu button's aria-controls). */
export const MENU_PANEL_ID = "landing-menu";
