import { CalendarDays, Clock, type LucideIcon } from "lucide-react";

export type DeadlineUrgency = "urgent" | "soon" | "later";

/** Deadline tiers: ≤2 days is urgent (red), 3–7 days is soon (bold neutral + clock), anything later is plain neutral. */
export function getDeadlineUrgency(daysLeft: number): DeadlineUrgency {
  if (daysLeft <= 2) return "urgent";
  if (daysLeft <= 7) return "soon";
  return "later";
}

/** Color and weight for a deadline label, e.g. the deadline line on an opportunity card. */
export const DEADLINE_URGENCY_TEXT: Record<DeadlineUrgency, string> = {
  urgent: "font-medium text-danger-800",
  soon: "font-semibold text-neutral-900",
  later: "text-neutral-600",
};

/** Icon beside a deadline label: a clock once it's within the week. */
export const DEADLINE_URGENCY_ICON: Record<DeadlineUrgency, LucideIcon> = {
  urgent: Clock,
  soon: Clock,
  later: CalendarDays,
};

/** Timeline dot for a deadline: red within 2 days, near-black within the week, hollow after. */
export const DEADLINE_URGENCY_DOT: Record<DeadlineUrgency, string> = {
  urgent: "bg-danger-600",
  soon: "bg-neutral-900",
  later: "border-[1.5px] border-neutral-400 bg-white",
};

/** Whole days from `now` to an ISO date (YYYY-MM-DD), comparing local calendar days. Negative once passed. */
export function daysUntil(isoDate: string, now: Date) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const deadline = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((deadline.getTime() - today.getTime()) / 86_400_000);
}

/** "Tue, Oct 20, 2026" for an ISO date (YYYY-MM-DD), read as a local calendar day. */
export function formatDeadlineDay(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
