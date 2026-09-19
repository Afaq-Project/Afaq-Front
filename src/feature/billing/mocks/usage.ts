import type { UsageMetric } from "../types/billing";

export const USAGE_METRICS: UsageMetric[] = [
  { id: "ai-messages", label: "AI Messages", used: 12, limit: 20 },
  { id: "document-reviews", label: "Document Reviews", used: 1, limit: 3 },
];

export const USAGE_RESET_LABEL = "Resets on Oct 24, 2023";
