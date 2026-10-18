import { FREE_LIMITS } from "@/src/feature/billing/config/plans";
import type { DocumentTypeKey } from "@/src/shared/lib/document-types";
import type { ReviewQuota } from "../types/review";

/** Essay reviews on the free plan each month. */
export const REVIEW_QUOTA: ReviewQuota = { used: 1, limit: FREE_LIMITS.essayReviews };

/** A seeded review: `daysAgo` is counted back from today. */
interface ReviewSeed {
  daysAgo: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

/**
 * TODO: there's no essay-review endpoint yet. Until there is, the first essays the user opens
 * take these in order (null = not reviewed), so both states can be seen. Later essays start
 * unreviewed.
 */
export const REVIEW_SEEDS: (ReviewSeed | null)[] = [
  {
    daysAgo: 3,
    summary:
      "A sincere essay with a strong opening. Tightening the middle and saying more about your goals would make it more convincing.",
    strengths: [
      "A clear, personal opening that sets up your motivation.",
      "Concrete examples from your coursework back up your claims.",
    ],
    weaknesses: [
      "The middle section repeats points from the introduction.",
      "Your goals after the program are only mentioned in passing.",
    ],
    suggestions: [
      "Cut the second paragraph's restatement of your background.",
      "Name one specific course or lab you want to join.",
      "End with how the program connects to your long-term plan.",
      "Keep each paragraph to one main idea.",
    ],
  },
  null,
];

/** Stands in for the review call; the feedback depends on the document's type. */
export function mockReviewContent(type?: DocumentTypeKey) {
  if (type === "cv") {
    return {
      summary: "A tidy, readable CV. Results-focused bullets and a sharper top section would make it stand out.",
      strengths: ["Clean layout that's easy to scan.", "Education and experience are in a sensible order."],
      weaknesses: ["Most bullets describe duties rather than results.", "The skills section is a long list with no context."],
      suggestions: [
        "Start each bullet with an action verb and add a number where you can.",
        "Group skills by type and drop the ones you can't back up.",
        "Add a two-line profile at the top tailored to the program.",
      ],
    };
  }
  if (type === "recommendation") {
    return {
      summary: "A warm, credible letter. More specific examples would make the endorsement stronger.",
      strengths: ["The writer explains how long and in what role they've known you.", "The tone is positive and sincere."],
      weaknesses: ["Praise is mostly general (\"hard-working\", \"bright\").", "It doesn't mention the program you're applying to."],
      suggestions: [
        "Ask your recommender to add one concrete example of your work.",
        "Share the program details so the letter can speak to your fit.",
      ],
    };
  }
  return {
    summary: "A clear, well-organized essay. A few long sentences and a soft ending hold it back.",
    strengths: ["Clear structure with a logical flow between ideas.", "Consistent tone throughout the essay."],
    weaknesses: ["Some sentences are long and could be split for clarity.", "The closing section could end on a stronger note."],
    suggestions: [
      "Break the longest paragraph into two shorter ones.",
      "Add a transition sentence between your second and third ideas.",
    ],
  };
}
