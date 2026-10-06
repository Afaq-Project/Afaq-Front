"use client";

import { useState } from "react";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useAddLanguage, useDeleteLanguage } from "./useProfileQuery";

/** A language as the editor holds it — saved or not yet saved. */
export interface LanguageDraft {
  languageId: string;
  proficiencyLevelId: string;
  isNative: boolean;
}

/**
 * Saves an edited language list: deletes what was removed and adds what's new, using the
 * existing add / delete language calls. Entries have no ID of their own; the API deletes
 * them by language ID.
 */
export function useSaveLanguages() {
  const addMut = useAddLanguage();
  const deleteMut = useDeleteLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changes = (original: LanguageDraft[], next: LanguageDraft[]) => {
    const originalIds = original.map((l) => l.languageId);
    const nextIds = next.map((l) => l.languageId);
    return {
      removed: originalIds.filter((id) => !nextIds.includes(id)),
      added: next.filter((l) => !originalIds.includes(l.languageId)),
    };
  };

  /** Resolves to true when everything saved. */
  const save = async (original: LanguageDraft[], next: LanguageDraft[]) => {
    const { removed, added } = changes(original, next);
    setIsSaving(true);
    setError(null);
    try {
      await Promise.all([
        ...removed.map((id) => deleteMut.mutateAsync(id)),
        ...added.map((l) => addMut.mutateAsync(l)),
      ]);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = (original: LanguageDraft[], next: LanguageDraft[]) => {
    const { removed, added } = changes(original, next);
    return removed.length > 0 || added.length > 0;
  };

  return { save, hasChanges, isSaving, error };
}
