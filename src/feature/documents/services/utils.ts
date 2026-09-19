import { FileImage, FileText, FileType2, type LucideIcon } from "lucide-react";

import type { Tone } from "@/src/shared/ui/Badge";
import type {
  AppDocument,
  DocumentCategory,
  DocumentCategoryFilter,
} from "../types/document";

export const CATEGORY_META: Record<
  DocumentCategory,
  { label: string; icon: LucideIcon; tone: Tone }
> = {
  pdf: { label: "PDF", icon: FileText, tone: "red" },
  word: { label: "Word", icon: FileType2, tone: "blue" },
  image: { label: "Image", icon: FileImage, tone: "amber" },
};

export const CATEGORY_TABS: { value: DocumentCategoryFilter; label: string }[] =
  [
    { value: "all", label: "All" },
    { value: "pdf", label: "PDF Files" },
    { value: "word", label: "Word Docs" },
    { value: "image", label: "Images" },
  ];

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function filterDocuments(
  documents: AppDocument[],
  { category, search }: { category: DocumentCategoryFilter; search: string },
): AppDocument[] {
  const query = search.trim().toLowerCase();

  return documents.filter((document) => {
    const matchesCategory =
      category === "all" || document.category === category;

    const matchesSearch =
      query.length === 0 ||
      document.name.toLowerCase().includes(query) ||
      document.linkedTo?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}

export interface DocumentsSummary {
  total: number;
  usedSpace: string;
  recentlyAdded: number;
  verified: number;
}

export function getDocumentsSummary(
  documents: AppDocument[],
): DocumentsSummary {
  const usedSpaceBytes = documents.reduce(
    (sum, document) => sum + document.sizeBytes,
    0,
  );

  return {
    total: documents.length,
    usedSpace: formatBytes(usedSpaceBytes),
    recentlyAdded: documents.filter((document) => document.isRecent).length,
    verified: documents.filter((document) => document.verified).length,
  };
}
