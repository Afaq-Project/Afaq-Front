"use client";

import { useCitiesForCountry } from "@/src/shared/lib/api/hooks/useReferenceData";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import { useCountryOptions } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import type { Option, PersonalInfoData } from "../../types";
import { StepSectionHeading } from "../common/StepSectionHeading";

interface LocationSectionProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export function LocationSection({ data, onChange }: LocationSectionProps) {
  const countries = useCountryOptions();
  const { data: rawCities = [], isLoading: loadingCities } = useCitiesForCountry(
    data.countryOfResidenceId ?? "",
  );
  const cities: Option[] = rawCities.map((c) => ({ id: c.id, name: c.nameEn }));

  // Changing the country invalidates the city.
  const setCountry = (country?: Option) =>
    onChange({
      ...data,
      countryOfResidence: country?.name ?? "",
      countryOfResidenceId: country?.id ?? "",
      currentCity: "",
      currentCityId: "",
    });

  return (
    <section className="flex flex-col gap-5">
      <StepSectionHeading>Current Location</StepSectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InlineSearch<Option>
          label="Country of Residence"
          required
          selectedName={data.countryOfResidence}
          placeholder="Search countries…"
          items={countries.options}
          isFetching={countries.isFetching}
          onSearch={countries.setQuery}
          onSelect={setCountry}
          onClear={() => setCountry(undefined)}
        />

        <InlineSearch<Option>
          label="City"
          hint="optional"
          selectedName={data.currentCity}
          placeholder={data.countryOfResidenceId ? "Search cities…" : "Select country first"}
          items={cities}
          isFetching={loadingCities}
          onSearch={() => {}}
          onSelect={(city) => onChange({ ...data, currentCity: city.name, currentCityId: city.id })}
          onClear={() => onChange({ ...data, currentCity: "", currentCityId: "" })}
          disabled={!data.countryOfResidenceId}
          filterLocally
        />
      </div>
    </section>
  );
}
