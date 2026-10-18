import { Check, Circle } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { PASSWORD_RULES } from "@/src/shared/lib/validation/auth-schemas";

/**
 * Live password rules under a new-password field: each turns green with a check once met.
 * Point the input's aria-describedby at `id`. Icon + "(met)" text, so color is never the only signal.
 */
export function PasswordChecklist({ id, password }: { id: string; password: string }) {
  return (
    <ul id={id} aria-label="Password must have" className="flex flex-wrap gap-x-4 gap-y-1">
      {PASSWORD_RULES.map(({ label, test }) => {
        const met = test(password);
        const Icon = met ? Check : Circle;
        return (
          <li
            key={label}
            className={cn("flex items-center gap-1.5 text-caption", met ? "text-primary-800" : "text-neutral-600")}
          >
            <Icon size={met ? 14 : 12} strokeWidth={met ? 2.25 : 1.75} aria-hidden="true" />
            {label}
            {met && <span className="sr-only">(met)</span>}
          </li>
        );
      })}
    </ul>
  );
}
