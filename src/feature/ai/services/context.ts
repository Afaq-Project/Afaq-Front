import { useTranslations } from "next-intl";
import { getApplicationDetail } from "@/src/feature/applications/services/utils";
import { getMockOpportunityById } from "@/src/feature/opportunities/services/utils";
import { reviewPath } from "@/src/feature/documents/services/reviewStore";
import type { Conversation } from "../types/chat";

export interface ChatContext {
  kind: "opportunity" | "application" | "document" | "general";
  /** Groups chats in the list: the opportunity or application id, or "general". */
  key: string;
  title: string;
  provider?: string;
  countryCode?: string;
  isRemote?: boolean;
  matchScore?: number;
  /** ISO date (YYYY-MM-DD). */
  deadlineDate?: string;
  href?: string;
  linkLabel?: string;
}

/** The context words in the app's language (useContextLabels). */
export interface ContextLabels {
  general: string;
  yourDocument: string;
  aiReview: string;
  openReview: string;
  viewApplication: string;
  viewOpportunity: string;
}

export function useContextLabels(): ContextLabels {
  const t = useTranslations("ai.context");
  return {
    general: t("general"),
    yourDocument: t("yourDocument"),
    aiReview: t("aiReview"),
    openReview: t("openReview"),
    viewApplication: t("viewApplication"),
    viewOpportunity: t("viewOpportunity"),
  };
}

/**
 * What a chat is about, resolved from its essay document, application or opportunity link.
 * `documentName` looks up an essay document's name.
 */
export function contextFor(
  conversation: Pick<Conversation, "opportunityId" | "applicationId" | "documentId">,
  labels: ContextLabels,
  documentName?: (id: string) => string | undefined,
): ChatContext {
  if (conversation.documentId) {
    return {
      kind: "document",
      key: `document:${conversation.documentId}`,
      title: documentName?.(conversation.documentId) ?? labels.yourDocument,
      provider: labels.aiReview,
      href: reviewPath(conversation.documentId, "ai"),
      linkLabel: labels.openReview,
    };
  }
  if (conversation.applicationId) {
    const application = getApplicationDetail(conversation.applicationId);
    if (application) {
      const opportunity = application.opportunityId ? getMockOpportunityById(application.opportunityId) : undefined;
      return {
        kind: "application",
        key: `application:${application.id}`,
        title: application.title,
        provider: application.provider,
        countryCode: opportunity?.countryCode,
        isRemote: opportunity?.isRemote,
        matchScore: opportunity?.matchScore,
        deadlineDate: application.deadlineDate,
        href: `/applications/${application.id}`,
        linkLabel: labels.viewApplication,
      };
    }
  }
  if (conversation.opportunityId) {
    const opportunity = getMockOpportunityById(conversation.opportunityId);
    if (opportunity) {
      return {
        kind: "opportunity",
        key: `opportunity:${opportunity.id}`,
        title: opportunity.title,
        provider: opportunity.provider,
        countryCode: opportunity.countryCode,
        isRemote: opportunity.isRemote,
        matchScore: opportunity.matchScore,
        deadlineDate: opportunity.deadlineDate,
        href: `/discover/${opportunity.id}`,
        linkLabel: labels.viewOpportunity,
      };
    }
  }
  return { kind: "general", key: "general", title: labels.general };
}
