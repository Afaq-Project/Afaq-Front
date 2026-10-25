import { useLocale } from "next-intl";
import { content as ar } from "./ar";
import { content as en, type LandingContent } from "./en";

export type { FeaturePoint, LandingContent, PluralForms, PricingPlan, TrackingRow } from "./en";

/** The landing copy for a locale; English for anything but Arabic. */
export function landingContentFor(locale: string): LandingContent {
  return locale === "ar" ? ar : en;
}

/** The landing copy in the app's language. Works in server and client components. */
export function useLandingContent(): LandingContent {
  return landingContentFor(useLocale());
}
