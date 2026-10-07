import { Skeleton } from "@/src/shared/ui/Skeleton";

/** Placeholder matching ProfileHeader: band, overlapping avatar, identity lines and the donut. */
export function ProfileHeaderSkeleton() {
  return (
    <div className="rounded-lg border border-neutral-100 bg-white">
      <div className="h-14 rounded-t-lg bg-primary-50" />
      <div className="flex flex-col gap-4 px-4 pb-4 md:flex-row md:items-end md:justify-between md:px-5 md:pb-5">
        <div className="flex min-w-0 items-end gap-4">
          <Skeleton className="-mt-8 size-16 shrink-0 rounded-full ring-4 ring-white" />
          <div className="flex flex-col gap-2 pt-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-neutral-100 pt-4 md:border-t-0 md:pt-0">
          <Skeleton className="size-15 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
