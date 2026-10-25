"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/src/feature/dashboard/services/utils";
import { setLocale } from "@/src/i18n/actions";
import { LOCALE_DIR, type Locale } from "@/src/i18n/config";

// Each language names itself, so it's findable whatever the current one is.
const OTHER: Record<Locale, { locale: Locale; name: string }> = {
  ar: { locale: "en", name: "English" },
  en: { locale: "ar", name: "العربية" },
};

/**
 * Switches to the other language, for pages without Settings (sign-in and sign-up). Saves the
 * choice and refreshes, so the whole page renders in it.
 */
export function LanguageToggle({
  className,
  labelClassName,
}: {
  className?: string;
  /** E.g. "max-sm:sr-only" to show only the globe on phones; the name stays the accessible label. */
  labelClassName?: string;
}) {
  const router = useRouter();
  const target = OTHER[useLocale()];
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      lang={target.locale}
      dir={LOCALE_DIR[target.locale]}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await setLocale(target.locale);
          router.refresh();
        })
      }
      className={cn(
        "inline-flex items-center gap-1.5 px-2 rounded-sm min-h-11 md:min-h-9 font-medium text-neutral-600 text-small hover:text-neutral-900 transition-colors disabled:cursor-wait",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
        className,
      )}
    >
      <Globe size={16} strokeWidth={1.75} aria-hidden="true" />
      <span className={labelClassName}>{target.name}</span>
    </button>
  );
}
