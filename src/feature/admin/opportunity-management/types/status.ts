import type { Tone } from "@/src/shared/ui/Badge";
import type { OpportunityStatus, OpportunityType } from "./opportunity";

export const STATUS_TONE: Record<OpportunityStatus, Tone> = {
  Live: "teal",
  Closed: "gray",
};

export const TYPE_TONE: Record<OpportunityType, Tone> = {
  Scholarship: "green",
  Internship: "blue",
};

/** BR-3: a closed opportunity stays listed for this many days past its deadline before it drops off. */
export const RETENTION_DAYS = 30;
