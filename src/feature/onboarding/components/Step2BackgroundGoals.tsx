"use client";

import React, { useState, useRef, useEffect } from "react";
import type { EducationData, PreferencesData, GpaScale } from "../types";
import type { RefEducationLevel } from "@/src/feature/profile/types/api";
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
  educationData: EducationData;
  preferencesData: PreferencesData;
  onEducationChange: (data: EducationData) => void;
  onPreferencesChange: (data: PreferencesData) => void;
  onNext: () => void;
  onBack: () => void;
  referenceData?: Step2ReferenceData;
}

const FALLBACK_EDUCATION_LEVELS = [
  "High School",
  "Undergraduate",
  "Graduate",
  "PhD",
];

// ─── InlineSearch (single-select with dropdown) ──────────────────────────────
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
  label,
  required,
  hint,
  selectedName,
  placeholder,
  items,
  isFetching,
  onSearch,
  onSelect,
  onClear,
  filterLocally = false,
  minSearchLength = 1,
}: InlineSearchProps<T>) {
  const [inputValue, setInputValue] = useState(selectedName ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  });

  useEffect(() => {
    setInputValue(selectedName ?? "");
  }, [selectedName]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
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
        (i.name ?? "").toLowerCase().includes(inputValue.toLowerCase()),
      )
    : items;

  const showDropdown =
    open && (minSearchLength === 0 || inputValue.length >= minSearchLength);

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
    <div className="relative flex flex-col gap-2" ref={containerRef}>
      <label className="font-medium text-on-surface text-sm">
        {label} {required && <span className="text-error">*</span>}
        {hint && (
          <span className="ml-1 text-outline font-normal text-xs">
            ({hint})
          </span>
        )}
      </label>
      <div className="relative">
        <span className="top-1/2 left-3.5 absolute text-[18px] text-on-surface-variant -translate-y-1/2 pointer-events-none material-symbols-outlined">
          search
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            if (minSearchLength === 0) setInputValue("");
            setOpen(true);
          }}
          placeholder={placeholder ?? `Search ${label.toLowerCase()}…`}
          className="bg-white py-3 pr-10 pl-10 border focus:border-primary rounded-lg border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30 w-full text-on-surface placeholder:text-on-surface-variant text-sm transition-all"
        />
        {isFetching ? (
          <div className="top-1/2 right-3.5 absolute border-2 border-primary border-t-transparent rounded-full w-4 h-4 -translate-y-1/2 animate-spin" />
        ) : (
          inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="top-1/2 right-3.5 absolute text-on-surface-variant hover:text-on-surface -translate-y-1/2"
            >
              <span className="text-[18px] material-symbols-outlined">
                close
              </span>
            </button>
          )
        )}
      </div>

      {showDropdown && (
        <div className="top-full left-0 z-50 absolute bg-white shadow-xl mt-1.5 border border-neutral-200 rounded-lg w-full max-h-64 overflow-y-auto">
          {isFetching ? (
            <div className="p-3 text-on-surface-variant text-xs text-center">
              Searching…
            </div>
          ) : displayItems.length === 0 ? (
            <div className="p-3 text-on-surface-variant text-xs text-center">
              No results found
            </div>
          ) : (
            displayItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-4 py-2.5 hover:bg-neutral-50 transition-colors text-sm flex items-center justify-between cursor-pointer ${
                  selectedName === item.name
                    ? "text-primary font-semibold bg-primary/5"
                    : "text-on-surface"
                }`}
              >
                <span>{item.name}</span>
                {selectedName === item.name && (
                  <span className="text-primary text-sm material-symbols-outlined">
                    check
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── TagSearch (multi-select: tags + search dropdown) ────────────────────────
interface TagSearchProps<T extends { id: string; name: string }> {
  label: string;
  hint?: string;
  placeholder?: string;
  selectedIds: string[];
  selectedNames: string[];
  items: T[];
  isFetching?: boolean;
  onSearch: (q: string) => void;
  onSelect: (item: T) => void;
  onRemove: (id: string) => void;
  maxItems?: number;
  minSearchLength?: number;
}

function TagSearch<T extends { id: string; name: string }>({
  label,
  hint,
  placeholder,
  selectedIds,
  selectedNames,
  items,
  isFetching,
  onSearch,
  onSelect,
  onRemove,
  maxItems = 5,
  minSearchLength = 1,
}: TagSearchProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  });

  const isAtMax = selectedIds.length >= maxItems;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setInputValue("");
        onSearchRef.current("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = open && inputValue.length >= minSearchLength;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onSearch(val);
    setOpen(true);
  };

  const handleSelect = (item: T) => {
    if (selectedIds.includes(item.id)) {
      onRemove(item.id);
    } else {
      if (isAtMax) return;
      onSelect(item);
    }
    setInputValue("");
    onSearch("");
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <div className="flex justify-between items-center">
        <label className="font-medium text-on-surface text-sm">
          {label}
          {hint && (
            <span className="ml-1 text-outline font-normal text-xs">
              ({hint})
            </span>
          )}
        </label>
        <span
          className={`text-xs font-medium ${selectedIds.length >= maxItems ? "text-warning font-semibold" : "text-on-surface-variant"}`}
        >
          {selectedIds.length} of {maxItems}
        </span>
      </div>

      <div className="relative">
        <span className="top-1/2 left-3.5 absolute text-[18px] text-on-surface-variant -translate-y-1/2 pointer-events-none material-symbols-outlined">
          search
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            if (inputValue.length >= minSearchLength) setOpen(true);
          }}
          placeholder={
            isAtMax
              ? `Max ${maxItems} selected`
              : (placeholder ?? `Search ${label.toLowerCase()}…`)
          }
          disabled={isAtMax}
          className={`w-full pl-10 pr-10 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant ${
            isAtMax ? "opacity-50 cursor-not-allowed bg-neutral-50" : ""
          }`}
        />
        {isFetching ? (
          <div className="top-1/2 right-3.5 absolute border-2 border-primary border-t-transparent rounded-full w-4 h-4 -translate-y-1/2 animate-spin" />
        ) : inputValue ? (
          <button
            type="button"
            onClick={() => {
              setInputValue("");
              onSearch("");
            }}
            className="top-1/2 right-3.5 absolute text-on-surface-variant hover:text-on-surface -translate-y-1/2"
          >
            <span className="text-[18px] material-symbols-outlined">close</span>
          </button>
        ) : null}

        {showDropdown && (
          <div className="top-full left-0 z-50 absolute bg-white shadow-xl mt-1.5 border border-neutral-200 rounded-lg w-full max-h-64 overflow-y-auto">
            {isFetching ? (
              <div className="p-3 text-on-surface-variant text-xs text-center">
                Searching…
              </div>
            ) : items.length === 0 ? (
              <div className="p-3 text-on-surface-variant text-xs text-center">
                No results found
              </div>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isDisabled = !isSelected && isAtMax;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => !isDisabled && handleSelect(item)}
                    className={`w-full text-left px-4 py-2.5 transition-colors text-sm flex items-center justify-between ${
                      isDisabled
                        ? "opacity-40 cursor-not-allowed"
                        : isSelected
                          ? "text-primary font-semibold bg-primary/5 hover:bg-primary/10 cursor-pointer"
                          : "text-on-surface hover:bg-neutral-50 cursor-pointer"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isSelected && (
                      <span className="text-primary text-sm material-symbols-outlined">
                        check
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(expanded ? selectedNames : selectedNames.slice(0, 1)).map(
            (name, i) => (
              <div
                key={selectedIds[i]}
                className="inline-flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full font-medium text-primary text-sm"
              >
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(selectedIds[i])}
                  className="flex items-center hover:opacity-70"
                >
                  <span className="text-[15px] material-symbols-outlined">
                    close
                  </span>
                </button>
              </div>
            ),
          )}
          {!expanded && selectedNames.length > 1 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full font-medium text-primary text-sm transition-colors"
            >
              +{selectedNames.length - 1}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function Step2Education({
  educationData,
  preferencesData,
  onEducationChange,
  onPreferencesChange,
  onNext,
  onBack,
  referenceData,
}: Props) {
  const [institutionQuery, setInstitutionQuery] = useState("");
  const [majorSearch, setMajorSearch] = useState("");
  const [majorOpen, setMajorOpen] = useState(false);
  const [targetMajorSearch, setTargetMajorSearch] = useState("");
  const [targetMajorOpen, setTargetMajorOpen] = useState(false);
  const [targetCountryQuery, setTargetCountryQuery] = useState("");
  const [targetInstitutionQuery, setTargetInstitutionQuery] = useState("");
  const [fieldsExpanded, setFieldsExpanded] = useState(false);
  const [targetFieldsExpanded, setTargetFieldsExpanded] = useState(false);

  const majorRef = useRef<HTMLDivElement>(null);
  const targetMajorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (majorRef.current && !majorRef.current.contains(e.target as Node)) {
        setMajorOpen(false);
      }
      if (
        targetMajorRef.current &&
        !targetMajorRef.current.contains(e.target as Node)
      ) {
        setTargetMajorOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const debouncedMajorSearch = useDebounce(majorSearch, 300);
  const debouncedTargetMajorSearch = useDebounce(targetMajorSearch, 300);
  const debouncedInstitutionQuery = useDebounce(institutionQuery, 300);
  const debouncedTargetCountryQuery = useDebounce(targetCountryQuery, 300);
  const debouncedTargetInstitutionQuery = useDebounce(
    targetInstitutionQuery,
    300,
  );

  const { data: rawMajors = [], isFetching: majorsFetching } =
    useMajorsSearch(debouncedMajorSearch);
  const majors = rawMajors.map((m) => ({ id: m.id, name: m.nameEn }));
  const { data: rawTargetMajors = [], isFetching: targetMajorsFetching } =
    useMajorsSearch(debouncedTargetMajorSearch);
  const targetMajors = rawTargetMajors.map((m) => ({
    id: m.id,
    name: m.nameEn,
  }));
  const { data: rawInstitutions = [], isFetching: institutionsFetching } =
    useInstitutionsSearch(debouncedInstitutionQuery);
  const institutions = rawInstitutions.map((i) => ({
    id: i.id,
    name: i.nameEn,
  }));
  const { data: rawTargetCountries = [], isFetching: targetCountriesFetching } =
    useCountriesSearch(debouncedTargetCountryQuery);
  const targetCountries = rawTargetCountries.map((c) => ({
    id: c.id,
    name: c.nameEn,
  }));
  const {
    data: rawTargetInstitutions = [],
    isFetching: targetInstitutionsFetching,
  } = useInstitutionsSearch(debouncedTargetInstitutionQuery);
  const targetInstitutions = rawTargetInstitutions.map((i) => ({
    id: i.id,
    name: i.nameEn,
  }));

  const educationLevels = referenceData?.educationLevels?.length
    ? referenceData.educationLevels.map((l) => ({ id: l.id, name: l.nameEn }))
    : FALLBACK_EDUCATION_LEVELS.map((name, i) => ({ id: String(i), name }));

  // ── Education section handlers ──
  const handleToggleField = (field: { id: string; name: string }) => {
    const exists = educationData.fieldsOfStudy.includes(field.name);
    if (exists) {
      onEducationChange({
        ...educationData,
        fieldsOfStudy: educationData.fieldsOfStudy.filter(
          (f) => f !== field.name,
        ),
        fieldIds: (educationData.fieldIds ?? []).filter(
          (id) => id !== field.id,
        ),
      });
    } else {
      if (educationData.fieldsOfStudy.length >= 2) return;
      onEducationChange({
        ...educationData,
        fieldsOfStudy: [...educationData.fieldsOfStudy, field.name],
        fieldIds: [...(educationData.fieldIds ?? []), field.id],
      });
    }
  };

  const handleRemoveField = (fieldName: string) => {
    const idx = educationData.fieldsOfStudy.indexOf(fieldName);
    onEducationChange({
      ...educationData,
      fieldsOfStudy: educationData.fieldsOfStudy.filter((f) => f !== fieldName),
      fieldIds:
        idx >= 0
          ? (educationData.fieldIds ?? []).filter((_, i) => i !== idx)
          : educationData.fieldIds,
    });
  };

  const handleGpaScaleChange = (scale: GpaScale) => {
    if (scale !== educationData.gpaScale)
      onEducationChange({ ...educationData, gpaScale: scale, gpa: "" });
  };

  // ── Preferences section handlers ──
  const handleToggleTargetField = (major: { id: string; name: string }) => {
    const targetFields = preferencesData.targetFields ?? [];
    const targetFieldIds = preferencesData.targetFieldIds ?? [];
    const exists = targetFields.includes(major.name);
    if (exists) {
      const idx = targetFields.indexOf(major.name);
      onPreferencesChange({
        ...preferencesData,
        targetFields: targetFields.filter((f) => f !== major.name),
        targetFieldIds: targetFieldIds.filter((_, i) => i !== idx),
      });
    } else {
      if (targetFields.length >= 5) return;
      onPreferencesChange({
        ...preferencesData,
        targetFields: [...targetFields, major.name],
        targetFieldIds: [...targetFieldIds, major.id],
      });
    }
  };

  const handleRemoveTargetField = (fieldName: string) => {
    const targetFields = preferencesData.targetFields ?? [];
    const targetFieldIds = preferencesData.targetFieldIds ?? [];
    const idx = targetFields.indexOf(fieldName);
    onPreferencesChange({
      ...preferencesData,
      targetFields: targetFields.filter((f) => f !== fieldName),
      targetFieldIds:
        idx >= 0 ? targetFieldIds.filter((_, i) => i !== idx) : targetFieldIds,
    });
  };

  const handleSelectTargetCountry = (c: { id: string; name: string }) => {
    onPreferencesChange({
      ...preferencesData,
      targetCountries: [...(preferencesData.targetCountries ?? []), c.name],
      targetCountryIds: [...(preferencesData.targetCountryIds ?? []), c.id],
    });
  };

  const handleRemoveTargetCountry = (id: string) => {
    const ids = preferencesData.targetCountryIds ?? [];
    const idx = ids.indexOf(id);
    onPreferencesChange({
      ...preferencesData,
      targetCountries: (preferencesData.targetCountries ?? []).filter(
        (_, i) => i !== idx,
      ),
      targetCountryIds: ids.filter((cid) => cid !== id),
    });
  };

  const handleSelectTargetInstitution = (inst: {
    id: string;
    name: string;
  }) => {
    onPreferencesChange({
      ...preferencesData,
      targetInstitutions: [
        ...(preferencesData.targetInstitutions ?? []),
        inst.name,
      ],
      targetInstitutionIds: [
        ...(preferencesData.targetInstitutionIds ?? []),
        inst.id,
      ],
    });
  };

  const handleRemoveTargetInstitution = (id: string) => {
    const ids = preferencesData.targetInstitutionIds ?? [];
    const idx = ids.indexOf(id);
    onPreferencesChange({
      ...preferencesData,
      targetInstitutions: (preferencesData.targetInstitutions ?? []).filter(
        (_, i) => i !== idx,
      ),
      targetInstitutionIds: ids.filter((iid) => iid !== id),
    });
  };

  const isComplete =
    Boolean(educationData.educationLevel) &&
    educationData.fieldsOfStudy.length > 0;

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex flex-col flex-grow gap-10 mx-auto px-6 pt-8 pb-24 w-full max-w-3xl">
        <h1 className="font-semibold text-on-surface text-2xl md:text-3xl tracking-tight">
          Education
        </h1>

        {/* ════ Section 1: Your Education ════ */}
        <div className="flex flex-col gap-8">
          <h2 className="flex items-center gap-2 font-semibold text-on-surface text-sm uppercase tracking-wider">
            <span className="inline-block bg-primary rounded-sm w-1 h-4" />
            Your Education
          </h2>

          {/* Row 1: Education Level | Institution */}
          <div className="items-start gap-6 grid grid-cols-1 sm:grid-cols-2">
            <InlineSearch<{ id: string; name: string }>
              label="Education Level"
              required
              selectedName={educationData.educationLevel || undefined}
              placeholder="Select highest level achieved"
              items={educationLevels}
              onSearch={() => {}}
              onSelect={(level) =>
                onEducationChange({
                  ...educationData,
                  educationLevel: level.name,
                  educationLevelId: level.id,
                })
              }
              onClear={() =>
                onEducationChange({
                  ...educationData,
                  educationLevel: "",
                  educationLevelId: "",
                })
              }
              filterLocally
              minSearchLength={0}
            />
            <InlineSearch<{ id: string; name: string }>
              label="Institution"
              hint="optional"
              selectedName={educationData.institutionName}
              placeholder="Search for your institution…"
              items={institutions}
              isFetching={institutionsFetching}
              onSearch={setInstitutionQuery}
              onSelect={(inst) =>
                onEducationChange({
                  ...educationData,
                  institutionName: inst.name,
                  institutionId: inst.id,
                })
              }
              onClear={() =>
                onEducationChange({
                  ...educationData,
                  institutionName: "",
                  institutionId: "",
                })
              }
              minSearchLength={2}
            />
          </div>

          {/* Row 2: Field of Study | GPA */}
          <div className="items-start gap-6 grid grid-cols-1 sm:grid-cols-2">
            {/* Fields of Study */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="font-medium text-on-surface text-sm">
                  Field of Study <span className="text-error">*</span>
                </label>
                <span
                  className={`text-sm font-medium ${educationData.fieldsOfStudy.length >= 2 ? "text-warning font-semibold" : "text-on-surface-variant"}`}
                >
                  {educationData.fieldsOfStudy.length} of 2
                </span>
              </div>

              <div className="relative" ref={majorRef}>
                <span className="top-1/2 left-3.5 absolute text-on-surface-variant -translate-y-1/2 pointer-events-none material-symbols-outlined">
                  search
                </span>
                <input
                  type="text"
                  value={majorSearch}
                  onChange={(e) => {
                    setMajorSearch(e.target.value);
                    setMajorOpen(true);
                  }}
                  onFocus={() => setMajorOpen(true)}
                  placeholder="Type to search fields of study…"
                  className="bg-white py-3 pr-10 pl-11 border focus:border-primary rounded-lg border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30 w-full text-on-surface placeholder:text-on-surface-variant text-sm transition-all"
                />
                {majorsFetching && (
                  <div className="top-1/2 right-3.5 absolute border-2 border-primary border-t-transparent rounded-full w-4 h-4 -translate-y-1/2 animate-spin" />
                )}
                {majorSearch && !majorsFetching && (
                  <button
                    type="button"
                    onClick={() => {
                      setMajorSearch("");
                      setMajorOpen(false);
                    }}
                    className="top-1/2 right-3.5 absolute text-on-surface-variant hover:text-on-surface -translate-y-1/2"
                  >
                    <span className="text-[18px] material-symbols-outlined">
                      close
                    </span>
                  </button>
                )}

                {majorOpen && debouncedMajorSearch.trim().length >= 2 && (
                  <div className="top-full left-0 z-50 absolute bg-white shadow-xl mt-1.5 border border-neutral-200 rounded-lg w-full max-h-64 overflow-y-auto">
                    {majors.length === 0 && !majorsFetching ? (
                      <div className="p-4 text-on-surface-variant text-sm text-center">
                        No fields found for &ldquo;{debouncedMajorSearch}&rdquo;
                      </div>
                    ) : (
                      majors.map((major) => {
                        const isSelected = educationData.fieldsOfStudy.includes(
                          major.name,
                        );
                        const isDisabled =
                          !isSelected &&
                          educationData.fieldsOfStudy.length >= 2;
                        return (
                          <label
                            key={major.id}
                            className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-neutral-50"}`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isDisabled}
                              onChange={() => handleToggleField(major)}
                              className="rounded border-outline-variant focus:ring-primary w-4 h-4 text-primary cursor-pointer disabled:cursor-not-allowed shrink-0"
                            />
                            <span
                              className={`text-sm ${isSelected ? "font-semibold text-primary" : "text-on-surface"}`}
                            >
                              {major.name}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {educationData.fieldsOfStudy.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(fieldsExpanded
                    ? educationData.fieldsOfStudy
                    : educationData.fieldsOfStudy.slice(0, 1)
                  ).map((field) => (
                    <div
                      key={field}
                      className="inline-flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full font-medium text-primary text-sm"
                    >
                      <span>{field}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(field)}
                        className="flex items-center hover:opacity-70"
                      >
                        <span className="text-[15px] material-symbols-outlined">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                  {!fieldsExpanded &&
                    educationData.fieldsOfStudy.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFieldsExpanded(true)}
                        className="inline-flex items-center bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full font-medium text-primary text-sm transition-colors"
                      >
                        +{educationData.fieldsOfStudy.length - 1}
                      </button>
                    )}
                </div>
              )}
            </div>

            {/* GPA */}
            <div className="flex flex-col gap-3">
              <label className="font-medium text-on-surface text-sm">
                GPA / Grade{" "}
                <span className="text-outline font-normal text-xs">(optional)</span>
              </label>
              <div className="flex sm:flex-row flex-col gap-3">
              <div className="flex-grow">
                {educationData.gpaScale === "letter" ? (
                  <input
                    type="text"
                    value={educationData.gpa ?? ""}
                    onChange={(e) =>
                      onEducationChange({
                        ...educationData,
                        gpa: e.target.value,
                      })
                    }
                    placeholder="e.g. A, B+, First Class"
                    className="bg-white px-4 py-3 border focus:border-transparent rounded-lg placeholder:text-outline border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary w-full text-on-surface text-sm transition-all"
                  />
                ) : educationData.gpaScale === "percent" ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={educationData.gpa ?? ""}
                    onChange={(e) =>
                      onEducationChange({
                        ...educationData,
                        gpa: e.target.value,
                      })
                    }
                    placeholder="e.g. 88.5"
                    className="bg-white px-4 py-3 border focus:border-transparent rounded-lg placeholder:text-outline border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary w-full text-on-surface text-sm transition-all"
                  />
                ) : (
                  <input
                    type="number"
                    min="0"
                    max="4.0"
                    step="0.01"
                    value={educationData.gpa ?? ""}
                    onChange={(e) =>
                      onEducationChange({
                        ...educationData,
                        gpa: e.target.value,
                      })
                    }
                    placeholder="e.g. 3.8"
                    className="bg-white px-4 py-3 border focus:border-transparent rounded-lg placeholder:text-outline border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary w-full text-on-surface text-sm transition-all"
                  />
                )}
              </div>
              <div className="flex self-start sm:self-auto bg-surface-container p-1 border rounded-md border-outline-variant/50">
                {(["4.0", "percent", "letter"] as GpaScale[]).map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => handleGpaScaleChange(scale)}
                    className={`rounded-md px-3 py-2 text-xs whitespace-nowrap transition-all ${educationData.gpaScale === scale ? "bg-primary text-on-primary font-semibold shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
                  >
                    {scale === "4.0"
                      ? "4.0 Scale"
                      : scale === "percent"
                        ? "Percentage"
                        : "Letter"}
                  </button>
                ))}
              </div>
            </div>
            </div>
          </div>

          {/* Study Period */}
          <div className="flex flex-col gap-3">
            <label className="font-medium text-on-surface text-sm">
              Study Period{" "}
              <span className="text-outline font-normal text-xs">(optional)</span>
            </label>
            <label className="flex items-center gap-3 w-fit cursor-pointer">
              <div
                onClick={() =>
                  onEducationChange({
                    ...educationData,
                    isCurrent: !educationData.isCurrent,
                    endDate: educationData.isCurrent
                      ? educationData.endDate
                      : "",
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${educationData.isCurrent ? "bg-primary" : "bg-neutral-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${educationData.isCurrent ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </div>
              <span className="text-on-surface text-sm">
                Currently studying here
              </span>
            </label>
            <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-on-surface-variant text-xs">
                  Start Date
                </label>
                <input
                  type="date"
                  value={educationData.startDate ?? ""}
                  onChange={(e) =>
                    onEducationChange({
                      ...educationData,
                      startDate: e.target.value,
                    })
                  }
                  className="bg-white px-4 py-3 border rounded-lg border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 w-full text-on-surface text-sm transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-on-surface-variant text-xs">
                  {educationData.isCurrent ? "Expected Graduation" : "End Date"}
                </label>
                <input
                  type="date"
                  value={
                    (educationData.isCurrent
                      ? educationData.expectedGraduationDate
                      : educationData.endDate) ?? ""
                  }
                  onChange={(e) => {
                    if (educationData.isCurrent)
                      onEducationChange({
                        ...educationData,
                        expectedGraduationDate: e.target.value,
                      });
                    else
                      onEducationChange({
                        ...educationData,
                        endDate: e.target.value,
                      });
                  }}
                  className="bg-white px-4 py-3 border rounded-lg border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 w-full text-on-surface text-sm transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ════ Section 2: What You're Looking For ════ */}
        <div className="flex flex-col gap-8">
          <h2 className="flex items-center gap-2 font-semibold text-on-surface text-sm uppercase tracking-wider">
            <span className="inline-block bg-primary rounded-sm w-1 h-4" />
            What You&apos;re Looking For
          </h2>

          <div className="items-start gap-6 grid grid-cols-1 sm:grid-cols-2">
            {/* Target Degree Level */}
            <InlineSearch<{ id: string; name: string }>
              label="Target Degree Level"
              hint="optional"
              selectedName={preferencesData.targetDegreeLevel || undefined}
              placeholder="Select degree you want to pursue"
              items={educationLevels}
              onSearch={() => {}}
              onSelect={(level) =>
                onPreferencesChange({
                  ...preferencesData,
                  targetDegreeLevel: level.name,
                  targetDegreeLevelId: level.id,
                })
              }
              onClear={() =>
                onPreferencesChange({
                  ...preferencesData,
                  targetDegreeLevel: "",
                  targetDegreeLevelId: "",
                })
              }
              filterLocally
              minSearchLength={0}
            />

            {/* Target Fields of Study */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="font-medium text-on-surface text-sm">
                  Target Fields of Study{" "}
                  <span className="text-outline font-normal text-xs">
                    (optional)
                  </span>
                </label>
                <span
                  className={`text-sm font-medium ${(preferencesData.targetFields?.length ?? 0) >= 5 ? "text-warning font-semibold" : "text-on-surface-variant"}`}
                >
                  {preferencesData.targetFields?.length ?? 0} of 5
                </span>
              </div>

              <div className="relative" ref={targetMajorRef}>
                <span className="top-1/2 left-3.5 absolute text-on-surface-variant -translate-y-1/2 pointer-events-none material-symbols-outlined">
                  search
                </span>
                <input
                  type="text"
                  value={targetMajorSearch}
                  onChange={(e) => {
                    setTargetMajorSearch(e.target.value);
                    setTargetMajorOpen(true);
                  }}
                  onFocus={() => setTargetMajorOpen(true)}
                  placeholder="Type to search fields of study…"
                  className="bg-white py-3 pr-10 pl-11 border focus:border-primary rounded-lg border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30 w-full text-on-surface placeholder:text-on-surface-variant text-sm transition-all"
                />
                {targetMajorsFetching && (
                  <div className="top-1/2 right-3.5 absolute border-2 border-primary border-t-transparent rounded-full w-4 h-4 -translate-y-1/2 animate-spin" />
                )}
                {targetMajorSearch && !targetMajorsFetching && (
                  <button
                    type="button"
                    onClick={() => {
                      setTargetMajorSearch("");
                      setTargetMajorOpen(false);
                    }}
                    className="top-1/2 right-3.5 absolute text-on-surface-variant hover:text-on-surface -translate-y-1/2"
                  >
                    <span className="text-[18px] material-symbols-outlined">
                      close
                    </span>
                  </button>
                )}

                {targetMajorOpen &&
                  debouncedTargetMajorSearch.trim().length >= 2 && (
                    <div className="top-full left-0 z-50 absolute bg-white shadow-xl mt-1.5 border border-neutral-200 rounded-lg w-full max-h-64 overflow-y-auto">
                      {targetMajors.length === 0 && !targetMajorsFetching ? (
                        <div className="p-4 text-on-surface-variant text-sm text-center">
                          No fields found for &ldquo;
                          {debouncedTargetMajorSearch}&rdquo;
                        </div>
                      ) : (
                        targetMajors.map((major) => {
                          const isSelected = (
                            preferencesData.targetFields ?? []
                          ).includes(major.name);
                          const isDisabled =
                            !isSelected &&
                            (preferencesData.targetFields?.length ?? 0) >= 5;
                          return (
                            <label
                              key={major.id}
                              className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-neutral-50"}`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={isDisabled}
                                onChange={() => handleToggleTargetField(major)}
                                className="rounded border-outline-variant focus:ring-primary w-4 h-4 text-primary cursor-pointer disabled:cursor-not-allowed shrink-0"
                              />
                              <span
                                className={`text-sm ${isSelected ? "font-semibold text-primary" : "text-on-surface"}`}
                              >
                                {major.name}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
              </div>

              {(preferencesData.targetFields?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(targetFieldsExpanded
                    ? (preferencesData.targetFields ?? [])
                    : (preferencesData.targetFields ?? []).slice(0, 1)
                  ).map((field) => (
                    <div
                      key={field}
                      className="inline-flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full font-medium text-primary text-sm"
                    >
                      <span>{field}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTargetField(field)}
                        className="flex items-center hover:opacity-70"
                      >
                        <span className="text-[15px] material-symbols-outlined">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                  {!targetFieldsExpanded &&
                    (preferencesData.targetFields?.length ?? 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => setTargetFieldsExpanded(true)}
                        className="inline-flex items-center bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full font-medium text-primary text-sm transition-colors"
                      >
                        +{(preferencesData.targetFields?.length ?? 0) - 1}
                      </button>
                    )}
                </div>
              )}
            </div>

            {/* Target Countries */}
            <TagSearch<{ id: string; name: string }>
              label="Target Countries"
              hint="optional"
              placeholder="Search countries to study in…"
              selectedIds={preferencesData.targetCountryIds ?? []}
              selectedNames={preferencesData.targetCountries ?? []}
              items={targetCountries}
              isFetching={
                targetCountriesFetching ||
                targetCountryQuery !== debouncedTargetCountryQuery
              }
              onSearch={setTargetCountryQuery}
              onSelect={handleSelectTargetCountry}
              onRemove={handleRemoveTargetCountry}
              maxItems={5}
            />

            {/* Target Institutions */}
            <TagSearch<{ id: string; name: string }>
              label="Target Institutions"
              hint="optional"
              placeholder="Search institutions you want to apply to…"
              selectedIds={preferencesData.targetInstitutionIds ?? []}
              selectedNames={preferencesData.targetInstitutions ?? []}
              items={targetInstitutions}
              isFetching={
                targetInstitutionsFetching ||
                targetInstitutionQuery !== debouncedTargetInstitutionQuery
              }
              onSearch={setTargetInstitutionQuery}
              onSelect={handleSelectTargetInstitution}
              onRemove={handleRemoveTargetInstitution}
              maxItems={5}
              minSearchLength={2}
            />
          </div>
          {/* end 2-col grid */}
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="bottom-0 z-30 sticky flex justify-between items-center bg-white/95 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] backdrop-blur-md mt-auto px-6 py-4 border-neutral-200/80 border-t w-full">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-on-surface-variant hover:text-on-surface text-sm transition-colors"
        >
          <span className="text-[18px] material-symbols-outlined">
            arrow_back
          </span>
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
          className={`flex items-center gap-2 text-sm font-semibold rounded-lg px-6 py-2.5 transition-all ${isComplete ? "bg-primary text-on-primary hover:opacity-90 shadow-sm cursor-pointer" : "bg-primary/40 text-on-primary opacity-50 cursor-not-allowed"}`}
        >
          Next
          <span className="text-[18px] material-symbols-outlined">
            arrow_forward
          </span>
        </button>
      </nav>
    </div>
  );
}
