import type { FundingStatus } from "../types/opportunity";

/** Funding in sentence case for chips and facts. */
export const FUNDING_LABEL: Record<FundingStatus, string> = {
  "Fully Funded": "Fully funded",
  "Partially Funded": "Partially funded",
  Paid: "Paid",
  Unpaid: "Unpaid",
};
