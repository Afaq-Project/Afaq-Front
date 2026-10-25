/** The app's languages; Arabic is the default. */
export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ar";

/** Holds the chosen language. The profile API has nowhere to keep it yet, so it lives only here. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_DIR: Record<Locale, "rtl" | "ltr"> = { ar: "rtl", en: "ltr" };

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale);
