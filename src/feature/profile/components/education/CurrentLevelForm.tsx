"use client";

import { useState } from "react";
import { useAutoFocus } from "@/src/shared/hooks/useAutoFocus";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useEducationLevels } from "@/src/shared/lib/api/hooks/useReferenceData";
import { EditActions } from "@/src/shared/ui/EditActions";
import Select from "@/src/shared/ui/Select";
import { useUpdatePersonal } from "../../hooks/useProfileQuery";
import { FIELD_IDS } from "../common/fieldIds";
import { savedThen } from "../common/saved";

interface CurrentLevelFormProps {
  levelId?: string | null;
  onDone: () => void;
}

/** Inline form for the profile's current education level. */
export function CurrentLevelForm({ levelId, onDone }: CurrentLevelFormProps) {
  const updateMut = useUpdatePersonal();
  const { data: levels = [] } = useEducationLevels();
  const [value, setValue] = useState(levelId ?? "");
  useAutoFocus(FIELD_IDS.educationLevel);

  return (
    <div className="max-w-sm">
      <Select
        id={FIELD_IDS.educationLevel}
        label="Current education level"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        options={[{ value: "", label: "Select a level" }, ...levels.map((l) => ({ value: l.id, label: l.nameEn }))]}
      />
      <EditActions
        onCancel={onDone}
        onSave={() => updateMut.mutate({ educationLevelId: value }, { onSuccess: savedThen("Education level saved", onDone) })}
        isSaving={updateMut.isPending}
        saveDisabled={!value || value === levelId}
        error={updateMut.isError ? getErrorMessage(updateMut.error) : null}
      />
    </div>
  );
}
