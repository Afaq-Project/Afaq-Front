"use client";

import { useMemo, useState } from "react";

import { DOCUMENTS } from "../mocks/documents";
import { filterDocuments } from "../services/utils";
import type { DocumentCategoryFilter } from "../types/document";
import { DocumentGridCard } from "./DocumentGridCard";
import { DocumentListRow } from "./DocumentListRow";
import { DocumentsToolbar, type DocumentsView } from "./DocumentsToolbar";

export function DocumentsExplorer() {
  const [category, setCategory] = useState<DocumentCategoryFilter>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<DocumentsView>("list");

  const filtered = useMemo(
    () => filterDocuments(DOCUMENTS, { category, search }),
    [category, search],
  );

  return (
    <div className="flex flex-col gap-4">
      <DocumentsToolbar
        category={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
        view={view}
        onViewChange={setView}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-1 bg-white shadow-card py-16 rounded-lg text-center">
          <p className="font-medium text-neutral-800 text-small">
            No documents match your search
          </p>
          <p className="text-neutral-500 text-small">
            Try a different keyword or filter.
          </p>
        </div>
      ) : view === "list" ? (
        <div className="flex flex-col gap-3">
          {filtered.map((document) => (
            <DocumentListRow key={document.id} document={document} />
          ))}
        </div>
      ) : (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((document) => (
            <DocumentGridCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
}
