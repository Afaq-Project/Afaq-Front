import { ScrapingSourceHealth } from "../types/scraping";

export const SCRAPING_HEALTH: ScrapingSourceHealth[] = [
  {
    source: "Mawhiba Portal",
    lastRunAt: "2026-09-12T03:00:00",
    status: "success",
    consecutiveFailures: 0,
  },
  {
    source: "Scholarship.gov",
    lastRunAt: "2026-09-12T03:05:00",
    status: "success",
    consecutiveFailures: 0,
  },
  {
    source: "LinkedIn Jobs",
    lastRunAt: "2026-09-11T21:10:00",
    status: "failed",
    consecutiveFailures: 4,
  },
  {
    source: "Internships.com",
    lastRunAt: "2026-09-12T03:15:00",
    status: "success",
    consecutiveFailures: 0,
  },
  {
    source: "Chevening Scholarships",
    lastRunAt: "2026-09-09T03:20:00",
    status: "failed",
    consecutiveFailures: 5,
  },
  {
    source: "DAAD Portal",
    lastRunAt: "2026-09-12T03:25:00",
    status: "success",
    consecutiveFailures: 0,
  },
  {
    source: "Erasmus+ Listings",
    lastRunAt: "2026-09-12T02:40:00",
    status: "success",
    consecutiveFailures: 0,
  },
];
