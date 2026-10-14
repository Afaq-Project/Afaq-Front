/**
 * An essay's AI review. A document has at most one: a new review replaces it.
 * TODO: keep earlier reviews as version history once the review endpoint supports it.
 */
export interface DocumentReview {
  id: string;
  /** The uploaded document it belongs to; absent for essays pasted into the AI assistant. */
  documentId?: string;
  /** The essay's name when it was reviewed. */
  essayName: string;
  /** What the essay is for, e.g. an opportunity title. */
  purpose?: string;
  /** ISO date-time. */
  reviewedAt: string;
  /** A one- or two-sentence overall take. */
  summary?: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

/** An essay's review state as the Documents list shows it; with no review it reads "Not reviewed yet". */
export interface ReviewInfo {
  /** ISO date-time of the review. */
  reviewedAt?: string;
  suggestionsCount?: number;
}

export interface ReviewQuota {
  used: number;
  limit: number;
}
