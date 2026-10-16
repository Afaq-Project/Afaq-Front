import { IS_PREMIUM, PERIOD_END, SUBSCRIPTION } from "@/src/feature/billing/mocks/subscription";
import type { Notification } from "../types/notification";

/** ISO date-time `hours` before now. */
function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

/**
 * TODO: there's no notifications endpoint yet (nor mark-as-read or dismiss calls). These match the
 * application, opportunity and document mocks, so every action lands on a real page.
 */
const ENTRIES: Notification[] = [
  // The 1-day reminder. Titles show the days left now, not when the reminder was sent.
  {
    id: "n-deadline-9",
    type: "deadline",
    createdAt: hoursAgo(2),
    read: false,
    applicationId: "9",
    opportunityId: "o13",
    missingDocuments: ["a research proposal", "2 recommendation letters"],
  },
  {
    id: "n-doc-2",
    type: "document_needed",
    createdAt: hoursAgo(5),
    read: false,
    applicationId: "2",
    opportunityId: "o5",
    documentType: "recommendation",
  },
  {
    id: "n-review-7",
    type: "review_ready",
    createdAt: hoursAgo(27),
    read: false,
    documentId: "doc-7",
    documentName: "Personal Statement - Draft 2",
    suggestionCount: 4,
  },
  // The 7-day reminder, sent two days ago.
  {
    id: "n-deadline-3",
    type: "deadline",
    createdAt: hoursAgo(48),
    read: true,
    applicationId: "3",
    opportunityId: "o2",
    missingDocuments: ["a CV", "a portfolio", "a cover letter"],
  },
  {
    id: "n-matches",
    type: "new_matches",
    createdAt: hoursAgo(74),
    read: true,
    count: 3,
  },
  {
    id: "n-doc-3",
    type: "document_needed",
    createdAt: hoursAgo(220),
    read: true,
    applicationId: "3",
    opportunityId: "o2",
    documentType: "cv",
  },
];

/** A payment-issue notification only exists while the subscription mock says a renewal failed. */
export const NOTIFICATIONS: Notification[] =
  IS_PREMIUM && SUBSCRIPTION.paymentFailed
    ? [{ id: "n-payment", type: "payment_issue", createdAt: hoursAgo(1), read: false, premiumUntil: PERIOD_END }, ...ENTRIES]
    : ENTRIES;
