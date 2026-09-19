"use client";

import { useState } from "react";

import { MANAGED_OPPORTUNITIES } from "../mocks/opportunities";
import { ManagedOpportunity, ManagedOpportunityDraft } from "../types/opportunity";
import { DEFAULT_MANAGE_FILTERS, ManageFilterState } from "../types/filters";
import { filterOpportunities, getOpportunityById } from "../services/utils";
import { ManageOpportunitiesHeader } from "./ManageOpportunitiesHeader";
import { ManageFilters } from "./ManageFilters";
import { OpportunitiesTable } from "./OpportunitiesTable";
import { EditOpportunityModal } from "./EditOpportunityModal";

const PAGE_SIZE = 6;

export function ManageOpportunitiesExplorer() {
  const [opportunities, setOpportunities] = useState<ManagedOpportunity[]>(MANAGED_OPPORTUNITIES);
  const [filters, setFilters] = useState<ManageFilterState>(DEFAULT_MANAGE_FILTERS);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleFiltersChange(next: ManageFilterState) {
    setFilters(next);
    setPage(1);
  }

  function handleUnpublish(id: string) {
    setOpportunities((current) =>
      current.map((opportunity) =>
        opportunity.id === id ? { ...opportunity, unpublished: true } : opportunity,
      ),
    );
  }

  function handleSaveEdit(id: string, draft: ManagedOpportunityDraft) {
    setOpportunities((current) =>
      current.map((opportunity) =>
        opportunity.id === id ? { ...opportunity, ...draft } : opportunity,
      ),
    );
    setEditingId(null);
  }

  const filtered = filterOpportunities(opportunities, filters);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const editingOpportunity = editingId ? getOpportunityById(opportunities, editingId) ?? null : null;

  return (
    <div className="flex flex-col gap-4">
      <ManageOpportunitiesHeader />
      <ManageFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <OpportunitiesTable
        opportunities={visible}
        onEdit={setEditingId}
        onUnpublish={handleUnpublish}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />

      <EditOpportunityModal
        opportunity={editingOpportunity}
        onClose={() => setEditingId(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
