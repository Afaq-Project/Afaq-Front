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
import { preferenceIdsFromApi } from "../../services/preferences";
import type { ApiPreferences } from "../../types/api";
import { FIELD_IDS } from "../common/fieldIds";
import { DegreeChecklist } from "./DegreeChecklist";
import { savedThen } from "../common/saved";
import { useTranslations } from "next-intl";

const MAX_TARGETS = 5;

interface StudyGoalsEditorProps {
  preferences?: ApiPreferences;
  names: ReferenceNames;
  onDone: () => void;
}

/** Edits target degrees, majors and institutions. At least one degree and one major are required. */
export function StudyGoalsEditor({ preferences, names, onDone }: StudyGoalsEditorProps) {
  const t = useTranslations("profile");
  useAutoFocus(FIELD_IDS.targetDegrees);
  const updateMut = useUpdatePreferences();
  const institutionSearch = useInstitutionOptions();
  const current = preferenceIdsFromApi(preferences);

  const [degrees, setDegrees] = useState<string[]>(current.degrees);
  const [majors, setMajors] = useState<ReferenceOption[]>(() =>
    current.majors.map((id) => ({ id, name: names.major(id) ?? "" })),
  );
  const [institutions, setInstitutions] = useState<ReferenceOption[]>(() =>
    current.institutions.map((id) => ({ id, name: names.institution.exact(id) ?? t("unresolvedInstitution") })),
  );

  const isValid = degrees.length > 0 && majors.length > 0;
  const next = { degrees, majors: majors.map((m) => m.id), institutions: institutions.map((i) => i.id) };

  return (
    <SectionCard
      title={t("goals.title")}
      isEditing
      onCancel={onDone}
      onSave={() => updateMut.mutate({ current, next }, { onSuccess: savedThen(t("goals.saved"), onDone) })}
      isSaving={updateMut.isPending}
      saveDisabled={!isValid}
      error={
        updateMut.isError
          ? getErrorMessage(updateMut.error)
          : !isValid
          ? t("goals.needDegreeAndField")
          : null
      }
    >
      <div className="flex flex-col gap-5">
        <div id={FIELD_IDS.targetDegrees}>
          <DegreeChecklist selectedIds={degrees} onChange={setDegrees} />
        </div>
        <div id={FIELD_IDS.targetMajors}>
          <MajorMultiSelect label={t("goals.targetFields")} required max={MAX_TARGETS} selected={majors} onChange={setMajors} />
        </div>
        <div id={FIELD_IDS.targetInstitutions}>
          <TagSearch<ReferenceOption>
            label={t("goals.targetInstitutions")}
            optional
            placeholder={t("goals.searchInstitutions")}
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
