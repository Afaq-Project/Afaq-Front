"use client";

import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { USER_DOCUMENTS_QUERY_KEY, useUserDocuments } from "@/src/feature/profile/hooks/useUserDocuments";
import { useDocumentEdits } from "../services/documentEditsStore";
import { seedReviews, useReviews } from "../services/reviewStore";
import { buildItems } from "../services/utils";

/**
 * The user's documents as list items (API documents + local edits + review state), shared by
 * the Documents list, the review page and the AI assistant. Essays seen for the first time
 * get their mock review state.
 */
export function useDocumentItems() {
  const userDocs = useUserDocuments();
  const edits = useDocumentEdits();
  const reviews = useReviews();
  const queryClient = useQueryClient();

  const items = useMemo(() => buildItems(userDocs.documents, edits, reviews), [userDocs.documents, edits, reviews]);

  useEffect(() => {
    if (reviews.loaded) seedReviews(items.filter((item) => item.type === "essay"));
  }, [reviews.loaded, items]);

  return {
    userDocs,
    items,
    edits,
    reviews,
    refresh: () => queryClient.invalidateQueries({ queryKey: USER_DOCUMENTS_QUERY_KEY }),
  };
}
