"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ApplicationsQuery } from "../types/filters";
import { applicationsQueryToParams, parseApplicationsQuery } from "../services/utils";

/** Status tab, search and type, kept in the URL (status, q, type) so they survive refresh and back/forward. */
export function useApplicationsQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = useMemo(() => parseApplicationsQuery(searchParams), [searchParams]);

  const update = useCallback(
    (patch: Partial<ApplicationsQuery>) => {
      // Read the live URL so quick successive updates build on each other.
      const current = parseApplicationsQuery(new URLSearchParams(window.location.search));
      const qs = applicationsQueryToParams({ ...current, ...patch }).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  return { query, update };
}
