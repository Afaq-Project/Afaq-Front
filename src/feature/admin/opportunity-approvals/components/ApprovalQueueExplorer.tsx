"use client";

import { useMemo, useState } from "react";

import { OPPORTUNITIES } from "../mocks/opportunities";
import { OpportunitySubmission } from "../types/opportunity";
import { ApprovalFilterState, DEFAULT_APPROVAL_FILTERS } from "../types/filters";
import { filterOpportunities, getUniqueSources } from "../services/utils";
import { ApprovalQueueHeader } from "./ApprovalQueueHeader";
import { ApprovalsFilters } from "./ApprovalsFilters";
import { OpportunitiesTable } from "./OpportunitiesTable";

const PAGE_SIZE = 5;

export function ApprovalQueueExplorer() {
  const [opportunities, setOpportunities] = useState<OpportunitySubmission[]>(OPPORTUNITIES);
  const [filters, setFilters] = useState<ApprovalFilterState>(DEFAULT_APPROVAL_FILTERS);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sources = useMemo(() => getUniqueSources(OPPORTUNITIES), []);

  function handleFiltersChange(next: ApprovalFilterState) {
    setFilters(next);
    setPage(1);
  }

  function handleToggleExpand(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  function handleApprove(id: string) {
    setOpportunities((current) => current.filter((o) => o.id !== id));
  }

  function handleReject(id: string) {
    setOpportunities((current) => current.filter((o) => o.id !== id));
  }

  const filtered = filterOpportunities(opportunities, filters);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <ApprovalQueueHeader pendingCount={opportunities.length} />
      <ApprovalsFilters filters={filters} onFiltersChange={handleFiltersChange} sources={sources} />
      <OpportunitiesTable
        opportunities={visible}
        expandedId={expandedId}
        onToggleExpand={handleToggleExpand}
        onApprove={handleApprove}
        onReject={handleReject}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}
