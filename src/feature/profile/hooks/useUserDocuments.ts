"use client";

import { useQuery } from "@tanstack/react-query";
import type { DocumentCategory } from "@/src/feature/opportunities/types/opportunity";
import { useDocumentTypes } from "@/src/shared/lib/api/hooks/useReferenceData";
import { profileService } from "../services/profileService";
import type { ApiDocument } from "../types/api";

const CATEGORY_KEYWORDS: Record<DocumentCategory, string[]> = {
  resume: ["resume", "cv"],
  essay: ["essay", "personal statement"],
  transcript: ["transcript"],
  recommendation: ["recommendation", "reference letter"],
  other: ["other"],
};

/** The category a document type's name explicitly names, or undefined. Never a fallback. */
function categoryForTypeName(typeName: string): DocumentCategory | undefined {
  const name = typeName.toLowerCase();
  return (Object.keys(CATEGORY_KEYWORDS) as DocumentCategory[]).find((category) =>
    CATEGORY_KEYWORDS[category].some((keyword) => name.includes(keyword)),
  );
}

/**
 * The user's uploaded documents by category, matched only through each document's own type
 * (documentTypeId → type name → category). Documents with no type, an unknown type, or a type
 * that names no category are left out rather than guessed.
 *
 * `typed` is false when none of the user's documents carry a type at all; callers then treat
 * every requirement as not uploaded.
 */
export function useUserDocuments() {
  const documents = useQuery({ queryKey: ["profile", "documents"], queryFn: profileService.listDocuments });
  const types = useDocumentTypes();

  const byCategory = new Map<DocumentCategory, ApiDocument>();
  let typed = false;
  if (documents.data && types.data) {
    const typeNames = new Map(types.data.map((type) => [type.id, type.nameEn]));
    for (const doc of documents.data) {
      if (!doc.documentTypeId) continue;
      typed = true;
      const typeName = typeNames.get(doc.documentTypeId);
      const category = typeName ? categoryForTypeName(typeName) : undefined;
      if (category && !byCategory.has(category)) byCategory.set(category, doc);
    }
  }

  return {
    /** Both requests succeeded, so the uploaded/not-uploaded states can be trusted. */
    available: documents.isSuccess && types.isSuccess,
    isLoading: documents.isPending || types.isPending,
    typed,
    byCategory,
  };
}
