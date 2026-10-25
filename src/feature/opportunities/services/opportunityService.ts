import apiClient, { type ApiEnvelope, type PaginationMeta } from "@/src/shared/lib/api/axios-client";
import type {
  ApiMatch,
  ApiMatchesMeta,
  ApiMatchWithOpportunity,
  ApiOpportunity,
  ApiOpportunitySummary,
  ListOpportunitiesParams,
  MatchesParams,
} from "../types/api";

/** One page of a paginated list, whichever meta shape the endpoint uses. */
export interface Page<T> {
  items: T[];
  page: number;
  hasNext: boolean;
  total: number;
}

export const opportunityService = {
  async list(params: ListOpportunitiesParams): Promise<Page<ApiOpportunitySummary>> {
    const envelope = await apiClient.get<ApiEnvelope<ApiOpportunitySummary[]>>("/opportunities", { params, rawEnvelope: true });
    const pagination = (envelope.meta as { pagination?: PaginationMeta } | null)?.pagination;
    const items = envelope.data ?? [];
    return {
      items,
      page: pagination?.page ?? params.page,
      hasNext: pagination?.hasNext ?? false,
      total: pagination?.total ?? items.length,
    };
  },

  getById: (id: string) => apiClient.get<ApiOpportunity>(`/opportunities/${encodeURIComponent(id)}`),
};

// Unlike the other endpoints, matches nest the list and its meta inside `data`.
async function getMatchesPage<T>(path: string, params: MatchesParams): Promise<Page<T>> {
  const { data, meta } = await apiClient.get<{ data: T[]; meta: ApiMatchesMeta | null }>(path, { params });
  const items = data ?? [];
  const page = meta?.page ?? params.page ?? 1;
  return { items, page, hasNext: page < (meta?.pages ?? 1), total: meta?.total ?? items.length };
}

export const recommendationService = {
  matches: (params: MatchesParams) => getMatchesPage<ApiMatch>("/recommendations/matches", params),

  matchesWithOpportunities: (params: MatchesParams) =>
    getMatchesPage<ApiMatchWithOpportunity>("/recommendations/matches-with-opportunities", params),
};
