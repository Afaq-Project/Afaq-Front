import type { Tone } from "@/src/shared/ui/Badge";
import type { OpportunityType } from "./opportunity";

export const TYPE_TONE: Record<OpportunityType, Tone> = {
  Scholarship: "green",
  Internship: "blue",
};

export const DUPLICATE_BADGE_TONE: Tone = "amber";
export const PENDING_BADGE_TONE: Tone = "amber";
