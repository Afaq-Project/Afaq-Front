"use client";

import { useState } from "react";
import { useAutoFocus } from "@/src/shared/hooks/useAutoFocus";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useAllCitiesForCountry, useMaritalStatuses } from "@/src/shared/lib/api/hooks/useReferenceData";
import { useCountryOptions, type ReferenceOption } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import Input from "@/src/shared/ui/Input";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import Select from "@/src/shared/ui/Select";
import Textarea from "@/src/shared/ui/Textarea";
import { useUpdatePersonal } from "../../hooks/useProfileQuery";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { nonEmptyFields } from "../../services/payloads";
import type { ApiProfile } from "../../types/api";
import { FIELD_IDS } from "../common/fieldIds";

const GENDER_OPTIONS = [
  { value: "", label: "Select gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

interface BackgroundEditorProps {
  profile?: ApiProfile;
  names: ReferenceNames;
  onDone: () => void;
}

export function BackgroundEditor({ profile, names, onDone }: BackgroundEditorProps) {
  useAutoFocus(FIELD_IDS.nationality);
  const updateMut = useUpdatePersonal();
  const countries = useCountryOptions();
  const nationalities = useCountryOptions({ asNationality: true });
  const { data: maritalStatuses = [] } = useMaritalStatuses();

  const [form, setForm] = useState({
    nationalityId: profile?.nationalityId ?? "",
    countryOfResidenceId: profile?.countryOfResidenceId ?? "",
    currentCityId: profile?.currentCityId ?? "",
    dateOfBirth: profile?.dateOfBirth?.slice(0, 10) ?? "",
    gender: profile?.gender?.toUpperCase() ?? "",
    maritalStatusId: profile?.maritalStatusId ?? "",
    bio: profile?.bio ?? "",
  });
  // Display names for the pickers; only the IDs are saved.
  const [labels, setLabels] = useState({
    nationality: names.nationality.exact(profile?.nationalityId) ?? "",
    country: names.country.exact(profile?.countryOfResidenceId) ?? "",
    city: names.city.exact(profile?.currentCityId) ?? "",
  });
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));
  const setLabel = (patch: Partial<typeof labels>) => setLabels((prev) => ({ ...prev, ...patch }));

  const { data: rawCities = [], isLoading: loadingCities } = useAllCitiesForCountry(form.countryOfResidenceId);
  const cities: ReferenceOption[] = rawCities.map((c) => ({ id: c.id, name: c.nameEn }));

  // Changing the country invalidates the city.
  const setCountry = (country?: ReferenceOption) => {
    set({ countryOfResidenceId: country?.id ?? "", currentCityId: "" });
    setLabel({ country: country?.name ?? "", city: "" });
  };

  return (
    <SectionCard
      title="Background"
      isEditing
      onCancel={onDone}
      onSave={() => updateMut.mutate(nonEmptyFields(form), { onSuccess: onDone })}
      isSaving={updateMut.isPending}
      error={updateMut.isError ? getErrorMessage(updateMut.error) : null}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InlineSearch<ReferenceOption>
          id={FIELD_IDS.nationality}
          label="Nationality"
          selectedName={labels.nationality}
          items={nationalities.options}
          isFetching={nationalities.isFetching}
          onSearch={nationalities.setQuery}
          onSelect={(item) => {
            set({ nationalityId: item.id });
            setLabel({ nationality: item.name });
          }}
          onClear={() => {
            set({ nationalityId: "" });
            setLabel({ nationality: "" });
          }}
          minSearchLength={0}
        />
        <InlineSearch<ReferenceOption>
          id={FIELD_IDS.country}
          label="Country of residence"
          hint="optional"
          selectedName={labels.country}
          items={countries.options}
          isFetching={countries.isFetching}
          onSearch={countries.setQuery}
          onSelect={setCountry}
          onClear={() => setCountry(undefined)}
          minSearchLength={0}
        />
        <InlineSearch<ReferenceOption>
          id={FIELD_IDS.city}
          label="City"
          hint="optional"
          selectedName={labels.city}
          items={cities}
          isFetching={loadingCities}
          onSearch={() => {}}
          onSelect={(item) => {
            set({ currentCityId: item.id });
            setLabel({ city: item.name });
          }}
          onClear={() => {
            set({ currentCityId: "" });
            setLabel({ city: "" });
          }}
          filterLocally
          disabled={!form.countryOfResidenceId}
          minSearchLength={1}
          placeholder={form.countryOfResidenceId ? "Search cities…" : "Select a country first"}
        />
        <Input
          id={FIELD_IDS.dateOfBirth}
          label="Date of birth"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => set({ dateOfBirth: e.target.value })}
        />
        <Select
          id={FIELD_IDS.gender}
          label="Gender"
          value={form.gender}
          onChange={(e) => set({ gender: e.target.value })}
          options={GENDER_OPTIONS}
        />
        <Select
          id={FIELD_IDS.maritalStatus}
          label="Marital status"
          value={form.maritalStatusId}
          onChange={(e) => set({ maritalStatusId: e.target.value })}
          options={[{ value: "", label: "Select status" }, ...maritalStatuses.map((m) => ({ value: m.id, label: m.nameEn }))]}
        />
        <div className="sm:col-span-2">
          <Textarea
            id={FIELD_IDS.bio}
            label="About you"
            rows={3}
            value={form.bio}
            onChange={(e) => set({ bio: e.target.value })}
            className="min-h-20"
          />
        </div>
      </div>
    </SectionCard>
  );
}
