import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <div
      className={`flex justify-between items-center gap-3 ${className}`}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex justify-center items-center hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none rounded-md w-9 h-9 text-neutral-600 transition-colors"
      >
        <ChevronLeft size={18} strokeWidth={1.75} />
      </button>

      <span className="text-neutral-600 text-small">
        Page {page} of {pageCount}
      </span>

      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        className="flex justify-center items-center hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none rounded-md w-9 h-9 text-neutral-600 transition-colors"
      >
        <ChevronRight size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
}
