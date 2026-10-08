"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DiscoverQuery } from "../types/filters";
import { parseQuery, toSearchParams } from "../services/utils";

/**
 * The Discover query, kept in the URL so it survives refresh and back/forward and can be
 * shared. Updates replace the current history entry rather than adding one per keystroke.
 */
export function useDiscoverQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = useMemo(() => parseQuery(searchParams), [searchParams]);

  const update = useCallback(
    (patch: Partial<DiscoverQuery>) => {
      // Read the live URL so quick successive updates build on each other.
      const current = parseQuery(new URLSearchParams(window.location.search));
      const qs = toSearchParams({ ...current, ...patch }).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  return { query, update };
}
