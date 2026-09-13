"use client";

import { useState } from "react";

import { USERS } from "../mocks/users";
import { UserFilterState, DEFAULT_USER_FILTERS } from "../types/filters";
import { filterUsers } from "../services/utils";
import { UsersHeader } from "./UsersHeader";
import { UsersFilters } from "./UsersFilters";
import { UsersTable } from "./UsersTable";

const PAGE_SIZE = 6;

export function UsersExplorer() {
  const [filters, setFilters] = useState<UserFilterState>(DEFAULT_USER_FILTERS);
  const [page, setPage] = useState(1);

  function handleFiltersChange(next: UserFilterState) {
    setFilters(next);
    setPage(1);
  }

  const filtered = filterUsers(USERS, filters);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <UsersHeader />
      <UsersFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <UsersTable users={visible} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
