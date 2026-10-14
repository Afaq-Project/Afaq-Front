"use client";

import { useQuery } from "@tanstack/react-query";
import { typeForName, type DocumentTypeKey } from "@/src/shared/lib/document-types";
import { useDocumentTypes } from "@/src/shared/lib/api/hooks/useReferenceData";
import { profileService } from "../services/profileService";
import type { ApiDocument } from "../types/api";

export const USER_DOCUMENTS_QUERY_KEY = ["profile", "documents"];

/**
 * The user's uploaded documents, each with its document type, read only from the document's own
 * type (documentTypeId → API type name → DOCUMENT_TYPES). Documents with no type, an unknown
 * type, or a type name that matches none of ours stay untyped; nothing is guessed.
 *
 * `typed` is false when none of the user's documents carry a type at all; callers then treat
 * every requirement as not uploaded.
 */
export function useUserDocuments() {
  const documents = useQuery({ queryKey: USER_DOCUMENTS_QUERY_KEY, queryFn: profileService.listDocuments });
  const types = useDocumentTypes();

  const byType = new Map<DocumentTypeKey, ApiDocument>();
  /** Every document with its type (undefined when it has none of ours). */
  const all: { document: ApiDocument; type?: DocumentTypeKey }[] = [];
  let typed = false;
  if (documents.data && types.data) {
    const typeNames = new Map(types.data.map((type) => [type.id, type.nameEn]));
    for (const doc of documents.data) {
      if (!doc.documentTypeId) {
        all.push({ document: doc });
        continue;
      }
      typed = true;
      const typeName = typeNames.get(doc.documentTypeId);
      const type = typeName ? typeForName(typeName) : undefined;
      all.push({ document: doc, type });
      if (type && !byType.has(type)) byType.set(type, doc);
    }
  }

  /** The API document type id for one of our types, when the API has a type by that name. */
  const apiTypeIdFor = (key: DocumentTypeKey) => types.data?.find((type) => typeForName(type.nameEn) === key)?.id;

  return {
    /** Both requests succeeded, so the uploaded/not-uploaded states can be trusted. */
    available: documents.isSuccess && types.isSuccess,
    isLoading: documents.isPending || types.isPending,
    isError: documents.isError || types.isError,
    refetch: () => {
      documents.refetch();
      types.refetch();
    },
    typed,
    byType,
    documents: all,
    apiTypeIdFor,
  };
}
