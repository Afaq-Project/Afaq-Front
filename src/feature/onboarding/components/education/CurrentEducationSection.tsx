"use client";

import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import { useInstitutionOptions } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { fromOptions, toOptions } from "../../services/selection";
import type { EducationData, GpaScale, Option } from "../../types";
import { StepSectionHeading } from "../common/StepSectionHeading";
import { GpaField } from "./GpaField";
import { MajorMultiSelect } from "./MajorMultiSelect";
import { StudyPeriodField } from "./StudyPeriodField";

interface CurrentEducationSectionProps {
  education: EducationData;
  onChange: (education: EducationData) => void;
  educationLevels: Option[];
  loadingLevels: boolean;
  isHighSchool: boolean;
  gpaInvalid: boolean;
  periodInvalid: boolean;
}

export function CurrentEducationSection({
  education,
  onChange,
  educationLevels,
  loadingLevels,
  isHighSchool,
  gpaInvalid,
  periodInvalid,
}: CurrentEducationSectionProps) {
  const institutions = useInstitutionOptions();

  const setFieldsOfStudy = (selected: Option[]) => {
    const { names, ids } = fromOptions(selected);
    onChange({ ...education, fieldsOfStudy: names, fieldIds: ids });
  };

  return (
    <div className="flex flex-col gap-8">
      <StepSectionHeading>Your Education</StepSectionHeading>

      <div className="items-start gap-6 grid grid-cols-1 sm:grid-cols-2">
        <InlineSearch<Option>
          label="Education Level"
          required
          selectedName={education.educationLevel || undefined}
          placeholder="Select highest level achieved"
          items={educationLevels}
          isFetching={loadingLevels}
          onSearch={() => {}}
          onSelect={(level) => onChange({ ...education, educationLevel: level.name, educationLevelId: level.id })}
          onClear={() => onChange({ ...education, educationLevel: "", educationLevelId: "" })}
          filterLocally
          minSearchLength={0}
        />
        <InlineSearch<Option>
          label={isHighSchool ? "School" : "Institution"}
          hint="optional"
          selectedName={education.institutionName}
          placeholder={isHighSchool ? "Search for your school…" : "Search for your institution…"}
          items={institutions.options}
          isFetching={institutions.isFetching}
          onSearch={institutions.setQuery}
          onSelect={(inst) => onChange({ ...education, institutionName: inst.name, institutionId: inst.id })}
          onClear={() => onChange({ ...education, institutionName: "", institutionId: "" })}
          minSearchLength={2}
        />
      </div>

      <div className="items-start gap-6 grid grid-cols-1 sm:grid-cols-2">
        {/* Optional for high school, where students may not have a major yet */}
        <MajorMultiSelect
          label="Field of Study"
          required={!isHighSchool}
          optional={isHighSchool}
          max={2}
          selected={toOptions(education.fieldsOfStudy, education.fieldIds)}
          onChange={setFieldsOfStudy}
        />
        <GpaField
          gpa={education.gpa}
          scale={education.gpaScale}
          invalid={gpaInvalid}
          onChange={(gpa: string, gpaScale: GpaScale) => onChange({ ...education, gpa, gpaScale })}
        />
      </div>

      <StudyPeriodField education={education} invalid={periodInvalid} onChange={onChange} />
    </div>
  );
}
