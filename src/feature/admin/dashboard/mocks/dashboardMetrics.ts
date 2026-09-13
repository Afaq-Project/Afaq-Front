import { DashboardMetrics } from "../types/metrics";

export const DASHBOARD_METRICS: DashboardMetrics = {
  users: {
    total: 1284,
    free: 1049,
    premium: 235,
  },
  pendingApprovalCount: 7,
  liveOpportunities: {
    scholarships: 58,
    internships: 34,
  },
  aiUsage: {
    totalEssayReviews: 612,
    totalChatMessages: 4380,
    freeEssayReviews: 388,
    premiumEssayReviews: 224,
    freeChatMessages: 2510,
    premiumChatMessages: 1870,
  },
  subscriptions: {
    activePremiumSubscribers: 235,
    failedPaymentDowngradesThisMonth: 6,
  },
};
