"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAutoFocus } from "@/src/shared/hooks/useAutoFocus";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useEducationLevels } from "@/src/shared/lib/api/hooks/useReferenceData";
import {
  useInstitutionOptions,
  useMajorOptions,
  type ReferenceOption,
} from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { getGpaScale, isEndBeforeStart, isGpaOutOfRange, type GpaScale } from "@/src/shared/lib/education";
import Button from "@/src/shared/ui/Button";
import { EditActions } from "@/src/shared/ui/EditActions";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import Input from "@/src/shared/ui/Input";
import Select from "@/src/shared/ui/Select";
import { useCreateEducation, useDeleteEducation, useUpdateEducation } from "../../hooks/useProfileQuery";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { educationFormFrom, educationPayloadFrom, type EducationForm } from "../../services/payloads";
import type { ApiEducation } from "../../types/api";
import { FIELD_IDS } from "../common/fieldIds";
import { savedThen } from "../common/saved";
import { useReferenceName } from "@/src/shared/lib/api/hooks/useReferenceName";
import { useTranslations } from "next-intl";

// Labels are profile.education.gpaScales.<value>.
const GPA_SCALE_VALUES = ["OUT_OF_4", "OUT_OF_5", "OUT_OF_100"] as const;

interface EducationRecordFormProps {
  /** The record to edit, or null to add a new one. */
  education: ApiEducation | null;
  names: ReferenceNames;
  onDone: () => void;
}

