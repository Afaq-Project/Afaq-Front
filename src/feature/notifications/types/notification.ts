import type { DocumentTypeKey } from "@/src/shared/lib/document-types";

/** Everything Afaq notifies about. Status changes aren't here: the user sets statuses themselves. */
export type NotificationType = "deadline" | "document_needed" | "review_ready" | "new_matches" | "payment_issue";

interface BaseNotification {
  id: string;
  /** ISO date-time the notification was created. */
  createdAt: string;
  read: boolean;
}

/** Sent 14, 7, 3 and 1 day(s) before a tracked application's deadline (FR-5.6). */
export interface DeadlineNotification extends BaseNotification {
  type: "deadline";
  applicationId: string;
  opportunityId: string;
  /** Documents still missing, as phrases ("a research proposal"); omitted when unknown. */
  missingDocuments?: string[];
}

export interface DocumentNeededNotification extends BaseNotification {
  type: "document_needed";
  applicationId: string;
  opportunityId: string;
  documentType: DocumentTypeKey;
}

export interface ReviewReadyNotification extends BaseNotification {
  type: "review_ready";
  documentId: string;
  documentName: string;
  suggestionCount: number;
}

export interface NewMatchesNotification extends BaseNotification {
  type: "new_matches";
  count: number;
}

export interface PaymentIssueNotification extends BaseNotification {
  type: "payment_issue";
  /** ISO date (YYYY-MM-DD) Premium lasts until before moving to Free (BR-9). */
  premiumUntil: string;
}

export type Notification =
  | DeadlineNotification
  | DocumentNeededNotification
  | ReviewReadyNotification
  | NewMatchesNotification
  | PaymentIssueNotification;
