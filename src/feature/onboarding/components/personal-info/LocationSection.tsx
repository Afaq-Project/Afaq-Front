"use client";

import { useAllCitiesForCountry } from "@/src/shared/lib/api/hooks/useReferenceData";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import { useCountryOptions } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import type { Option, PersonalInfoData } from "../../types";
import { StepSectionHeading } from "../common/StepSectionHeading";
import { useReferenceName } from "@/src/shared/lib/api/hooks/useReferenceName";
import { useTranslations } from "next-intl";

interface LocationSectionProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export function LocationSection({ data, onChange }: LocationSectionProps) {
  const t = useTranslations("onboarding.personal");
  const { name: refName } = useReferenceName();
  const countries = useCountryOptions();
  const { data: rawCities = [], isLoading: loadingCities } = useAllCitiesForCountry(
    data.countryOfResidenceId ?? "",
  );
  const cities: Option[] = rawCities.map((c) => ({ id: c.id, name: refName(c) }));

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
      <StepSectionHeading>{t("location")}</StepSectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InlineSearch<Option>
          label={t("country")}
          required
          selectedName={data.countryOfResidence}
          placeholder={t("countryPlaceholder")}
          items={countries.options}
          isFetching={countries.isFetching}
          onSearch={countries.setQuery}
          onSelect={setCountry}
          onClear={() => setCountry(undefined)}
        />

        <InlineSearch<Option>
          label={t("city")}
          optional
          selectedName={data.currentCity}
          placeholder={data.countryOfResidenceId ? t("cityPlaceholder") : t("cityFirst")}
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
