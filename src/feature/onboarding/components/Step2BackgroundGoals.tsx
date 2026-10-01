"use client";

import React, { useState, useRef, useEffect } from "react";
import type { EducationData, GpaScale } from "../types";
import type { RefCountry, RefEducationLevel, RefMajor, RefInstitution } from "@/src/feature/profile/types/api";
import {
  useCountriesSearch,
  useMajorsSearch,
  useInstitutionsSearch,
} from "@/src/shared/lib/api/hooks/useReferenceData";
import { useDebounce } from "@/src/shared/lib/hooks/useDebounce";

export interface Step2ReferenceData {
  educationLevels: RefEducationLevel[];
  isLoading: boolean;
}

interface Props {
  data: EducationData;
  onChange: (data: EducationData) => void;
  onNext: () => void;
  onBack: () => void;
  referenceData?: Step2ReferenceData;
}

const FALLBACK_EDUCATION_LEVELS = ["High School", "Undergraduate", "Graduate", "PhD"];

// ─── Inline search input with auto-dropdown ──────────────────────────────────
interface InlineSearchProps<T extends { id: string; name: string }> {
  label: string;
  required?: boolean;
  hint?: string;
  selectedName?: string;
  placeholder?: string;
  items: T[];
  isFetching?: boolean;
  onSearch: (q: string) => void;
  onSelect: (item: T) => void;
  onClear?: () => void;
  filterLocally?: boolean;
  minSearchLength?: number;
}

