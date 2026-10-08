export interface Promo {
  eyebrow: string;
  title: string;
  ctaLabel: string;
}

/** The free-workshop promo that used to sit in the top bar; pages show promos in their own content area now. */
export const WORKSHOP_PROMO: Promo = {
  eyebrow: "Free workshop",
  title: "Preparing your scholarship application",
  ctaLabel: "Learn more",
};
