import { Check, Circle } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { PASSWORD_RULES } from "@/src/shared/lib/validation/auth-schemas";
import { useTranslations } from "next-intl";

/**
 * Live password rules under a new-password field: each turns green with a check once met.
 * Point the input's aria-describedby at `id`. Icon + "(met)" text, so color is never the only signal.
 */
export function PasswordChecklist({ id, password }: { id: string; password: string }) {
  const t = useTranslations("passwordRules");

  return (
    <ul id={id} aria-label={t("label")} className="flex flex-wrap gap-x-4 gap-y-1">
      {PASSWORD_RULES.map(({ key, test }) => {
        const met = test(password);
        const Icon = met ? Check : Circle;
        return (
          <li
            key={key}
            className={cn("flex items-center gap-1.5 text-caption", met ? "text-primary-800" : "text-neutral-600")}
          >
            <Icon size={met ? 14 : 12} strokeWidth={met ? 2.25 : 1.75} aria-hidden="true" />
            {t(key)}
            {met && <span className="sr-only">{t("met")}</span>}
          </li>
        );
      })}
    </ul>
  );
}
