export interface Promo {
  eyebrow: string;
  title: string;
  ctaLabel: string;
  /** Display date, e.g. "Oct 22, 2026". */
  date?: string;
  /** Display time, e.g. "6:00 PM". */
  time?: string;
  href?: string;
}

/** The free-workshop promo that used to sit in the top bar; pages show promos in their own content area now. */
export const WORKSHOP_PROMO: Promo = {
  eyebrow: "Free workshop",
  title: "Preparing your scholarship application",
  ctaLabel: "Learn more",
  // TODO: placeholders until the workshop has a real date, time and page.
  date: "Oct 22, 2026",
  time: "6:00 PM",
  href: "#",
};
