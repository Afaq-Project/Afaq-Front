"use client";

import { useState } from "react";
import { useAutoFocus } from "@/src/shared/hooks/useAutoFocus";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useInstitutionOptions, type ReferenceOption } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { MajorMultiSelect } from "@/src/shared/ui/pickers/MajorMultiSelect";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import { TagSearch } from "@/src/shared/ui/TagSearch";
import { useUpdatePreferences } from "../../hooks/useProfileQuery";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { UNRESOLVED_INSTITUTION_NAME } from "../../services/format";
import { preferenceIdsFromApi } from "../../services/preferences";
import type { ApiPreferences } from "../../types/api";
import { FIELD_IDS } from "../common/fieldIds";
import { DegreeChecklist } from "./DegreeChecklist";

const MAX_TARGETS = 5;

interface StudyGoalsEditorProps {
  preferences?: ApiPreferences;
  names: ReferenceNames;
  onDone: () => void;
}

/** Edits target degrees, majors and institutions. At least one degree and one major are required. */
export function StudyGoalsEditor({ preferences, names, onDone }: StudyGoalsEditorProps) {
  useAutoFocus(FIELD_IDS.targetDegrees);
  const updateMut = useUpdatePreferences();
  const institutionSearch = useInstitutionOptions();
  const current = preferenceIdsFromApi(preferences);

  const [degrees, setDegrees] = useState<string[]>(current.degrees);
  const [majors, setMajors] = useState<ReferenceOption[]>(() =>
    current.majors.map((id) => ({ id, name: names.major(id) ?? "" })),
  );
  const [institutions, setInstitutions] = useState<ReferenceOption[]>(() =>
    current.institutions.map((id) => ({ id, name: names.institution.exact(id) ?? UNRESOLVED_INSTITUTION_NAME })),
  );

  const isValid = degrees.length > 0 && majors.length > 0;
  const next = { degrees, majors: majors.map((m) => m.id), institutions: institutions.map((i) => i.id) };

  return (
    <SectionCard
      title="Study goals"
      isEditing
      onCancel={onDone}
      onSave={() => updateMut.mutate({ current, next }, { onSuccess: onDone })}
      isSaving={updateMut.isPending}
      saveDisabled={!isValid}
      error={
        updateMut.isError
          ? getErrorMessage(updateMut.error)
          : !isValid
          ? "Pick at least one target degree and one field of study."
          : null
      }
    >
      <div className="flex flex-col gap-5">
        <div id={FIELD_IDS.targetDegrees}>
          <DegreeChecklist selectedIds={degrees} onChange={setDegrees} />
        </div>
        <div id={FIELD_IDS.targetMajors}>
          <MajorMultiSelect label="Target fields of study" required max={MAX_TARGETS} selected={majors} onChange={setMajors} />
        </div>
        <div id={FIELD_IDS.targetInstitutions}>
          <TagSearch<ReferenceOption>
            label="Target institutions"
            hint="optional"
            placeholder="Search institutions you want to apply to…"
            selectedIds={institutions.map((i) => i.id)}
            selectedNames={institutions.map((i) => i.name)}
            items={institutionSearch.options}
            isFetching={institutionSearch.isFetching}
            onSearch={institutionSearch.setQuery}
            onSelect={(inst) => setInstitutions((prev) => [...prev, inst])}
            onRemove={(id) => setInstitutions((prev) => prev.filter((i) => i.id !== id))}
            maxItems={MAX_TARGETS}
            minSearchLength={2}
          />
        </div>
      </div>
    </SectionCard>
  );
}
