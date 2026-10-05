"use client";

import React, { useState, useRef, useEffect } from "react";
import type { PersonalInfoData } from "../types";
import {
  useMaritalStatuses,
  useCountriesSearch,
  useCitiesForCountry,
} from "@/src/shared/lib/api/hooks/useReferenceData";
import { useDebounce } from "@/src/shared/lib/hooks/useDebounce";

interface Props {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  onNext: () => void;
  onSkip: () => void;
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

// ─── Inline search input with auto-dropdown ──────────────────────────────────
interface InlineSearchProps<T extends { id: string; name: string }> {
  label: string;
  hint?: string;
  selectedName?: string;
  placeholder?: string;
  items: T[];
  isFetching?: boolean;
  onSearch: (q: string) => void;
  onSelect: (item: T) => void;
  onClear?: () => void;
  disabled?: boolean;
  filterLocally?: boolean;
  minSearchLength?: number;
}

function InlineSearch<T extends { id: string; name: string }>({
  label, hint, selectedName, placeholder, items, isFetching,
  onSearch, onSelect, onClear, disabled, filterLocally = false, minSearchLength = 1,
}: InlineSearchProps<T>) {
  const [inputValue, setInputValue] = useState(selectedName ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef(onSearch);
  useEffect(() => { onSearchRef.current = onSearch; });

  // Sync display when external selection is cleared (e.g. city reset when country changes)
  useEffect(() => {
    setInputValue(selectedName ?? "");
  }, [selectedName]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setInputValue(selectedName ?? "");
        onSearchRef.current("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedName]);

  const displayItems = filterLocally
    ? items.filter((i) =>
        inputValue.length >= minSearchLength &&
        (i.name ?? "").toLowerCase().includes(inputValue.toLowerCase())
      )
    : items;

  const showDropdown = open && inputValue.length >= minSearchLength;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onSearch(val);
    setOpen(true);
    if (!val) onClear?.();
  };

  const handleSelect = (item: T) => {
    setInputValue(item.name);
    onSelect(item);
    setOpen(false);
    onSearch("");
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
    onClear?.();
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-sm font-medium text-on-surface">
        {label}
        {hint && <span className="text-xs font-normal text-outline ml-1">({hint})</span>}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
          search
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            if (inputValue.length >= minSearchLength) setOpen(true);
          }}
          placeholder={placeholder ?? `Search ${label.toLowerCase()}…`}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant ${
            disabled ? "opacity-50 cursor-not-allowed bg-neutral-50" : ""
          }`}
        />
        {isFetching ? (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 w-full mt-1.5 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {isFetching ? (
            <div className="p-3 text-center text-xs text-on-surface-variant">Searching…</div>
          ) : displayItems.length === 0 ? (
            <div className="p-3 text-center text-xs text-on-surface-variant">No results found</div>
          ) : (
            displayItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-4 py-2.5 hover:bg-neutral-50 transition-colors text-sm flex items-center justify-between cursor-pointer ${
                  selectedName === item.name ? "text-primary font-semibold bg-primary/5" : "text-on-surface"
                }`}
              >
                <span>{item.name}</span>
                {selectedName === item.name && (
                  <span className="material-symbols-outlined text-primary text-sm">check</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function Step1BasicInfo({ data, onChange, onNext, onSkip }: Props) {
  const [countryQuery, setCountryQuery] = useState("");
  const [nationalityQuery, setNationalityQuery] = useState("");
  const debouncedCountryQuery = useDebounce(countryQuery, 300);
  const debouncedNationalityQuery = useDebounce(nationalityQuery, 300);

  const { data: maritalStatuses = [] } = useMaritalStatuses();
  const { data: rawCountries = [], isFetching: countriesFetching } = useCountriesSearch(debouncedCountryQuery);
  const countries = rawCountries.map((c) => ({ id: c.id, name: c.nameEn }));
  const { data: rawNationalities = [], isFetching: nationalitiesFetching } = useCountriesSearch(debouncedNationalityQuery);
  const nationalities = rawNationalities.map((c) => ({ id: c.id, name: c.nationalityNameEn ?? c.nameEn }));
  const { data: rawCities = [], isLoading: loadingCities } = useCitiesForCountry(
    data.countryOfResidenceId ?? ""
  );
  const cities = rawCities.map((c) => ({ id: c.id, name: c.nameEn }));

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 pt-8 pb-24 flex flex-col gap-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
          Tell us about yourself
        </h1>

        {/* ── Name ── */}
        <section className="flex flex-col gap-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-on-surface uppercase tracking-wider"><span className="inline-block w-1 h-4 bg-primary rounded-sm" />Name</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">First Name</label>
              <input
                type="text"
                value={data.firstName ?? ""}
                onChange={(e) => onChange({ ...data, firstName: e.target.value })}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">Last Name</label>
              <input
                type="text"
                value={data.lastName ?? ""}
                onChange={(e) => onChange({ ...data, lastName: e.target.value })}
                placeholder="Enter your last name"
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant"
              />
            </div>
          </div>
        </section>

        {/* ── Location ── */}
        <section className="flex flex-col gap-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-on-surface uppercase tracking-wider"><span className="inline-block w-1 h-4 bg-primary rounded-sm" />Current Location</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InlineSearch<{ id: string; name: string }>
              label="Country of Residence"
              selectedName={data.countryOfResidence}
              placeholder="Search countries…"
              items={countries}
              isFetching={countriesFetching || countryQuery !== debouncedCountryQuery}
              onSearch={setCountryQuery}
              onSelect={(c) =>
                onChange({ ...data, countryOfResidence: c.name, countryOfResidenceId: c.id, currentCity: "", currentCityId: "" })
              }
              onClear={() =>
                onChange({ ...data, countryOfResidence: "", countryOfResidenceId: "", currentCity: "", currentCityId: "" })
              }
            />

            <InlineSearch<{ id: string; name: string }>
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

        {/* ── Personal Details ── */}
        <section className="flex flex-col gap-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-on-surface uppercase tracking-wider"><span className="inline-block w-1 h-4 bg-primary rounded-sm" />Personal Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">Date of Birth</label>
              <input
                type="date"
                value={data.dateOfBirth ?? ""}
                onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <InlineSearch<{ id: string; name: string }>
              label="Nationality"
              selectedName={data.nationality}
              placeholder="Search nationality…"
              items={nationalities}
              isFetching={nationalitiesFetching || nationalityQuery !== debouncedNationalityQuery}
              onSearch={setNationalityQuery}
              onSelect={(n) => onChange({ ...data, nationality: n.name, nationalityId: n.id })}
              onClear={() => onChange({ ...data, nationality: "", nationalityId: "" })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">Gender</label>
              <select
                value={data.gender ?? ""}
                onChange={(e) => onChange({ ...data, gender: e.target.value })}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              >
                <option value="" disabled>Select gender</option>
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">
                Marital Status <span className="text-xs font-normal text-outline">(optional)</span>
              </label>
              <select
                value={data.maritalStatusId ?? ""}
                onChange={(e) => {
                  const ms = maritalStatuses.find((m) => m.id === e.target.value);
                  onChange({ ...data, maritalStatus: ms?.nameEn ?? "", maritalStatusId: e.target.value });
                }}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              >
                <option value="">Select marital status</option>
                {maritalStatuses.map((ms) => (
                  <option key={ms.id} value={ms.id}>{ms.nameEn}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-6 py-4 mt-auto flex justify-between items-center">
        <button
          type="button"
          onClick={onSkip}
          className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2 rounded-md"
        >
          Skip for now
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 text-sm font-semibold rounded-lg px-6 py-2.5 bg-primary text-on-primary hover:opacity-90 shadow-sm cursor-pointer transition-all"
        >
          Next
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </nav>
    </div>
  );
}
