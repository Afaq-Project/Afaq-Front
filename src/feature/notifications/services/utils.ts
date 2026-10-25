import { Clock, CreditCard, FileText, Sparkles, Target, type LucideIcon } from "lucide-react";
import type { useTranslations } from "next-intl";
import { getMockOpportunityById } from "@/src/feature/opportunities/services/utils";
import { countryName } from "@/src/shared/lib/countries";
import { reviewPath } from "@/src/feature/documents/services/reviewStore";
import { formatDeadlineDay, getDeadlineUrgency } from "@/src/shared/lib/deadline";
import type { useDeadlineText } from "@/src/shared/lib/useDeadlineText";
import { intlLocale } from "@/src/i18n/format";
import type { Notification } from "../types/notification";

/** The notifications messages, as useTranslations("notifications") returns them. */
export type NotificationText = ReturnType<typeof useTranslations<"notifications">>;

/** "a, b and c" in the app's language. */
const joinList = (items: string[], locale: string) =>
  new Intl.ListFormat(intlLocale(locale), { style: "long", type: "conjunction" }).format(items);

/** Deadline wording, as useDeadlineText() returns it. */
type DeadlineText = ReturnType<typeof useDeadlineText>;

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

function flagFor(opportunityId: string, locale: string) {
  const opportunity = getMockOpportunityById(opportunityId);
  if (!opportunity) return { opportunity: undefined, flag: undefined };
  const flag = {
    countryCode: opportunity.countryCode,
    countryName: opportunity.countryCode ? countryName(opportunity.countryCode, locale) : undefined,
    remote: Boolean(opportunity.isRemote) || !opportunity.countryCode,
  };
  return { opportunity, flag };
}

/**
 * Title, body, icon and main action for a notification, or null when it no longer applies
 * (its opportunity is gone or the deadline has passed). Text comes in the app's language.
 */
export function describe(
  notification: Notification,
  t: NotificationText,
  locale: string,
  deadline: DeadlineText,
): NotificationView | null {
  switch (notification.type) {
    case "deadline": {
      const { opportunity, flag } = flagFor(notification.opportunityId, locale);
      if (!opportunity || opportunity.daysLeft < 0) return null;
      const missing = notification.missingDocuments ?? [];
      return {
        title: t("deadline.title", { title: opportunity.title, endsIn: deadline.endsInInline(opportunity.daysLeft) }),
        body: missing.length ? t("deadline.missing", { list: joinList(missing, locale) }) : t("deadline.ready"),
        icon: Clock,
        urgent: getDeadlineUrgency(opportunity.daysLeft) === "urgent",
        action: { label: t("deadline.action"), href: `/applications/${notification.applicationId}` },
        flag,
      };
    }
    case "document_needed": {
      const { opportunity, flag } = flagFor(notification.opportunityId, locale);
      if (!opportunity) return null;
      const params = new URLSearchParams({ upload: notification.documentType, application: notification.applicationId });
      return {
        title: t("documentNeeded.title", {
          title: opportunity.title,
          document: t(`documentPhrases.${notification.documentType}`),
        }),
        body: t("documentNeeded.body"),
        icon: FileText,
        urgent: false,
        action: { label: t("documentNeeded.action"), href: `/documents?${params}` },
        flag,
      };
    }
    case "review_ready":
      return {
        title: t("reviewReady.title"),
        body: t("reviewReady.body", { name: notification.documentName, count: notification.suggestionCount }),
        icon: Sparkles,
        urgent: false,
        action: { label: t("reviewReady.action"), href: reviewPath(notification.documentId) },
      };
    case "new_matches":
      return {
        title: t("newMatches.title", { count: notification.count }),
        body: t("newMatches.body"),
        icon: Target,
        urgent: false,
        action: { label: t("newMatches.action"), href: "/discover?quick=strong" },
      };
    case "payment_issue":
      return {
        title: t("payment.title"),
        body: t("payment.body", { date: formatDeadlineDay(notification.premiumUntil, locale) }),
        icon: CreditCard,
        urgent: false,
        action: { label: t("payment.action"), href: "/billing" },
      };
  }
}

/** Which bucket a notification falls in; its label is notifications.groups.<group>. */
export type TimeGroup = "today" | "yesterday" | "thisWeek" | "earlier";

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Calendar buckets in local time; the week starts on Sunday. */
export function timeGroup(iso: string, now: Date): TimeGroup {
  const day = startOfDay(new Date(iso)).getTime();
  const today = startOfDay(now);
  if (day >= today.getTime()) return "today";
  if (day >= today.getTime() - 86_400_000) return "yesterday";
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  return day >= weekStart.getTime() ? "thisWeek" : "earlier";
}

/** Consecutive notifications in the same bucket; expects newest first. */
export function groupByTime<T extends { notification: Notification }>(items: T[], now: Date) {
  const groups: { group: TimeGroup; items: T[] }[] = [];
  for (const item of items) {
    const group = timeGroup(item.notification.createdAt, now);
    const last = groups[groups.length - 1];
    if (last?.group === group) last.items.push(item);
    else groups.push({ group, items: [item] });
  }
  return groups;
}

/** "Just now", "12 min ago", "3 hours ago", "Yesterday", "4 days ago", then "Oct 3", in the app's language. */
export function relativeTime(iso: string, now: Date, t: NotificationText, locale: string) {
  const date = new Date(iso);
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return t("time.justNow");
  if (minutes < 60) return t("time.minutesAgo", { count: minutes });
  const days = Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000);
  if (days === 0) return t("time.hoursAgo", { count: Math.floor(minutes / 60) });
  if (days === 1) return t("time.yesterday");
  if (days < 7) return t("time.daysAgo", { count: days });
  return date.toLocaleDateString(intlLocale(locale), { month: "short", day: "numeric" });
}
