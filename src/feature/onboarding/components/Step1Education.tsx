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

export interface Step1ReferenceData {
  educationLevels: RefEducationLevel[];
  isLoading: boolean;
}

interface Step1EducationProps {
  data: EducationData;
  onChange: (data: EducationData) => void;
  onNext: () => void;
  referenceData?: Step1ReferenceData;
}

const FALLBACK_EDUCATION_LEVELS = ["High School", "Undergraduate", "Graduate", "PhD"];

// ─── Reusable search dropdown ─────────────────────────────────────────────────
interface SearchDropdownProps<T extends { id: string; name: string }> {
  label: string;
  required?: boolean;
  selected?: string;
  placeholder?: string;
  icon?: string;
  items: T[];
  isFetching?: boolean;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSelect: (item: T) => void;
  open: boolean;
  onToggle: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  hint?: string;
}

function SearchDropdown<T extends { id: string; name: string }>({
  label, required, selected, placeholder, icon, items, isFetching,
  searchValue, onSearchChange, onSelect, open, onToggle, dropdownRef, hint,
}: SearchDropdownProps<T>) {
  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-on-surface">
        {label} {required && <span className="text-error">*</span>}
        {hint && <span className="text-xs font-normal text-outline ml-1">({hint})</span>}
      </label>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-white text-on-surface flex justify-between items-center hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors text-left shadow-xs cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{icon}</span>}
          <span className={selected ? "text-on-surface font-medium" : "text-on-surface-variant/70"}>
            {selected || placeholder || `Select ${label.toLowerCase()}`}
          </span>
        </div>
        <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 w-full mt-1.5 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 max-h-72 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-neutral-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-400 text-[18px] pl-1">search</span>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="flex-1 py-1.5 text-sm bg-transparent text-on-surface focus:outline-none placeholder:text-neutral-400"
              autoFocus
            />
            {isFetching && <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1" />}
          </div>
          <div className="overflow-y-auto">
            {items.length === 0 && !isFetching ? (
              <div className="p-3 text-center text-xs text-on-surface-variant">No results found</div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-neutral-50 transition-colors text-sm flex items-center justify-between cursor-pointer ${selected === item.name ? "text-primary font-semibold bg-primary/5" : "text-on-surface"}`}
                >
                  <span>{item.name}</span>
                  {selected === item.name && <span className="material-symbols-outlined text-primary text-sm">check</span>}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function Step1Education({ data, onChange, onNext, referenceData }: Step1EducationProps) {
  const [levelOpen, setLevelOpen] = useState(false);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [institutionOpen, setInstitutionOpen] = useState(false);

  const [countrySearch, setCountrySearch] = useState("");
  const [majorSearch, setMajorSearch] = useState("");
  const [institutionSearch, setInstitutionSearch] = useState("");

  const levelRef = useRef<HTMLDivElement>(null);
  const nationalityRef = useRef<HTMLDivElement>(null);
  const institutionRef = useRef<HTMLDivElement>(null);

  const debouncedCountrySearch = useDebounce(countrySearch, 300);
  const debouncedMajorSearch = useDebounce(majorSearch, 300);
  const debouncedInstitutionSearch = useDebounce(institutionSearch, 300);

  const { data: rawCountries = [], isFetching: countriesFetching } = useCountriesSearch(debouncedCountrySearch);
  const countries = rawCountries.map((c) => ({ id: c.id, name: c.nationalityNameEn ?? c.nameEn }));
  const { data: rawMajors = [], isFetching: majorsFetching } = useMajorsSearch(debouncedMajorSearch);
  const majors = rawMajors.map((m) => ({ id: m.id, name: m.nameEn }));
  const { data: rawInstitutions = [], isFetching: institutionsFetching } = useInstitutionsSearch(debouncedInstitutionSearch);
  const institutions = rawInstitutions.map((i) => ({ id: i.id, name: i.nameEn }));

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (levelRef.current && !levelRef.current.contains(e.target as Node)) setLevelOpen(false);
      if (nationalityRef.current && !nationalityRef.current.contains(e.target as Node)) setNationalityOpen(false);
      if (institutionRef.current && !institutionRef.current.contains(e.target as Node)) setInstitutionOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const educationLevels = referenceData?.educationLevels?.length
    ? referenceData.educationLevels.map((l) => ({ id: l.id, name: l.nameEn }))
    : FALLBACK_EDUCATION_LEVELS.map((name, i) => ({ id: String(i), name }));

  const handleSelectLevel = (level: { id: string; name: string }) => {
    onChange({ ...data, educationLevel: level.name, educationLevelId: level.id });
    setLevelOpen(false);
  };

  const handleToggleField = (field: { id: string; name: string }) => {
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
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 pt-8 pb-6 flex flex-col gap-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
          Tell us about your education
        </h1>

        {/* ── Section: Identity & Level ── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Basic Info</h2>

          {/* Nationality */}
          <SearchDropdown
            label="Nationality"
            required
            selected={data.nationality}
            icon="public"
            items={countries}
            isFetching={countriesFetching}
            searchValue={countrySearch}
            onSearchChange={setCountrySearch}
            onSelect={(c) => {
              onChange({ ...data, nationality: c.name, nationalityId: c.id });
              setNationalityOpen(false);
              setCountrySearch("");
            }}
            open={nationalityOpen}
            onToggle={() => setNationalityOpen((p) => !p)}
            dropdownRef={nationalityRef}
          />

          {/* Education Level */}
          <div className="flex flex-col gap-2 relative" ref={levelRef}>
            <label className="text-sm font-medium text-on-surface">
              Education Level <span className="text-error">*</span>
            </label>
            <button
              type="button"
              onClick={() => setLevelOpen((p) => !p)}
              className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-white text-on-surface flex justify-between items-center hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors text-left shadow-xs cursor-pointer"
            >
              <span className={data.educationLevel ? "text-on-surface font-medium" : "text-on-surface-variant/70"}>
                {data.educationLevel || "Select highest level achieved"}
              </span>
              <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${levelOpen ? "rotate-180" : ""}`}>expand_more</span>
            </button>
            {levelOpen && (
              <div className="absolute top-full left-0 w-full mt-1.5 bg-white border border-neutral-200 rounded-lg shadow-xl z-30 overflow-hidden">
                {educationLevels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => handleSelectLevel(level)}
                    className={`w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors text-sm flex items-center justify-between cursor-pointer ${data.educationLevel === level.name ? "text-primary font-semibold bg-primary/5" : "text-on-surface"}`}
                  >
                    <span>{level.name}</span>
                    {data.educationLevel === level.name && <span className="material-symbols-outlined text-primary text-sm">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Section: Institution & Field ── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Institution & Field of Study</h2>

          {/* Institution */}
          <SearchDropdown
            label="Institution"
            hint="optional"
            selected={data.institutionName}
            icon="apartment"
            items={institutions}
            isFetching={institutionsFetching}
            searchValue={institutionSearch}
            onSearchChange={setInstitutionSearch}
            onSelect={(inst) => {
              onChange({ ...data, institutionName: inst.name, institutionId: inst.id });
              setInstitutionOpen(false);
              setInstitutionSearch("");
            }}
            open={institutionOpen}
            onToggle={() => setInstitutionOpen((p) => !p)}
            dropdownRef={institutionRef}
            placeholder="Search for your institution"
          />

          {/* Field of Study */}
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

        {/* ── Section: GPA ── */}
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

        {/* ── Section: Study Period ── */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
            Study Period <span className="text-xs font-normal normal-case text-outline">(optional)</span>
          </h2>

          {/* Is Current toggle */}
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
        <button type="button" disabled aria-disabled="true" className="flex items-center gap-2 text-sm font-medium text-on-surface-variant opacity-40 cursor-not-allowed px-4 py-2 rounded-md">
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
