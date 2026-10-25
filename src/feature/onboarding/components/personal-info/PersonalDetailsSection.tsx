"use client";

import { useMaritalStatuses } from "@/src/shared/lib/api/hooks/useReferenceData";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import { useCountryOptions } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import type { Option, PersonalInfoData } from "../../types";
import { FieldLabel } from "@/src/shared/ui/FieldLabel";
import { INPUT_CLASS } from "../common/formStyles";
import { StepSectionHeading } from "../common/StepSectionHeading";
import { useReferenceName } from "@/src/shared/lib/api/hooks/useReferenceName";
import { useTranslations } from "next-intl";

// The API's gender values; their labels are onboarding.personal.genders.<value>.
const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"] as const;

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
  const t = useTranslations("onboarding.personal");
  const { name: refName } = useReferenceName();
  const nationalities = useCountryOptions({ asNationality: true });
  const { data: maritalStatuses = [] } = useMaritalStatuses();

  return (
    <section className="flex flex-col gap-5">
      <StepSectionHeading>{t("details")}</StepSectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="onb-dob" required>{t("dateOfBirth")}</FieldLabel>
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
            <p className="text-xs text-error">{t("dobFuture")}</p>
          )}
        </div>

        <InlineSearch<Option>
          label={t("nationality")}
          required
          selectedName={data.nationality}
          placeholder={t("nationalityPlaceholder")}
          items={nationalities.options}
          isFetching={nationalities.isFetching}
          onSearch={nationalities.setQuery}
          onSelect={(n) => onChange({ ...data, nationality: n.name, nationalityId: n.id })}
          onClear={() => onChange({ ...data, nationality: "", nationalityId: "" })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="onb-gender" optional>{t("gender")}</FieldLabel>
          <select
            id="onb-gender"
            value={data.gender ?? ""}
            onChange={(e) => onChange({ ...data, gender: e.target.value })}
            className={INPUT_CLASS}
          >
            <option value="" disabled>{t("genderPlaceholder")}</option>
            {GENDER_OPTIONS.map((value) => (
              <option key={value} value={value}>{t(`genders.${value}`)}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="onb-marital" optional>{t("maritalStatus")}</FieldLabel>
          <select
            id="onb-marital"
            value={data.maritalStatusId ?? ""}
            onChange={(e) => {
              const status = maritalStatuses.find((m) => m.id === e.target.value);
              onChange({ ...data, maritalStatus: status ? refName(status) : "", maritalStatusId: e.target.value });
            }}
            className={INPUT_CLASS}
          >
            <option value="">{t("maritalPlaceholder")}</option>
            {maritalStatuses.map((status) => (
              <option key={status.id} value={status.id}>{refName(status)}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
