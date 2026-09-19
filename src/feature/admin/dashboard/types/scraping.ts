export type ScrapeRunStatus = "success" | "failed";

export interface ScrapingSourceHealth {
  source: string;
  lastRunAt: string;
  status: ScrapeRunStatus;
  consecutiveFailures: number;
}

/** FR-3.10: a source with this many consecutive failed runs is flagged as a repeated failure. */
export const REPEATED_FAILURE_THRESHOLD = 3;
