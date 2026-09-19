import type { AppDocument } from "./document";

export interface DocumentVersion {
  id: string;
  label: string;
  uploadedOn: string;
  sizeBytes: number;
}

export interface DocumentReview {
  reviewedOn: string;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

export interface DocumentDetail extends AppDocument {
  versions: DocumentVersion[];
  review: DocumentReview | null;
}

export interface ReviewQuota {
  used: number;
  limit: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}
