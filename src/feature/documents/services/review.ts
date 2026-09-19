import type { DocumentDetail, DocumentReview } from "../types/review";
import { DOCUMENT_DETAILS } from "../mocks/documentDetails";

export function getDocumentDetail(id: string): DocumentDetail | undefined {
  return DOCUMENT_DETAILS.find((document) => document.id === id);
}

/** Stands in for a real AI review call — used when the user requests a
 * review on a document that doesn't already have mocked feedback. */
export function generateMockReview(): DocumentReview {
  return {
    reviewedOn: "Just now",
    strengths: [
      "Clear structure with a logical flow between ideas.",
      "Consistent tone throughout the document.",
    ],
    improvements: [
      "Some sentences are long and could be split for clarity.",
      "The closing section could end on a stronger note.",
    ],
    suggestions: [
      "Break the longest paragraph into two shorter ones.",
      "Add a transition sentence between your second and third ideas.",
    ],
  };
}

const FALLBACK_REPLIES = [
  "Good question — I'd start with the Improvements section above, then ask me to apply the suggested edits.",
  "Reading it out loud usually surfaces the same issues I flagged — try that on the sentences in the Improvements section.",
];

/** Stands in for a real chat completion — picks a canned reply based on
 * simple keyword matching against the current review. */
export function buildAssistantReply(
  message: string,
  review: DocumentReview | null,
): string {
  const lower = message.toLowerCase();

  if (!review) {
    return 'I haven\'t reviewed this document yet — click "Request Review" and I\'ll take a look first.';
  }

  if (lower.includes("apply")) {
    return "Done — I've applied the suggested edits and saved them as a new version in the Versions panel.";
  }

  if (lower.includes("improve") || lower.includes("suggest") || lower.includes("fix")) {
    return review.suggestions[0];
  }

  if (lower.includes("strength") || lower.includes("good") || lower.includes("well")) {
    return review.strengths[0];
  }

  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
}
