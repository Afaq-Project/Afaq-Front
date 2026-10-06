"use client";

import { useState } from "react";
import { DEFAULT_GPA_SCALE, getGpaScale } from "@/src/shared/lib/education";
import type { GpaScale } from "@/src/feature/onboarding/types";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useEducationLevels } from "@/src/shared/lib/api/hooks/useReferenceData";
import {
  useInstitutionOptions,
  useMajorOptions,
  type ReferenceOption,
} from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import Input from "@/src/shared/ui/Input";
import Modal from "@/src/shared/ui/Modal";
import Select from "@/src/shared/ui/Select";
import { useCreateEducation, useUpdateEducation } from "../../hooks/useProfileQuery";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import type { ApiEducation, CreateEducationPayload } from "../../types/api";
import { ModalActions } from "../common/ModalActions";

const GPA_SCALE_OPTIONS = [
  { value: "OUT_OF_4", label: "/ 4.0" },
  { value: "OUT_OF_5", label: "/ 5.0" },
  { value: "OUT_OF_100", label: "%" },
];

interface EditEducationModalProps {
  /** The record to edit, or null to add a new one. */
  education: ApiEducation | null;
  names: ReferenceNames;
  onClose: () => void;
}

/** Adds or edits an education record. Mount it only while open, so it starts from current data. */
export function EditEducationModal({ education, names, onClose }: EditEducationModalProps) {
  const createMut = useCreateEducation();
  const updateMut = useUpdateEducation();
  const isEdit = education !== null;

  const { data: levels = [] } = useEducationLevels();
  const institutions = useInstitutionOptions();
  const majors = useMajorOptions();
  const minors = useMajorOptions();

  const [form, setForm] = useState({
    educationLevelId: education?.educationLevelId ?? "",
    institutionId: education?.institutionId ?? "",
    institutionName: names.institution.exact(education?.institutionId) ?? "",
    majorId: education?.majorId ?? "",
    majorName: names.major.exact(education?.majorId) ?? "",
    minorMajorId: education?.minorMajorId ?? "",
    minorMajorName: names.major.exact(education?.minorMajorId) ?? "",
    gpaRaw: education?.gpaRaw?.toString() ?? "",
    gpaScale: (education?.gpaScale as GpaScale | undefined) ?? DEFAULT_GPA_SCALE,
    isCurrent: education?.isCurrent ?? false,
    startDate: education?.startDate?.slice(0, 10) ?? "",
    endDate: education?.endDate?.slice(0, 10) ?? "",
    expectedGraduationDate: education?.expectedGraduationDate?.slice(0, 10) ?? "",
  });
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const scale = getGpaScale(form.gpaScale);
  const gpaValue = form.gpaRaw ? Number(form.gpaRaw) : undefined;
  const gpaInvalid = gpaValue !== undefined && (Number.isNaN(gpaValue) || gpaValue < 0 || gpaValue > scale.max);
  const periodEnd = form.isCurrent ? form.expectedGraduationDate : form.endDate;
  const periodInvalid = Boolean(form.startDate && periodEnd && periodEnd < form.startDate);

  const handleSave = () => {
    // Empty fields are left out: the API keeps their current values.
    const payload: CreateEducationPayload = {
      ...(form.educationLevelId && { educationLevelId: form.educationLevelId }),
      ...(form.institutionId && { institutionId: form.institutionId }),
      ...(form.majorId && { majorId: form.majorId }),
      ...(form.minorMajorId && { minorMajorId: form.minorMajorId }),
      ...(form.gpaRaw && { gpaRaw: parseFloat(form.gpaRaw), gpaScale: form.gpaScale }),
      isCurrent: form.isCurrent,
      ...(form.startDate && { startDate: form.startDate }),
      ...(!form.isCurrent && form.endDate && { endDate: form.endDate }),
      ...(form.isCurrent && form.expectedGraduationDate && { expectedGraduationDate: form.expectedGraduationDate }),
    };

    if (education) {
      updateMut.mutate({ id: education.id, data: payload }, { onSuccess: onClose });
    } else {
      createMut.mutate(payload, { onSuccess: onClose });
    }
  };

  const mutation = isEdit ? updateMut : createMut;

  return (
    <Modal open onClose={onClose} title={isEdit ? "Edit Education" : "Add Education"}>
      <div className="flex flex-col gap-4">
        <Select
          id="edu-level"
          label="Education Level"
          value={form.educationLevelId}
          onChange={(e) => set({ educationLevelId: e.target.value })}
          options={[{ value: "", label: "Select level" }, ...levels.map((l) => ({ value: l.id, label: l.nameEn }))]}
        />
        <InlineSearch<ReferenceOption>
          label="Institution"
          hint="optional"
          selectedName={form.institutionName}
          items={institutions.options}
          isFetching={institutions.isFetching}
          onSearch={institutions.setQuery}
          onSelect={(item) => set({ institutionId: item.id, institutionName: item.name })}
          onClear={() => set({ institutionId: "", institutionName: "" })}
          minSearchLength={2}
          placeholder="Type to search institution…"
        />
        <InlineSearch<ReferenceOption>
          label="Field of Study"
          hint="optional"
          selectedName={form.majorName}
          items={majors.options}
          isFetching={majors.isFetching}
          onSearch={majors.setQuery}
          onSelect={(item) => set({ majorId: item.id, majorName: item.name })}
          onClear={() => set({ majorId: "", majorName: "" })}
          minSearchLength={2}
          placeholder="Type to search major…"
        />
        <InlineSearch<ReferenceOption>
          label="Minor / Secondary Field"
          hint="optional"
          selectedName={form.minorMajorName}
          items={minors.options}
          isFetching={minors.isFetching}
          onSearch={minors.setQuery}
          onSelect={(item) => set({ minorMajorId: item.id, minorMajorName: item.name })}
          onClear={() => set({ minorMajorId: "", minorMajorName: "" })}
          minSearchLength={2}
          placeholder="Type to search minor…"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="edu-gpa"
            label="GPA / Grade"
            type="number"
            step={scale.step}
            min="0"
            max={scale.max}
            value={form.gpaRaw}
            onChange={(e) => set({ gpaRaw: e.target.value })}
            error={gpaInvalid ? `Enter a value between 0 and ${scale.max}.` : undefined}
          />
          <Select
            id="edu-scale"
            label="Scale"
            value={form.gpaScale}
            onChange={(e) => set({ gpaScale: e.target.value as GpaScale })}
            options={GPA_SCALE_OPTIONS}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.isCurrent}
            onChange={(e) => set({ isCurrent: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-neutral-700">Currently enrolled</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="edu-start"
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
          />
          {form.isCurrent ? (
            <Input
              id="edu-expected"
              label="Expected Graduation"
              type="date"
              min={form.startDate || undefined}
              value={form.expectedGraduationDate}
              onChange={(e) => set({ expectedGraduationDate: e.target.value })}
              error={periodInvalid ? "Can't be before the start date." : undefined}
            />
          ) : (
            <Input
              id="edu-end"
              label="End Date"
              type="date"
              min={form.startDate || undefined}
              value={form.endDate}
              onChange={(e) => set({ endDate: e.target.value })}
              error={periodInvalid ? "Can't be before the start date." : undefined}
            />
          )}
        </div>
        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          isPending={mutation.isPending}
          saveLabel={isEdit ? "Save changes" : "Add education"}
          saveDisabled={gpaInvalid || periodInvalid}
          error={mutation.isError ? getErrorMessage(mutation.error) : null}
        />
      </div>
    </Modal>
  );
}
