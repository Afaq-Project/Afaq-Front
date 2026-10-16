import { Clock, CreditCard, FileText, Sparkles, Target, type LucideIcon } from "lucide-react";
import { getOpportunityById } from "@/src/feature/opportunities/services/utils";
import { countryName } from "@/src/shared/lib/countries";
import { reviewPath } from "@/src/feature/documents/services/reviewStore";
import { formatDeadlineDay, getDeadlineUrgency } from "@/src/shared/lib/deadline";
import type { DocumentTypeKey } from "@/src/shared/lib/document-types";
import type { Notification } from "../types/notification";

/** "a recommendation letter": the noun used in "{Opportunity} needs …". */
const DOCUMENT_PHRASES: Record<DocumentTypeKey, string> = {
  cv: "a CV",
  transcript: "a transcript",
  degree: "a degree certificate",
  recommendation: "a recommendation letter",
  essay: "a personal statement",
  id: "a passport or ID copy",
  language: "a language certificate",
  other: "a document",
};

/** "a, b and c". */
function joinList(items: string[]) {
  return items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function endsIn(days: number) {
  if (days === 0) return "ends today";
  if (days === 1) return "ends tomorrow";
  return `ends in ${days} days`;
}

export interface NotificationView {
  title: string;
  body: string;
  icon: LucideIcon;
  /** Deadline within 2 days: red icon tile. */
  urgent: boolean;
  action: { label: string; href: string };
  /** The opportunity the title starts with, for its flag. */
  flag?: { countryCode?: string; countryName?: string; remote: boolean };
}

function flagFor(opportunityId: string) {
  const opportunity = getOpportunityById(opportunityId);
  if (!opportunity) return { opportunity: undefined, flag: undefined };
  const flag = {
    countryCode: opportunity.countryCode,
    countryName: opportunity.countryCode ? countryName(opportunity.countryCode) : undefined,
    remote: Boolean(opportunity.isRemote) || !opportunity.countryCode,
  };
  return { opportunity, flag };
}

/**
 * Title, body, icon and main action for a notification, or null when it no longer applies
 * (its opportunity is gone or the deadline has passed).
 */
export function describe(notification: Notification): NotificationView | null {
  switch (notification.type) {
    case "deadline": {
      const { opportunity, flag } = flagFor(notification.opportunityId);
      if (!opportunity || opportunity.daysLeft < 0) return null;
      const missing = notification.missingDocuments ?? [];
      return {
        title: `${opportunity.title} ${endsIn(opportunity.daysLeft)}`,
        body: missing.length ? `You still need ${joinList(missing)}.` : "Make sure everything is ready before the deadline.",
        icon: Clock,
        urgent: getDeadlineUrgency(opportunity.daysLeft) === "urgent",
        action: { label: "Open application", href: `/applications/${notification.applicationId}` },
        flag,
      };
    }
    case "document_needed": {
      const { opportunity, flag } = flagFor(notification.opportunityId);
      if (!opportunity) return null;
      const params = new URLSearchParams({ upload: notification.documentType, application: notification.applicationId });
      return {
        title: `${opportunity.title} needs ${DOCUMENT_PHRASES[notification.documentType]}`,
        body: "Upload it once and reuse it for other applications.",
        icon: FileText,
        urgent: false,
        action: { label: "Upload document", href: `/documents?${params}` },
        flag,
      };
    }
    case "review_ready": {
      const count = notification.suggestionCount;
      return {
        title: "Your essay review is ready",
        body: `Feedback on ${notification.documentName}: ${count} ${count === 1 ? "suggestion" : "suggestions"}.`,
        icon: Sparkles,
        urgent: false,
        action: { label: "View review", href: reviewPath(notification.documentId) },
      };
    }
    case "new_matches":
      return {
        title: `${notification.count} new strong ${notification.count === 1 ? "match" : "matches"} this week`,
        body: "Based on your profile.",
        icon: Target,
        urgent: false,
        action: { label: "View matches", href: "/discover?quick=strong" },
      };
    case "payment_issue":
      return {
        title: "Your last payment didn't go through",
        body: `You'll keep Premium until ${formatDeadlineDay(notification.premiumUntil)}.`,
        icon: CreditCard,
        urgent: false,
        action: { label: "Update payment", href: "/billing" },
      };
  }
}

export type TimeGroup = "Today" | "Yesterday" | "Earlier this week" | "Earlier";

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Calendar buckets in local time; the week starts on Sunday. */
export function timeGroup(iso: string, now: Date): TimeGroup {
  const day = startOfDay(new Date(iso)).getTime();
  const today = startOfDay(now);
  if (day >= today.getTime()) return "Today";
  if (day >= today.getTime() - 86_400_000) return "Yesterday";
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  return day >= weekStart.getTime() ? "Earlier this week" : "Earlier";
}

/** Consecutive notifications in the same bucket; expects newest first. */
export function groupByTime<T extends { notification: Notification }>(items: T[], now: Date) {
  const groups: { label: TimeGroup; items: T[] }[] = [];
  for (const item of items) {
    const label = timeGroup(item.notification.createdAt, now);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

/** "Just now", "12 min ago", "3 hours ago", "Yesterday", "4 days ago", then "Oct 3". */
export function relativeTime(iso: string, now: Date) {
  const date = new Date(iso);
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const days = Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000);
  if (days === 0) {
    const hours = Math.floor(minutes / 60);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
