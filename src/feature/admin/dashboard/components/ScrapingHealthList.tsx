import { AlertTriangle, CheckCircle2, Radar, XCircle } from "lucide-react";

import Badge from "@/src/shared/ui/Badge";
import { SCRAPING_HEALTH } from "../mocks/scrapingHealth";
import { formatDateTime, isRepeatedFailure } from "../services/utils";

export function ScrapingHealthList() {
  return (
    <div className="flex flex-col gap-4 bg-white shadow-card p-5 rounded-lg h-full">
      <div className="flex items-center gap-2">
        <Radar size={18} strokeWidth={1.75} className="text-neutral-500" aria-hidden="true" />
        <div>
          <h2 className="text-h3">Scraping health</h2>
          <p className="text-neutral-500 text-caption">
            Last run per source. Repeated failures are flagged.
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-1">
        {SCRAPING_HEALTH.map((source) => {
          const repeatedFailure = isRepeatedFailure(source);

          return (
            <li
              key={source.source}
              className={`flex flex-wrap justify-between items-center gap-x-3 gap-y-1 px-3 py-2.5 rounded-sm ${
                repeatedFailure ? "bg-danger-50" : "even:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {repeatedFailure ? (
                  <AlertTriangle size={16} strokeWidth={1.75} className="text-danger-600 shrink-0" />
                ) : source.status === "success" ? (
                  <CheckCircle2 size={16} strokeWidth={1.75} className="text-success-600 shrink-0" />
                ) : (
                  <XCircle size={16} strokeWidth={1.75} className="text-warning-600 shrink-0" />
                )}
                <span
                  className={`font-medium text-small ${repeatedFailure ? "text-danger-600" : "text-neutral-900"}`}
                >
                  {source.source}
                </span>
                {repeatedFailure && (
                  <Badge tone="red">{source.consecutiveFailures} failures in a row</Badge>
                )}
              </div>
              <span
                className={`text-caption whitespace-nowrap ${repeatedFailure ? "text-danger-600" : "text-neutral-500"}`}
              >
                {formatDateTime(source.lastRunAt)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
