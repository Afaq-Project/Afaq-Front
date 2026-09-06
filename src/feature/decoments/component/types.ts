// export type DocCategory =
//   | "Resume"
//   | "Essay"
//   | "Transcript"
//   | "Recommendation Letter";

// export type DocumentItem = {
//   id: string;
//   category: DocCategory;
//   fileName: string;
//   uploadedOn: string;
//   linkedTo: string | null;
//   reviewWithAI?: boolean;
// };

export type DocCategory =
  | "Resume"
  | "Essay"
  | "Transcript"
  | "Recommendation Letter";

export type ReviewResult = {
  score: number;
  reviewsUsed: number;
  reviewsTotal: number;
  content: string;
  strengths: string[];
  suggestions: string[];
  concerns: string[];
};

export type DocumentItem = {
  id: string;
  category: DocCategory;
  fileName: string;
  uploadedOn: string;
  linkedTo: string | null;
  reviewWithAI?: boolean;
  review?: ReviewResult;
};