/** Inline form for adding or editing an education record, shown in place of its entry. */
export function EducationRecordForm({ education, names, onDone }: EducationRecordFormProps) {
  const t = useTranslations("profile.education");
  const { name: refName } = useReferenceName();
  const createMut = useCreateEducation();
  const updateMut = useUpdateEducation();
  const deleteMut = useDeleteEducation();
  useAutoFocus(FIELD_IDS.educationLevel);

  const { data: levels = [] } = useEducationLevels();
  const institutions = useInstitutionOptions();
  const majors = useMajorOptions();
  const minors = useMajorOptions();

  const [form, setForm] = useState<EducationForm>(() => educationFormFrom(education));
  // Display names for the pickers; only the IDs are saved.
  const [labels, setLabels] = useState({
    institution: names.institution.exact(education?.institutionId) ?? "",
    major: names.major.exact(education?.majorId) ?? "",
    minor: names.major.exact(education?.minorMajorId) ?? "",
  });
  const set = (patch: Partial<EducationForm>) => setForm((prev) => ({ ...prev, ...patch }));

  const scale = getGpaScale(form.gpaScale);
  const gpaInvalid = isGpaOutOfRange(form.gpaRaw, form.gpaScale);
  const periodInvalid = isEndBeforeStart(form.startDate, form.isCurrent ? form.expectedGraduationDate : form.endDate);

  const handleSave = () => {
    const payload = educationPayloadFrom(form);
    if (education) updateMut.mutate({ id: education.id, data: payload }, { onSuccess: savedThen(t("recordSaved"), onDone) });
    else createMut.mutate(payload, { onSuccess: savedThen(t("recordAdded"), onDone) });
  };

  const saveMut = education ? updateMut : createMut;
  const error = saveMut.isError ? saveMut.error : deleteMut.isError ? deleteMut.error : null;

  /** Select / clear handlers for a picker: store the ID in the form and the name for display. */
  const pick = (field: keyof typeof labels, idKey: "institutionId" | "majorId" | "minorMajorId") => ({
    onSelect: (item: ReferenceOption) => {
      set({ [idKey]: item.id } as Partial<EducationForm>);
      setLabels((prev) => ({ ...prev, [field]: item.name }));
    },
    onClear: () => {
      set({ [idKey]: "" } as Partial<EducationForm>);
      setLabels((prev) => ({ ...prev, [field]: "" }));
    },
  });

  return (
    <div className="rounded-md border border-neutral-100 p-4">
      <h4 className="mb-4 text-h3 text-neutral-900">{education ? "Edit education" : "Add education"}</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          id={FIELD_IDS.educationLevel}
          label={t("level")}
          value={form.educationLevelId}
          onChange={(e) => set({ educationLevelId: e.target.value })}
          options={[{ value: "", label: t("selectLevel") }, ...levels.map((l) => ({ value: l.id, label: refName(l) }))]}
        />
        <InlineSearch<ReferenceOption>
          id={FIELD_IDS.institution}
          label={t("institution")}
          optional
          selectedName={labels.institution}
          items={institutions.options}
          isFetching={institutions.isFetching}
          onSearch={institutions.setQuery}
          {...pick("institution", "institutionId")}
          minSearchLength={2}
          placeholder={t("searchInstitutions")}
        />
        <InlineSearch<ReferenceOption>
          id={FIELD_IDS.major}
          label={t("fieldOfStudy")}
          selectedName={labels.major}
          items={majors.options}
          isFetching={majors.isFetching}
          onSearch={majors.setQuery}
          {...pick("major", "majorId")}
          minSearchLength={2}
          placeholder={t("searchFields")}
        />
        <InlineSearch<ReferenceOption>
          id={FIELD_IDS.minor}
          label={t("minorOrSecond")}
          optional
          selectedName={labels.minor}
          items={minors.options}
          isFetching={minors.isFetching}
          onSearch={minors.setQuery}
          {...pick("minor", "minorMajorId")}
          minSearchLength={2}
          placeholder={t("searchFields")}
        />
        <Input
          id={FIELD_IDS.gpa}
          label={t("gpa")}
          type="number"
          step={scale.step}
          min="0"
          max={scale.max}
          value={form.gpaRaw}
          onChange={(e) => set({ gpaRaw: e.target.value })}
          error={gpaInvalid ? t("gpaRange", { max: scale.max }) : undefined}
        />
        <Select
          id="profile-edu-scale"
          label={t("gpaScale")}
          value={form.gpaScale}
          onChange={(e) => set({ gpaScale: e.target.value as GpaScale })}
          options={GPA_SCALE_VALUES.map((value) => ({ value, label: t(`gpaScales.${value}`) }))}
        />
        <label className="flex min-h-11 cursor-pointer select-none items-center gap-2 sm:col-span-2 md:min-h-0">
          <input
            type="checkbox"
            checked={form.isCurrent}
            onChange={(e) => set({ isCurrent: e.target.checked })}
            className="size-4 accent-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          />
          <span className="text-body text-neutral-800">{t("currentlyEnrolledCheck")}</span>
        </label>
        <Input
          id={FIELD_IDS.startDate}
          label={t("startDate")}
          type="date"
          value={form.startDate}
          onChange={(e) => set({ startDate: e.target.value })}
        />
        <Input
          id="profile-edu-end"
          label={form.isCurrent ? t("expectedGraduation") : t("endDate")}
          type="date"
          min={form.startDate || undefined}
          value={form.isCurrent ? form.expectedGraduationDate : form.endDate}
          onChange={(e) => set(form.isCurrent ? { expectedGraduationDate: e.target.value } : { endDate: e.target.value })}
          error={periodInvalid ? t("beforeStart") : undefined}
        />
      </div>

      {education && (
        <Button
          type="button"
          variant="destructive"
          className="mt-5"
          disabled={deleteMut.isPending}
          onClick={() => deleteMut.mutate(education.id, { onSuccess: savedThen(t("recordDeleted"), onDone) })}
        >
          <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
          {t("deleteRecord")}
        </Button>
      )}

      <EditActions
        onCancel={onDone}
        onSave={handleSave}
        saveLabel={education ? undefined : t("addEducation")}
        isSaving={saveMut.isPending || deleteMut.isPending}
        saveDisabled={gpaInvalid || periodInvalid}
        error={error ? getErrorMessage(error) : null}
      />
    </div>
  );
}
