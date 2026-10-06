"use client";

import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import { TagSearch } from "@/src/shared/ui/TagSearch";
import { useCountryOptions, useInstitutionOptions } from "../../hooks/useReferenceOptions";
import { fromOptions, toOptions } from "../../services/selection";
import type { Option, PreferencesData } from "../../types";
import { StepSectionHeading } from "../common/StepSectionHeading";
import { MajorMultiSelect } from "./MajorMultiSelect";

const MAX_TARGETS = 5;

interface StudyGoalsSectionProps {
  preferences: PreferencesData;
  onChange: (preferences: PreferencesData) => void;
  educationLevels: Option[];
  loadingLevels: boolean;
}

export function StudyGoalsSection({ preferences, onChange, educationLevels, loadingLevels }: StudyGoalsSectionProps) {
  const countries = useCountryOptions();
  const institutions = useInstitutionOptions();

  const countryOptions = toOptions(preferences.targetCountries, preferences.targetCountryIds);
  const institutionOptions = toOptions(preferences.targetInstitutions, preferences.targetInstitutionIds);

  const setTargetFields = (selected: Option[]) => {
    const { names, ids } = fromOptions(selected);
    onChange({ ...preferences, targetFields: names, targetFieldIds: ids });
  };

  const setTargetCountries = (selected: Option[]) => {
    const { names, ids } = fromOptions(selected);
    onChange({ ...preferences, targetCountries: names, targetCountryIds: ids });
  };

  const setTargetInstitutions = (selected: Option[]) => {
    const { names, ids } = fromOptions(selected);
    onChange({ ...preferences, targetInstitutions: names, targetInstitutionIds: ids });
  };

  return (
    <div className="flex flex-col gap-8">
      <StepSectionHeading>What You&apos;re Looking For</StepSectionHeading>

      <div className="items-start gap-6 grid grid-cols-1 sm:grid-cols-2">
        <InlineSearch<Option>
          label="Target Degree Level"
          required
          selectedName={preferences.targetDegreeLevel || undefined}
          placeholder="Select degree you want to pursue"
          items={educationLevels}
          isFetching={loadingLevels}
          onSearch={() => {}}
          onSelect={(level) =>
            onChange({ ...preferences, targetDegreeLevel: level.name, targetDegreeLevelId: level.id })
          }
          onClear={() => onChange({ ...preferences, targetDegreeLevel: "", targetDegreeLevelId: "" })}
          filterLocally
          minSearchLength={0}
        />

        <MajorMultiSelect
          label="Target Fields of Study"
          required
          max={MAX_TARGETS}
          selected={toOptions(preferences.targetFields, preferences.targetFieldIds)}
          onChange={setTargetFields}
        />

        {/* Not saved yet: the API has no endpoint for target countries. */}
        <TagSearch<Option>
          label="Target Countries"
          hint="optional"
          placeholder="Search countries to study in…"
          selectedIds={preferences.targetCountryIds ?? []}
          selectedNames={preferences.targetCountries ?? []}
          items={countries.options}
          isFetching={countries.isFetching}
          onSearch={countries.setQuery}
          onSelect={(c) => setTargetCountries([...countryOptions, c])}
          onRemove={(id) => setTargetCountries(countryOptions.filter((c) => c.id !== id))}
          maxItems={MAX_TARGETS}
        />

        <TagSearch<Option>
          label="Target Institutions"
          hint="optional"
          placeholder="Search institutions you want to apply to…"
          selectedIds={preferences.targetInstitutionIds ?? []}
          selectedNames={preferences.targetInstitutions ?? []}
          items={institutions.options}
          isFetching={institutions.isFetching}
          onSearch={institutions.setQuery}
          onSelect={(inst) => setTargetInstitutions([...institutionOptions, inst])}
          onRemove={(id) => setTargetInstitutions(institutionOptions.filter((i) => i.id !== id))}
          maxItems={MAX_TARGETS}
          minSearchLength={2}
        />
      </div>
    </div>
  );
}
