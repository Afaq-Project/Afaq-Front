"use client";

import { useState } from "react";

import { SUBSCRIPTION_EVENTS } from "../mocks/subscriptionEvents";
import { SUBSCRIPTION_METRICS } from "../mocks/metrics";
import { DEFAULT_SUBSCRIPTION_FILTERS, SubscriptionFilterState } from "../types/filters";
import { filterSubscriptionEvents } from "../services/utils";
import { SubscriptionsHeader } from "./SubscriptionsHeader";
import { StripeMonitoringBanner } from "./StripeMonitoringBanner";
import { SubscriptionMetricCards } from "./SubscriptionMetricCards";
import { SubscriptionsFilters } from "./SubscriptionsFilters";
import { SubscriptionEventsTable } from "./SubscriptionEventsTable";

const PAGE_SIZE = 6;

export function SubscriptionsExplorer() {
  const [filters, setFilters] = useState<SubscriptionFilterState>(DEFAULT_SUBSCRIPTION_FILTERS);
  const [page, setPage] = useState(1);

  function handleFiltersChange(next: SubscriptionFilterState) {
    setFilters(next);
    setPage(1);
  }

  const filtered = filterSubscriptionEvents(SUBSCRIPTION_EVENTS, filters);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <SubscriptionsHeader />
      <StripeMonitoringBanner />
      <SubscriptionMetricCards metrics={SUBSCRIPTION_METRICS} />
      <SubscriptionsFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <SubscriptionEventsTable
        events={visible}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}