function InlineSearch<T extends { id: string; name: string }>({
  label, required, hint, selectedName, placeholder, items, isFetching,
  onSearch, onSelect, onClear, filterLocally = false, minSearchLength = 1,
}: InlineSearchProps<T>) {
  const [inputValue, setInputValue] = useState(selectedName ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef(onSearch);
  useEffect(() => { onSearchRef.current = onSearch; });

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
        {label} {required && <span className="text-error">*</span>}
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
          className="w-full pl-10 pr-10 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant"
        />
        {isFetching ? (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          inputValue && (
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
export function Step2Education({ data, onChange, onNext, onBack, referenceData }: Props) {
  const [countryQuery, setCountryQuery] = useState("");
  const [institutionQuery, setInstitutionQuery] = useState("");
  const [majorSearch, setMajorSearch] = useState("");

  const debouncedCountryQuery = useDebounce(countryQuery, 300);
  const debouncedMajorSearch = useDebounce(majorSearch, 300);
  const debouncedInstitutionQuery = useDebounce(institutionQuery, 300);

  const { data: rawCountries = [], isFetching: countriesFetching } = useCountriesSearch(debouncedCountryQuery);
  const countries = rawCountries.map((c) => ({ id: c.id, name: c.nationalityNameEn ?? c.nameEn }));
  const { data: majors = [], isFetching: majorsFetching } = useMajorsSearch(debouncedMajorSearch);
  const { data: institutions = [], isFetching: institutionsFetching } = useInstitutionsSearch(debouncedInstitutionQuery);

  const educationLevels = referenceData?.educationLevels?.length
    ? referenceData.educationLevels
    : FALLBACK_EDUCATION_LEVELS.map((name, i) => ({ id: String(i), name }));

  const handleToggleField = (field: RefMajor) => {
    const exists = data.fieldsOfStudy.includes(field.name);
    if (exists) {
      onChange({
        ...data,
        fieldsOfStudy: data.fieldsOfStudy.filter((f) => f !== field.name),
        fieldIds: (data.fieldIds ?? []).filter((id) => id !== field.id),
      });
    } else {
      if (data.fieldsOfStudy.length >= 5) return;
      onChange({
        ...data,
        fieldsOfStudy: [...data.fieldsOfStudy, field.name],
        fieldIds: [...(data.fieldIds ?? []), field.id],
      });
    }
  };

  const handleRemoveField = (fieldName: string) => {
    const idx = data.fieldsOfStudy.indexOf(fieldName);
    onChange({
      ...data,
      fieldsOfStudy: data.fieldsOfStudy.filter((f) => f !== fieldName),
      fieldIds: idx >= 0 ? (data.fieldIds ?? []).filter((_, i) => i !== idx) : data.fieldIds,
    });
  };

  const handleGpaScaleChange = (scale: GpaScale) => {
    if (scale !== data.gpaScale) onChange({ ...data, gpaScale: scale, gpa: "" });
  };

  const isComplete = Boolean(data.educationLevel) && data.fieldsOfStudy.length > 0 && Boolean(data.nationality);

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 pt-8 pb-52 flex flex-col gap-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
          Tell us about your education
        </h1>

        {/* ── Basic Info ── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Basic Info</h2>

          <InlineSearch<{ id: string; name: string }>
            label="Nationality"
            required
            selectedName={data.nationality}
            placeholder="Search your nationality…"
            items={countries}
            isFetching={countriesFetching || countryQuery !== debouncedCountryQuery}
            onSearch={setCountryQuery}
            onSelect={(c) => onChange({ ...data, nationality: c.name, nationalityId: c.id })}
            onClear={() => onChange({ ...data, nationality: "", nationalityId: "" })}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-on-surface">
              Education Level <span className="text-error">*</span>
            </label>
            <select
              value={data.educationLevelId ?? ""}
              onChange={(e) => {
                const level = educationLevels.find((l) => l.id === e.target.value);
                onChange({ ...data, educationLevel: level?.name ?? "", educationLevelId: e.target.value });
              }}
              className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
            >
              <option value="" disabled>Select highest level achieved</option>
              {educationLevels.map((level) => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* ── Institution & Field ── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Institution & Field of Study</h2>

          <InlineSearch<RefInstitution>
            label="Institution"
            hint="optional"
            selectedName={data.institutionName}
            placeholder="Search for your institution…"
            items={institutions}
            isFetching={institutionsFetching}
            onSearch={setInstitutionQuery}
            onSelect={(inst) => onChange({ ...data, institutionName: inst.name, institutionId: inst.id })}
            onClear={() => onChange({ ...data, institutionName: "", institutionId: "" })}
            minSearchLength={2}
          />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-on-surface">
                Field of Study <span className="text-error">*</span>
              </label>
              <span className={`text-sm font-medium ${data.fieldsOfStudy.length >= 5 ? "text-warning font-semibold" : "text-on-surface-variant"}`}>
                {data.fieldsOfStudy.length} of 5
              </span>
            </div>

            {data.fieldsOfStudy.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2.5 border border-outline-variant border-dashed rounded-lg bg-surface-container-low/50">
                {data.fieldsOfStudy.map((field) => (
                  <div key={field} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <span>{field}</span>
                    <button type="button" onClick={() => handleRemoveField(field)} className="hover:opacity-70 flex items-center">
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">search</span>
              <input
                type="text"
                value={majorSearch}
                onChange={(e) => setMajorSearch(e.target.value)}
                placeholder="Type to search fields of study…"
                className="w-full pl-11 pr-10 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant"
              />
              {majorsFetching && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
              {majorSearch && !majorsFetching && (
                <button type="button" onClick={() => setMajorSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <div className="border border-outline-variant rounded-lg overflow-hidden bg-white shadow-xs">
              {debouncedMajorSearch.trim().length < 2 ? (
                <div className="p-5 text-center text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-2xl block mb-1 text-neutral-300">search</span>
                  Type at least 2 characters to search
                </div>
              ) : majors.length === 0 && !majorsFetching ? (
                <div className="p-4 text-center text-sm text-on-surface-variant">No fields found for &ldquo;{debouncedMajorSearch}&rdquo;</div>
              ) : (
                <div className="max-h-52 overflow-y-auto divide-y divide-outline-variant/30">
                  {majors.map((major) => {
                    const isSelected = data.fieldsOfStudy.includes(major.name);
                    const isDisabled = !isSelected && data.fieldsOfStudy.length >= 5;
                    return (
                      <label key={major.id} className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-neutral-50"}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={() => handleToggleField(major)}
                          className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className={`text-sm ${isSelected ? "font-semibold text-primary" : "text-on-surface"}`}>{major.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── GPA ── */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
            GPA / Grade <span className="text-xs font-normal normal-case text-outline">(optional)</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              {data.gpaScale === "letter" ? (
                <input type="text" value={data.gpa ?? ""} onChange={(e) => onChange({ ...data, gpa: e.target.value })}
                  placeholder="e.g. A, B+, First Class"
                  className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline" />
              ) : data.gpaScale === "percent" ? (
                <input type="number" min="0" max="100" step="0.1" value={data.gpa ?? ""} onChange={(e) => onChange({ ...data, gpa: e.target.value })}
                  placeholder="e.g. 88.5"
                  className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline" />
              ) : (
                <input type="number" min="0" max="4.0" step="0.01" value={data.gpa ?? ""} onChange={(e) => onChange({ ...data, gpa: e.target.value })}
                  placeholder="e.g. 3.8"
                  className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline" />
              )}
            </div>
            <div className="flex bg-surface-container p-1 rounded-lg border border-outline-variant/50 self-start sm:self-auto">
              {(["4.0", "percent", "letter"] as GpaScale[]).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => handleGpaScaleChange(scale)}
                  className={`rounded-md px-3 py-2 text-xs whitespace-nowrap transition-all ${data.gpaScale === scale ? "bg-primary-container text-on-primary-container font-semibold shadow-xs" : "text-on-surface-variant hover:bg-surface-container-high"}`}
                >
                  {scale === "4.0" ? "4.0 Scale" : scale === "percent" ? "Percentage" : "Letter"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Study Period ── */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
            Study Period <span className="text-xs font-normal normal-case text-outline">(optional)</span>
          </h2>

          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <div
              onClick={() => onChange({ ...data, isCurrent: !data.isCurrent, endDate: data.isCurrent ? data.endDate : "" })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${data.isCurrent ? "bg-primary" : "bg-neutral-300"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${data.isCurrent ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-on-surface">Currently studying here</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-on-surface-variant">Start Date</label>
              <input
                type="date"
                value={data.startDate ?? ""}
                onChange={(e) => onChange({ ...data, startDate: e.target.value })}
                className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-on-surface-variant">
                {data.isCurrent ? "Expected Graduation" : "End Date"}
              </label>
              <input
                type="date"
                value={(data.isCurrent ? data.expectedGraduationDate : data.endDate) ?? ""}
                onChange={(e) => {
                  if (data.isCurrent) onChange({ ...data, expectedGraduationDate: e.target.value });
                  else onChange({ ...data, endDate: e.target.value });
                }}
                className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-6 py-4 mt-auto flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2 rounded-md"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
          className={`flex items-center gap-2 text-sm font-semibold rounded-lg px-6 py-2.5 transition-all ${isComplete ? "bg-primary text-on-primary hover:opacity-90 shadow-sm cursor-pointer" : "bg-primary/40 text-on-primary opacity-50 cursor-not-allowed"}`}
        >
          Next
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </nav>
    </div>
  );
}
