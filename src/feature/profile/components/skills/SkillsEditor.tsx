"use client";

import { useState } from "react";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import type { ReferenceOption } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { MAX_SKILLS, SkillPicker } from "@/src/shared/ui/pickers/SkillPicker";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import { useUpdatePersonal } from "../../hooks/useProfileQuery";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { formatReferenceName } from "../../services/format";

interface SkillsEditorProps {
  experiences: string[];
  names: ReferenceNames;
  onDone: () => void;
}

/** Edits the profile's skills (`experiences`, saved as a whole list). */
export function SkillsEditor({ experiences, names, onDone }: SkillsEditorProps) {
  const updateMut = useUpdatePersonal();
  const [selected, setSelected] = useState<ReferenceOption[]>(() =>
    experiences.map((value) => ({ id: value, name: formatReferenceName(names.skill(value) ?? value) })),
  );
  const ids = selected.map((s) => s.id);
  const unchanged = ids.length === experiences.length && ids.every((id, i) => id === experiences[i]);

  return (
    <SectionCard
      title="Skills"
      description={`${selected.length} of ${MAX_SKILLS} selected`}
      isEditing
      onCancel={onDone}
      onSave={() => updateMut.mutate({ experiences: ids }, { onSuccess: onDone })}
      isSaving={updateMut.isPending}
      saveDisabled={unchanged}
      error={updateMut.isError ? getErrorMessage(updateMut.error) : null}
    >
      <SkillPicker selected={selected} onChange={setSelected} max={MAX_SKILLS} />
    </SectionCard>
  );
}
