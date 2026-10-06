"use client";

import { useState } from "react";
import { MajorMultiSelect } from "@/src/feature/onboarding/components/education/MajorMultiSelect";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useInstitutionOptions, type ReferenceOption } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import Modal from "@/src/shared/ui/Modal";
import { TagSearch } from "@/src/shared/ui/TagSearch";
import { useUpdatePreferences } from "../../hooks/useProfileQuery";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { preferenceIdsFromApi } from "../../services/preferences";
import type { ApiPreferences } from "../../types/api";
import { ModalActions } from "../common/ModalActions";
import { DegreeChecklist } from "./DegreeChecklist";

const MAX_TARGETS = 5;

interface EditStudyGoalsModalProps {
  preferences?: ApiPreferences;
  names: ReferenceNames;
  onClose: () => void;
}

/** Edits target degrees, majors and institutions. At least one degree and one major are required. */
export function EditStudyGoalsModal({ preferences, names, onClose }: EditStudyGoalsModalProps) {
  const updateMut = useUpdatePreferences();
  const institutionSearch = useInstitutionOptions();
  const current = preferenceIdsFromApi(preferences);

  const [degrees, setDegrees] = useState<string[]>(current.degrees);
  const [majors, setMajors] = useState<ReferenceOption[]>(() =>
    current.majors.map((id) => ({ id, name: names.major(id) ?? "" })),
  );
  const [institutions, setInstitutions] = useState<ReferenceOption[]>(() =>
    current.institutions.map((id) => ({ id, name: names.institution.exact(id) ?? "Name not available yet" })),
  );

  const isValid = degrees.length > 0 && majors.length > 0;

  const handleSave = () =>
    updateMut.mutate(
      {
        current,
        next: { degrees, majors: majors.map((m) => m.id), institutions: institutions.map((i) => i.id) },
      },
      { onSuccess: onClose },
    );

  return (
    <Modal open onClose={onClose} title="Edit Study Goals" className="max-w-2xl">
      <div className="flex flex-col gap-5">
        <DegreeChecklist selectedIds={degrees} onChange={setDegrees} />
        <MajorMultiSelect
          label="Target Fields of Study"
          required
          max={MAX_TARGETS}
          selected={majors}
          onChange={setMajors}
        />
        <TagSearch<ReferenceOption>
          label="Target Institutions"
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
        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          isPending={updateMut.isPending}
          saveDisabled={!isValid}
          error={
            updateMut.isError
              ? getErrorMessage(updateMut.error)
              : !isValid
              ? "Pick at least one target degree and one field of study."
              : null
          }
        />
      </div>
    </Modal>
  );
}
