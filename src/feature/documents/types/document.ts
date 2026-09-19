export type DocumentCategory = "pdf" | "word" | "image";
export type DocumentCategoryFilter = DocumentCategory | "all";

export interface AppDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  sizeBytes: number;
  uploadedOn: string;
  linkedTo?: string;
  verified: boolean;
  /** Surfaced in the "added this week" stat — set on a handful of mock rows. */
  isRecent?: boolean;
}
