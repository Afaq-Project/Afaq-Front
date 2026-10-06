"use client";

import { useMaritalStatuses } from "@/src/shared/lib/api/hooks/useReferenceData";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import { useCountryOptions } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import type { Option, PersonalInfoData } from "../../types";
import { FieldLabel } from "../common/FieldLabel";
import { INPUT_CLASS } from "../common/formStyles";
import { StepSectionHeading } from "../common/StepSectionHeading";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

interface PersonalDetailsSectionProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  /** Latest selectable date of birth (today). */
  maxDateOfBirth: string;
  dobInFuture: boolean;
}

export function PersonalDetailsSection({
  data,
  onChange,
  maxDateOfBirth,
  dobInFuture,
}: PersonalDetailsSectionProps) {
  const nationalities = useCountryOptions({ asNationality: true });
  const { data: maritalStatuses = [] } = useMaritalStatuses();

  return (
    <section className="flex flex-col gap-5">
      <StepSectionHeading>Personal Details</StepSectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="onb-dob" required>Date of Birth</FieldLabel>
          <input
            id="onb-dob"
            type="date"
            max={maxDateOfBirth}
            aria-invalid={dobInFuture}
            value={data.dateOfBirth ?? ""}
            onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
            className={INPUT_CLASS}
          />
          {dobInFuture && (
            <p className="text-xs text-error">Date of birth can&apos;t be in the future.</p>
          )}
        </div>

        <InlineSearch<Option>
          label="Nationality"
          required
          selectedName={data.nationality}
          placeholder="Search nationality…"
          items={nationalities.options}
          isFetching={nationalities.isFetching}
          onSearch={nationalities.setQuery}
          onSelect={(n) => onChange({ ...data, nationality: n.name, nationalityId: n.id })}
          onClear={() => onChange({ ...data, nationality: "", nationalityId: "" })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="onb-gender" optional>Gender</FieldLabel>
          <select
            id="onb-gender"
            value={data.gender ?? ""}
            onChange={(e) => onChange({ ...data, gender: e.target.value })}
            className={INPUT_CLASS}
          >
            <option value="" disabled>Select gender</option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="onb-marital" optional>Marital Status</FieldLabel>
          <select
            id="onb-marital"
            value={data.maritalStatusId ?? ""}
            onChange={(e) => {
              const status = maritalStatuses.find((m) => m.id === e.target.value);
              onChange({ ...data, maritalStatus: status?.nameEn ?? "", maritalStatusId: e.target.value });
            }}
            className={INPUT_CLASS}
          >
            <option value="">Select marital status</option>
            {maritalStatuses.map((status) => (
              <option key={status.id} value={status.id}>{status.nameEn}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
