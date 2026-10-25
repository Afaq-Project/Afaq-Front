"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useTranslations } from "next-intl";

/**
 * Runs a step's server save, then continues. `save` resolves to whether it wrote anything;
 * cached profile data is only refreshed when it did.
 * On failure the user stays on the step and sees the error.
 */
export function useStepSave() {
  const t = useTranslations("onboarding");
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (save: () => Promise<boolean>, onSuccess: () => void) => {
    setIsSaving(true);
    setError(null);
    try {
      const changed = await save();
      if (changed) {
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, t("saveError")));
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, error, run };
}
