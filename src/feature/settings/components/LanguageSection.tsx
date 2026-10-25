"use client";

import { useTransition, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/src/feature/dashboard/services/utils";
import { setLocale } from "@/src/i18n/actions";
import { LOCALE_DIR, LOCALES, type Locale } from "@/src/i18n/config";
import { SettingsRow, SettingsSection } from "./SettingsSection";

// Each language names itself, so it's findable whatever the current one is.
const NATIVE_NAME: Record<Locale, string> = { ar: "العربية", en: "English" };

export function LanguageSection() {
  const t = useTranslations("settings.language");
  const current = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const choose = (locale: Locale) => {
    if (locale === current) return;
    startTransition(async () => {
      await setLocale(locale);
      // Re-renders on the server, so the whole page (including <html dir>) switches.
      router.refresh();
    });
  };

  // Arrow keys move the choice, as in any radio group; the visual order follows the page direction.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const index = LOCALES.indexOf(current);
    const next = LOCALES[(index + 1) % LOCALES.length];
    choose(next);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-locale="${next}"]`)?.focus();
  };

  return (
    <SettingsSection id="language" title={t("title")}>
      <SettingsRow label={t("label")} help={t("help")}>
        <div
          role="radiogroup"
          aria-label={t("title")}
          aria-busy={pending}
          onKeyDown={onKeyDown}
          className="flex gap-1 bg-neutral-50 p-1 border border-neutral-100 rounded-md w-full md:w-auto"
        >
          {LOCALES.map((locale) => {
            const selected = locale === current;
            return (
              <button
                key={locale}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                data-locale={locale}
                lang={locale}
                dir={LOCALE_DIR[locale]}
                disabled={pending}
                onClick={() => choose(locale)}
                className={cn(
                  "flex-1 md:flex-none px-4 rounded-sm min-w-20 min-h-11 md:min-h-9 text-small transition-colors disabled:cursor-wait",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                  selected ? "bg-white shadow-sm font-medium text-neutral-900" : "text-neutral-600 hover:text-neutral-900",
                )}
              >
                {NATIVE_NAME[locale]}
              </button>
            );
          })}
        </div>
      </SettingsRow>
    </SettingsSection>
  );
}
