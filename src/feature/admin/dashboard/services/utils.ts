import { ScrapingSourceHealth, REPEATED_FAILURE_THRESHOLD } from "../types/scraping";

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function isRepeatedFailure(source: ScrapingSourceHealth): boolean {
  return source.consecutiveFailures >= REPEATED_FAILURE_THRESHOLD;
}
