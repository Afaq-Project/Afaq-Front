import { Skeleton } from "./Skeleton";

/** Placeholder matching AnchorNav: a vertical list on desktop, a chip row on mobile. */
export function AnchorNavSkeleton({ items = 4 }: { items?: number }) {
  const rows = Array.from({ length: items }, (_, i) => i);
  return (
    <>
      <div className="hidden w-52 shrink-0 flex-col gap-1 md:flex">
        {rows.map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
      <div className="flex gap-2 overflow-hidden py-2 md:hidden">
        {rows.map((i) => (
          <Skeleton key={i} className="h-11 w-28 shrink-0 rounded-full" />
        ))}
      </div>
    </>
  );
}
