import { getApplicationDetail } from "@/src/feature/applications/services/utils";
import { getOpportunityById } from "@/src/feature/opportunities/services/utils";
import type { Conversation } from "../types/chat";

export interface ChatContext {
  kind: "opportunity" | "application" | "general";
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

const GENERAL: ChatContext = { kind: "general", key: "general", title: "General guidance" };

/** What a chat is about, resolved from its opportunity or application link. */
export function contextFor(conversation: Pick<Conversation, "opportunityId" | "applicationId">): ChatContext {
  if (conversation.applicationId) {
    const application = getApplicationDetail(conversation.applicationId);
    if (application) {
      const opportunity = application.opportunityId ? getOpportunityById(application.opportunityId) : undefined;
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
        linkLabel: "View application",
      };
    }
  }
  if (conversation.opportunityId) {
    const opportunity = getOpportunityById(conversation.opportunityId);
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
        linkLabel: "View opportunity",
      };
    }
  }
  return GENERAL;
}
