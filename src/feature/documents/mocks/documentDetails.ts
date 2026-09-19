import type { DocumentDetail, ReviewQuota } from "../types/review";
import { DOCUMENTS } from "./documents";

function baseOf(id: string) {
  const document = DOCUMENTS.find((doc) => doc.id === id);
  if (!document) throw new Error(`Unknown mock document id: ${id}`);
  return document;
}

export const REVIEW_QUOTA: ReviewQuota = { used: 1, limit: 3 };

export const DOCUMENT_DETAILS: DocumentDetail[] = [
  {
    ...baseOf("doc-1"),
    versions: [
      {
        id: "doc-1-v1",
        label: "Original upload",
        uploadedOn: "Oct 12, 2024",
        sizeBytes: 2_516_582,
      },
    ],
    review: null,
  },
  {
    ...baseOf("doc-2"),
    versions: [
      {
        id: "doc-2-v1",
        label: "First draft",
        uploadedOn: "Sep 28, 2024",
        sizeBytes: 760_000,
      },
      {
        id: "doc-2-v2",
        label: "Updated",
        uploadedOn: "Oct 05, 2024",
        sizeBytes: 870_400,
      },
    ],
    review: {
      reviewedOn: "Oct 05, 2024",
      strengths: [
        "Quantifies impact with concrete numbers (e.g. \"cut reporting time by 30%\").",
        "Clear, scannable structure with consistent section headers.",
      ],
      improvements: [
        "The skills list is generic — group them by category (languages, tools, ML) for faster scanning.",
        "Missing a short summary line at the top to anchor your target role.",
      ],
      suggestions: [
        "Add a one-line professional summary under your name.",
        "Quantify the churn-prediction project's outcome, not just its existence.",
      ],
    },
  },
  {
    ...baseOf("doc-3"),
    versions: [
      {
        id: "doc-3-v1",
        label: "Original upload",
        uploadedOn: "Sep 20, 2024",
        sizeBytes: 1_153_433,
      },
    ],
    review: null,
  },
  {
    ...baseOf("doc-4"),
    versions: [
      {
        id: "doc-4-v1",
        label: "Original upload",
        uploadedOn: "Sep 15, 2024",
        sizeBytes: 4_404_019,
      },
    ],
    review: null,
  },
  {
    ...baseOf("doc-5"),
    versions: [
      {
        id: "doc-5-v1",
        label: "Original upload",
        uploadedOn: "Sep 02, 2024",
        sizeBytes: 634_880,
      },
    ],
    review: null,
  },
  {
    ...baseOf("doc-6"),
    versions: [
      {
        id: "doc-6-v1",
        label: "Original upload",
        uploadedOn: "Aug 28, 2024",
        sizeBytes: 3_251_814,
      },
    ],
    review: null,
  },
  {
    ...baseOf("doc-7"),
    versions: [
      {
        id: "doc-7-v1",
        label: "Draft 1",
        uploadedOn: "Aug 12, 2024",
        sizeBytes: 385_000,
      },
      {
        id: "doc-7-v2",
        label: "Draft 2",
        uploadedOn: "Aug 20, 2024",
        sizeBytes: 419_840,
      },
    ],
    review: {
      reviewedOn: "Aug 21, 2024",
      strengths: [
        "Strong logical sequence in presenting ideas and the introduction.",
        "Successful use of specialized academic terminology.",
      ],
      improvements: [
        "Some sentences are long and complex, which may hinder reader comprehension.",
        "The conclusion needs rewording to enhance the final impact.",
      ],
      suggestions: [
        "Try breaking the second sentence into two shorter ones.",
        "Use more transitions to link the third idea to the fourth.",
      ],
    },
  },
  {
    ...baseOf("doc-8"),
    versions: [
      {
        id: "doc-8-v1",
        label: "Original upload",
        uploadedOn: "Aug 10, 2024",
        sizeBytes: 2_936_012,
      },
    ],
    review: null,
  },
];
