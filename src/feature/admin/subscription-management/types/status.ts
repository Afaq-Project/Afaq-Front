import type { Tone } from "@/src/shared/ui/Badge";
import type { SubscriptionEventType } from "./event";

export const EVENT_TYPE_TONE: Record<SubscriptionEventType, Tone> = {
  Upgraded: "green",
  Renewed: "blue",
  "Failed payment": "red",
  "Downgraded to Free": "amber",
};
