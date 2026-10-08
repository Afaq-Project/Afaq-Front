import { Skeleton } from "@/src/shared/ui/Skeleton";

/** Loading placeholder shaped like OpportunityCard. */
export function OpportunityCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 bg-white p-5 border border-neutral-100 rounded-lg">
      <div className="flex items-center gap-3">
        <Skeleton className="rounded-md size-10" />
        <Skeleton className="w-32 h-3" />
      </div>
      <Skeleton className="w-4/5 h-4" />
      <Skeleton className="w-28 h-5" />
      <div className="flex gap-1.5">
        <Skeleton className="rounded-full w-20 h-5" />
        <Skeleton className="rounded-full w-24 h-5" />
      </div>
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-3/4 h-3" />
      <div className="flex justify-between pt-3 border-neutral-100 border-t">
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-20 h-3" />
      </div>
    </div>
  );
}
