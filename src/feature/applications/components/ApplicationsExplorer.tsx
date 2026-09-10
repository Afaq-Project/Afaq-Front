"use client";

import { useState } from "react";

import { APPLICATIONS } from "../mocks/applications";
import { ApplicationFilterState, DEFAULT_APPLICATION_FILTERS } from "../types/filters";
import { filterApplications } from "../services/utils";
import { ApplicationsFilters } from "./ApplicationsFilters";
import { ApplicationsTable } from "./ApplicationsTable";

const PAGE_SIZE = 5;

export function ApplicationsExplorer() {
  const [filters, setFilters] = useState<ApplicationFilterState>(
    DEFAULT_APPLICATION_FILTERS,
  );
  const [page, setPage] = useState(1);

  function handleFiltersChange(next: ApplicationFilterState) {
    setFilters(next);
    setPage(1);
  }

  const filtered = filterApplications(APPLICATIONS, filters);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <ApplicationsFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <ApplicationsTable
        applications={visible}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}
