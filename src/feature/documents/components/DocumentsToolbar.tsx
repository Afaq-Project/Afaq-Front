import { LayoutGrid, List, Search } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import { CATEGORY_TABS } from "../services/utils";
import type { DocumentCategoryFilter } from "../types/document";

export type DocumentsView = "list" | "grid";

export function DocumentsToolbar({
  category,
  onCategoryChange,
  search,
  onSearchChange,
  view,
  onViewChange,
}: {
  category: DocumentCategoryFilter;
  onCategoryChange: (category: DocumentCategoryFilter) => void;
  search: string;
  onSearchChange: (search: string) => void;
  view: DocumentsView;
  onViewChange: (view: DocumentsView) => void;
}) {
  return (
    <div className="flex flex-col gap-3 bg-white shadow-card p-4 rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-1 -m-1 overflow-x-auto">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onCategoryChange(tab.value)}
              className={cn(
                "shrink-0 rounded-sm px-3 py-2 text-small font-medium transition-colors",
                category === tab.value
                  ? "bg-primary-50 text-primary-800"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-sm shrink-0">
          <button
            type="button"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-sm transition-colors",
              view === "list"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900",
            )}
          >
            <List size={16} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-sm transition-colors",
              view === "grid"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900",
            )}
          >
            <LayoutGrid size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="relative pt-3 border-neutral-100 border-t">
        <Search
          size={16}
          strokeWidth={1.75}
          className="top-1/2 left-3 absolute mt-1.5 text-neutral-400 -translate-y-1/2"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search documents by name or linked application"
          className="pl-9 border-neutral-200 rounded-sm focus:ring-2 focus:ring-primary-400 w-full h-10 text-sm focus:outline-none focus:border-transparent"
        />
      </div>
    </div>
  );
}
