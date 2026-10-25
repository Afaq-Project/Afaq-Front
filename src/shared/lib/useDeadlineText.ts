import { useTranslations } from "next-intl";

/** Deadline wording in the app's language, with each language's plural forms. */
export function useDeadlineText() {
  const t = useTranslations("deadline");

  return {
    /** "Ends today", "Ends tomorrow", "Ends in 3 days". */
    endsIn: (daysLeft: number) =>
      daysLeft <= 0 ? t("endsToday") : daysLeft === 1 ? t("endsTomorrow") : t("endsIn", { count: daysLeft }),
    /** The same, mid-sentence: "ends today". */
    endsInInline: (daysLeft: number) =>
      daysLeft <= 0
        ? t("endsTodayInline")
        : daysLeft === 1
          ? t("endsTomorrowInline")
          : t("endsInInline", { count: daysLeft }),
    /** "In 5 days". */
    inDays: (days: number) => t("inDays", { count: days }),
    /** "in 5 days", mid-sentence. */
    inDaysInline: (days: number) => t("inDaysInline", { count: days }),
    /** "12 days left", or months from 30 days: "2 months left". */
    timeLeft: (daysLeft: number) =>
      daysLeft < 30 ? t("daysLeft", { count: daysLeft }) : t("monthsLeft", { count: Math.round(daysLeft / 30) }),
  };
}
