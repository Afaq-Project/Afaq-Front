import apiClient, { type ApiEnvelope, type PaginationMeta } from "./axios-client";

/** The API rejects page sizes above 100. */
const MAX_PAGE_SIZE = 100;

type Params = Record<string, string | number | undefined>;

async function getPage<T>(path: string, params: Params, page: number) {
  const envelope = await apiClient.get<ApiEnvelope<T[]>>(path, {
    params: { ...params, page, limit: MAX_PAGE_SIZE },
    rawEnvelope: true,
  });
  const meta = envelope.meta as { pagination?: PaginationMeta } | null;
  return { items: envelope.data ?? [], totalPages: meta?.pagination?.totalPages ?? 1 };
}

/**
 * Loads every page of a paginated list. The first page reports the page count; the rest
 * are fetched in parallel. Unpaginated endpoints simply return their single page.
 */
export async function fetchAllPages<T>(path: string, params: Params = {}): Promise<T[]> {
  const first = await getPage<T>(path, params, 1);
  const remaining = Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, i) => i + 2);
  const rest = await Promise.all(remaining.map((page) => getPage<T>(path, params, page)));
  return [first.items, ...rest.map((r) => r.items)].flat();
}
