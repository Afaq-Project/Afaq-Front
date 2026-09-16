export type DocumentType =
  | "resume"
  | "essay"
  | "transcript"
  | "recommendation";

export interface DocumentItem {
  id: string;
  type: DocumentType;
  fileName: string;
  uploadedAt: string;
  linkedTo: string[];
  aiReviewable?: boolean;
}

export interface ReviewFinding {
  id: string;
  text: string;
}

export interface ReviewResult {
  score: number;
  strengths: ReviewFinding[];
  suggestions: ReviewFinding[];
  concerns: ReviewFinding[];
}

export interface ReviewUsage {
  used: number;
  total: number;
}
