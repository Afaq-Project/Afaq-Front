"use client";

import { useSyncExternalStore } from "react";
import { IS_PREMIUM } from "@/src/feature/billing/mocks/subscription";
import { REVIEW_SEEDS, REVIEW_QUOTA, mockReviewContent } from "../mocks/reviews";
import type { DocumentTypeKey } from "@/src/shared/lib/document-types";
import type { ReviewInfo, DocumentReview } from "../types/review";

/**
 * AI reviews of essays, CVs and recommendation letters, shared by the Documents list, the review
 * page, the AI assistant and application details. One review per document: a new one replaces it.
 *
 * TODO: there's no essay-review endpoint yet. Reviews are mocked and kept in sessionStorage, so
 * they're lost when the browser session ends. Swap `startReview` for the real call and load
 * reviews from the server before launch.
 */

/** Premium has no monthly review limit. */
export const REVIEWS_UNLIMITED = IS_PREMIUM;

export interface ReviewState {
  /** False until sessionStorage has been read (always false on the server). */
  loaded: boolean;
  /** The review of each document, by document id. */
  reviews: Record<string, DocumentReview>;
  /** Essays that have had their seed (see REVIEW_SEEDS). */
  seeded: string[];
  /** Reviews used this month. */
  used: number;
  /** Documents with a review in progress. */
  pending: string[];
  /**
   * Suggestions the user has checked off, by review id (indexes into its suggestions).
   * TODO: save these with the review once there's an endpoint.
   */
  done: Record<string, number[]>;
}

// v3: seeded reviews are no longer dated before their file was uploaded, and checked suggestions are kept.
const STORAGE_KEY = "afaq_essay_reviews_v3";
const REVIEW_DELAY_MS = 1200;
const DAY_MS = 24 * 60 * 60 * 1000;

const SERVER_STATE: ReviewState = { loaded: false, reviews: {}, seeded: [], used: REVIEW_QUOTA.used, pending: [], done: {} };

let state: ReviewState = SERVER_STATE;
const listeners = new Set<() => void>();

function load() {
  if (state.loaded || typeof window === "undefined") return;
  let saved: Partial<ReviewState> = {};
  try {
    saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    // Unreadable or blocked storage: start empty.
  }
  // Reviews in progress don't survive a reload.
  state = { ...SERVER_STATE, ...saved, loaded: true, pending: [] };
}

function update(next: (prev: ReviewState) => ReviewState) {
  load();
  state = next(state);
  try {
    const { reviews, seeded, used, done } = state;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ reviews, seeded, used, done }));
  } catch {
    // Quota or blocked storage: the in-memory state still has it for this visit.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return state;
}

export function useReviews() {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_STATE);
}

/** The Documents list status for an essay. */
export function reviewInfoFor(snapshot: ReviewState, documentId: string): ReviewInfo {
  const review = snapshot.reviews[documentId];
  return review ? { reviewedAt: review.reviewedAt, suggestionsCount: review.suggestions.length } : {};
}

export const quotaLeft = (snapshot: ReviewState) => Math.max(0, REVIEW_QUOTA.limit - snapshot.used);

/** Gives essays seen for the first time the next mock state, so both review states show up. */
export function seedReviews(essays: { id: string; name: string; addedAt?: string }[]) {
  load();
  const fresh = essays.filter((essay) => !state.seeded.includes(essay.id));
  if (fresh.length === 0) return;
  update((prev) => {
    const reviews = { ...prev.reviews };
    const seeded = [...prev.seeded];
    for (const essay of fresh) {
      const seed = REVIEW_SEEDS[seeded.length];
      seeded.push(essay.id);
      if (!seed || reviews[essay.id]) continue;
      const { daysAgo, ...content } = seed;
      // Never before the file was uploaded: a review can't predate its file.
      const uploaded = essay.addedAt ? new Date(essay.addedAt).getTime() : 0;
      const reviewedAt = Math.min(Date.now(), Math.max(Date.now() - daysAgo * DAY_MS, uploaded + 60 * 60 * 1000));
      reviews[essay.id] = {
        id: `review-${essay.id}`,
        documentId: essay.id,
        essayName: essay.name,
        reviewedAt: new Date(reviewedAt).toISOString(),
        ...content,
      };
    }
    return { ...prev, reviews, seeded };
  });
}

/**
 * After an essay's file is replaced (a new document id), its review moves to the new id.
 * TODO: mark it as a review of the previous file once there's version history.
 */
export function moveReview(oldId: string, newId: string) {
  update((prev) => {
    const { [oldId]: review, ...rest } = prev.reviews;
    return {
      ...prev,
      seeded: [...prev.seeded, newId],
      reviews: review ? { ...rest, [newId]: { ...review, documentId: newId } } : rest,
    };
  });
}

/** Checks or unchecks one of a review's suggestions (by its index). */
export function toggleSuggestion(reviewId: string, index: number) {
  update((prev) => {
    const current = prev.done[reviewId] ?? [];
    const next = current.includes(index) ? current.filter((entry) => entry !== index) : [...current, index];
    return { ...prev, done: { ...prev.done, [reviewId]: next } };
  });
}

/** Drops a deleted document's review. */
export function forgetReview(documentId: string) {
  update((prev) => {
    const reviews = { ...prev.reviews };
    delete reviews[documentId];
    return { ...prev, reviews };
  });
}

interface StartReview {
  essayName: string;
  /** The document's type, for the mock content; essays when absent (pasted text). */
  type?: DocumentTypeKey;
  documentId?: string;
  purpose?: string;
  /**
   * Called with the finished review. Where it was started decides what happens: the review page
   * updates in place; the AI assistant opens the review page.
   */
  onReady: (review: DocumentReview) => void;
}

/** Uses one review from the quota and produces the (mock) review after a short delay. */
export function startReview({ documentId, essayName, type, purpose, onReady }: StartReview) {
  update((prev) => ({
    ...prev,
    used: prev.used + 1,
    pending: documentId ? [...prev.pending, documentId] : prev.pending,
  }));
  // TODO: swap the mock for the real essay-review call.
  setTimeout(() => {
    const review: DocumentReview = {
      id: `review-${Date.now()}`,
      documentId,
      essayName,
      purpose,
      reviewedAt: new Date().toISOString(),
      ...mockReviewContent(type),
    };
    update((prev) => ({
      ...prev,
      reviews: documentId ? { ...prev.reviews, [documentId]: review } : prev.reviews,
      seeded: documentId && !prev.seeded.includes(documentId) ? [...prev.seeded, documentId] : prev.seeded,
      pending: prev.pending.filter((id) => id !== documentId),
    }));
    onReady(review);
  }, REVIEW_DELAY_MS);
}

/** An essay's review page, optionally remembering where the user came from for its back link. */
export function reviewPath(documentId: string, from?: "ai" | { application: string }) {
  const path = `/documents/${encodeURIComponent(documentId)}/review`;
  if (!from) return path;
  return `${path}?from=${from === "ai" ? "ai" : `application:${encodeURIComponent(from.application)}`}`;
}
