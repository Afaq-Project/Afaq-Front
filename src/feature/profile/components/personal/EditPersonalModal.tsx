"use client";

import { useState } from "react";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useAllCitiesForCountry, useMaritalStatuses } from "@/src/shared/lib/api/hooks/useReferenceData";
import { useCountryOptions, type ReferenceOption } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import Input from "@/src/shared/ui/Input";
import Modal from "@/src/shared/ui/Modal";
import Select from "@/src/shared/ui/Select";
import { useUpdatePersonal } from "../../hooks/useProfileQuery";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import type { ApiProfile } from "../../types/api";
import { ModalActions } from "../common/ModalActions";

const GENDER_OPTIONS = [
  { value: "", label: "Select gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

interface EditPersonalModalProps {
  profile?: ApiProfile;
  names: ReferenceNames;
  onClose: () => void;
}

/** Edits the personal fields of the profile. Mount it only while open, so it starts from current data. */
export function EditPersonalModal({ profile, names, onClose }: EditPersonalModalProps) {
  const updateMut = useUpdatePersonal();
  const countries = useCountryOptions();
  const nationalities = useCountryOptions({ asNationality: true });
  const { data: maritalStatuses = [] } = useMaritalStatuses();

  const [form, setForm] = useState({
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    dateOfBirth: profile?.dateOfBirth?.slice(0, 10) ?? "",
    phone: profile?.phone ?? "",
    gender: profile?.gender?.toUpperCase() ?? "",
    maritalStatusId: profile?.maritalStatusId ?? "",
    nationalityId: profile?.nationalityId ?? "",
    nationalityName: names.nationality.exact(profile?.nationalityId) ?? "",
    countryOfResidenceId: profile?.countryOfResidenceId ?? "",
    countryOfResidenceName: names.country.exact(profile?.countryOfResidenceId) ?? "",
    currentCityId: profile?.currentCityId ?? "",
    currentCityName: names.city.exact(profile?.currentCityId) ?? "",
    bio: profile?.bio ?? "",
  });
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const { data: rawCities = [], isLoading: loadingCities } = useAllCitiesForCountry(form.countryOfResidenceId);
  const cities: ReferenceOption[] = rawCities.map((c) => ({ id: c.id, name: c.nameEn }));

  // Changing the country invalidates the city.
  const setCountry = (country?: ReferenceOption) =>
    set({
      countryOfResidenceId: country?.id ?? "",
      countryOfResidenceName: country?.name ?? "",
      currentCityId: "",
      currentCityName: "",
    });

  const handleSave = () => {
    // Empty fields are left out: the API keeps their current values.
    updateMut.mutate(
      {
        ...(form.firstName && { firstName: form.firstName }),
        ...(form.lastName && { lastName: form.lastName }),
        ...(form.dateOfBirth && { dateOfBirth: form.dateOfBirth }),
        ...(form.phone && { phone: form.phone }),
        ...(form.gender && { gender: form.gender }),
        ...(form.maritalStatusId && { maritalStatusId: form.maritalStatusId }),
        ...(form.nationalityId && { nationalityId: form.nationalityId }),
        ...(form.countryOfResidenceId && { countryOfResidenceId: form.countryOfResidenceId }),
        ...(form.currentCityId && { currentCityId: form.currentCityId }),
        ...(form.bio && { bio: form.bio }),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal open onClose={onClose} title="Edit Personal Details">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input id="p-fname" label="First Name" value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} />
          <Input id="p-lname" label="Last Name" value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="p-dob"
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => set({ dateOfBirth: e.target.value })}
          />
          <Input id="p-phone" label="Phone" value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            id="p-gender"
            label="Gender"
            value={form.gender}
            onChange={(e) => set({ gender: e.target.value })}
            options={GENDER_OPTIONS}
          />
          <Select
            id="p-marital"
            label="Marital Status"
            value={form.maritalStatusId}
            onChange={(e) => set({ maritalStatusId: e.target.value })}
            options={[
              { value: "", label: "Select status" },
              ...maritalStatuses.map((m) => ({ value: m.id, label: m.nameEn })),
            ]}
          />
        </div>
        <InlineSearch<ReferenceOption>
          label="Nationality"
          hint="optional"
          selectedName={form.nationalityName}
          items={nationalities.options}
          isFetching={nationalities.isFetching}
          onSearch={nationalities.setQuery}
          onSelect={(item) => set({ nationalityId: item.id, nationalityName: item.name })}
          onClear={() => set({ nationalityId: "", nationalityName: "" })}
          minSearchLength={0}
        />
        <InlineSearch<ReferenceOption>
          label="Country of Residence"
          hint="optional"
          selectedName={form.countryOfResidenceName}
          items={countries.options}
          isFetching={countries.isFetching}
          onSearch={countries.setQuery}
          onSelect={setCountry}
          onClear={() => setCountry(undefined)}
          minSearchLength={0}
        />
        <InlineSearch<ReferenceOption>
          label="City"
          hint="optional"
          selectedName={form.currentCityName}
          items={cities}
          isFetching={loadingCities}
          onSearch={() => {}}
          onSelect={(item) => set({ currentCityId: item.id, currentCityName: item.name })}
          onClear={() => set({ currentCityId: "", currentCityName: "" })}
          filterLocally
          disabled={!form.countryOfResidenceId}
          minSearchLength={1}
          placeholder="Search city…"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-bio" className="font-medium text-neutral-800 text-xs">
            Bio
          </label>
          <textarea
            id="p-bio"
            rows={3}
            value={form.bio}
            onChange={(e) => set({ bio: e.target.value })}
            className="px-3 py-2 rounded-sm border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
          />
        </div>
        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          isPending={updateMut.isPending}
          error={updateMut.isError ? getErrorMessage(updateMut.error) : null}
        />
      </div>
    </Modal>
  );
}
