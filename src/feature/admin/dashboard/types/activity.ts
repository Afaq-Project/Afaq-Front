export type ActivityTag =
  | "New user"
  | "Approval needed"
  | "Upgrade"
  | "Downgrade"
  | "Scraper alert";

export interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  timestamp: string;
  tag: ActivityTag;
}
