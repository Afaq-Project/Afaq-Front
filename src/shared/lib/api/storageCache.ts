const PREFIX = "afaq_cache_v1:";

interface Entry<T> {
  savedAt: number;
  data: T;
}

/**
 * Wraps a fetcher so its result is kept in localStorage for `maxAgeMs`. Meant for large,
 * rarely changing, non-personal lists (e.g. every country) that take many paged requests,
 * so a reload or a new tab doesn't fetch them all again.
 *
 * Use it as a React Query `queryFn`: storage is only read when the query runs, on the client,
 * so server and client render the same thing. Storage errors (private mode, quota) fall back
 * to the network.
 */
export function cachedInStorage<T>(key: string, maxAgeMs: number, fetcher: () => Promise<T>) {
  const storageKey = PREFIX + key;

  return async (): Promise<T> => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const entry = JSON.parse(raw) as Entry<T>;
        if (Date.now() - entry.savedAt < maxAgeMs) return entry.data;
      }
    } catch {
      // Unreadable or blocked storage: fetch instead.
    }

    const data = await fetcher();
    try {
      localStorage.setItem(storageKey, JSON.stringify({ savedAt: Date.now(), data } satisfies Entry<T>));
    } catch {
      // Quota or blocked storage: the in-memory cache still has it for this session.
    }
    return data;
  };
}
