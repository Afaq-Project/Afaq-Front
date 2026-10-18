import { Clock } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { getDeadlineUrgency, type DeadlineUrgency } from "@/src/shared/lib/deadline";
import { content, type PluralForms } from "../../content/en";

/** Picks the plural form for `count` and fills in `{count}`. */
function formatPlural(forms: PluralForms, count: number) {
  const template = forms[new Intl.PluralRules("en").select(count)] ?? forms.other;
  return template.replace("{count}", String(count));
}

/** Color and weight per urgency; also used for deadlines written inside a sentence. */
export const DEADLINE_TEXT: Record<DeadlineUrgency, string> = {
  urgent: "font-medium text-danger-800",
  soon: "font-medium text-neutral-900",
  later: "text-neutral-600",
};

/**
 * "Ends today / tomorrow / in N days". Within 2 days it's red; 3–7 days is near-black with a
 * clock; later is plain gray.
 */
export function DeadlineText({ daysLeft, className }: { daysLeft: number; className?: string }) {
  const { deadline } = content.common;
  const urgency = getDeadlineUrgency(daysLeft);

  const label =
    daysLeft < 0
      ? deadline.closed
      : daysLeft === 0
        ? deadline.today
        : daysLeft === 1
          ? deadline.tomorrow
          : formatPlural(deadline.inDays, daysLeft);

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-landing-small", daysLeft < 0 ? DEADLINE_TEXT.later : DEADLINE_TEXT[urgency], className)}>
      {urgency === "soon" && <Clock size={14} strokeWidth={1.75} aria-hidden="true" />}
      {label}
    </span>
  );
}
