import type { ReactNode } from "react";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import { LOADING_NAME } from "../../hooks/useReferenceNames";

export function isLoadingName(value?: string | null) {
  return value === LOADING_NAME;
}

/**
 * A resolved name for display, or an inline skeleton bar while its reference list is still
 * loading. Undefined stays undefined, so empty-value handling still applies.
 */
export function withNameSkeleton(value?: string, width = "w-28"): ReactNode {
  if (!isLoadingName(value)) return value;
  return (
    <>
      <Skeleton className={`inline-block h-4 align-middle ${width}`} />
      <span className="sr-only">Loading</span>
    </>
  );
}
