import { Skeleton } from "./Skeleton";

/** Placeholder for a SectionCard: a title bar and a grid of label/value pairs. */
export function SectionCardSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="rounded-lg border border-neutral-100 bg-white p-4 md:p-5">
      <Skeleton className="mb-5 h-5 w-32" />
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}
