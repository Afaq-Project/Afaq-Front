"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import type { EducationData } from "../types";

interface Step1EducationProps {
  data: EducationData;
  onChange: (data: EducationData) => void;
  onNext: () => void;
}

const EDUCATION_LEVELS = [
  "High School",
  "Undergraduate",
  "Graduate",
  "PhD",
];

const STUDY_CATEGORIES: { category: string; fields: string[] }[] = [
  {
    category: "Tech & Engineering",
    fields: [
      "Computer Science",
      "Software Engineering",
      "Data Analytics",
      "Information Systems",
      "Cybersecurity",
      "Artificial Intelligence",
    ],
  },
  {
    category: "Business & Economics",
    fields: [
      "Business Administration",
      "Finance",
      "Marketing",
      "Economics",
      "Accounting",
      "International Business",
    ],
  },
  {
    category: "Arts & Humanities",
    fields: [
      "Graphic Design",
      "Literature",
      "History",
      "Philosophy",
      "Journalism",
      "Digital Media",
    ],
  },
  {
    category: "Science & Mathematics",
    fields: [
      "Physics",
      "Biology",
      "Chemistry",
      "Mathematics",
      "Statistics",
      "Biotechnology",
    ],
  },
];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
  "Bahrain", "Bangladesh", "Belgium", "Brazil", "Canada", "Chile", "China",
  "Colombia", "Denmark", "Egypt", "Finland", "France", "Germany", "Greece",
  "India", "Indonesia", "Iraq", "Ireland", "Italy", "Japan", "Jordan",
  "Kuwait", "Lebanon", "Malaysia", "Mexico", "Morocco", "Netherlands",
  "New Zealand", "Norway", "Oman", "Pakistan", "Palestine", "Philippines",
  "Poland", "Qatar", "Saudi Arabia", "Singapore", "South Africa", "South Korea",
  "Spain", "Sweden", "Switzerland", "Syria", "Tunisia", "Turkey", "United Arab Emirates",
  "United Kingdom", "United States", "Yemen"
];

const POPULAR_COUNTRIES = [
  "Jordan",
  "Palestine",
  "Saudi Arabia",
  "Egypt",
  "United Arab Emirates",
  "Kuwait",
  "Qatar",
  "Lebanon",
  "Syria",
  "Iraq",
  "United States",
  "United Kingdom",
];

export function Step1Education({ data, onChange, onNext }: Step1EducationProps) {
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [nationalityDropdownOpen, setNationalityDropdownOpen] = useState(false);
  const [searchFieldQuery, setSearchFieldQuery] = useState("");
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Tech & Engineering": true,
  });

  const levelDropdownRef = useRef<HTMLDivElement>(null);
  const nationalityDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(e.target as Node)) {
        setLevelDropdownOpen(false);
      }
      if (nationalityDropdownRef.current && !nationalityDropdownRef.current.contains(e.target as Node)) {
        setNationalityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (catName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const handleSelectLevel = (level: string) => {
    onChange({ ...data, educationLevel: level });
    setLevelDropdownOpen(false);
  };

  const handleToggleField = (field: string) => {
    const exists = data.fieldsOfStudy.includes(field);
    if (exists) {
      onChange({
        ...data,
        fieldsOfStudy: data.fieldsOfStudy.filter((f) => f !== field),
      });
    } else {
      if (data.fieldsOfStudy.length >= 5) return;
      onChange({
        ...data,
        fieldsOfStudy: [...data.fieldsOfStudy, field],
      });
    }
  };

  const handleRemoveField = (field: string) => {
    onChange({
      ...data,
      fieldsOfStudy: data.fieldsOfStudy.filter((f) => f !== field),
    });
  };

  const handleSelectNationality = (country: string) => {
    onChange({ ...data, nationality: country });
    setNationalityDropdownOpen(false);
    setCountrySearchQuery("");
  };

  // Filter fields based on search query
  const filteredCategories = useMemo(() => {
    if (!searchFieldQuery.trim()) return STUDY_CATEGORIES;
    const query = searchFieldQuery.toLowerCase();
    return STUDY_CATEGORIES.map((cat) => ({
      ...cat,
      fields: cat.fields.filter((f) => f.toLowerCase().includes(query)),
    })).filter((cat) => cat.fields.length > 0);
  }, [searchFieldQuery]);

  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) return COUNTRIES;
    return COUNTRIES.filter((c) =>
      c.toLowerCase().includes(countrySearchQuery.toLowerCase())
    );
  }, [countrySearchQuery]);

  // Validation: all 3 fields required
  const isComplete =
    Boolean(data.educationLevel) &&
    data.fieldsOfStudy.length > 0 &&
    Boolean(data.nationality);

  return (
    <div className="flex flex-col flex-grow min-h-[calc(100vh-10rem)]">
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-8 flex flex-col">
        <h1 className="text-2xl md:text-3xl lg:text-[34px] font-semibold text-on-surface mb-8 tracking-tight">
          Tell us about your education
        </h1>

        <form
          className="space-y-8 flex-grow"
          onSubmit={(e) => {
            e.preventDefault();
            if (isComplete) onNext();
          }}
        >
          {/* Education Level (Single Select) */}
          <div className="flex flex-col gap-2 relative" ref={levelDropdownRef}>
            <label
              htmlFor="education-level"
              className="text-xs md:text-sm font-medium text-on-surface"
            >
              Education Level <span className="text-error">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                id="education-level"
                aria-haspopup="listbox"
                aria-expanded={levelDropdownOpen}
                onClick={() => setLevelDropdownOpen((prev) => !prev)}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-white text-on-surface flex justify-between items-center hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors text-left shadow-xs cursor-pointer"
              >
                <span
                  className={
                    data.educationLevel
                      ? "text-on-surface font-medium"
                      : "text-on-surface-variant/70"
                  }
                >
                  {data.educationLevel || "Select highest level achieved"}
                </span>
                <span
                  className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                    levelDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>

              {levelDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute top-full left-0 w-full mt-1.5 bg-white border border-neutral-200 rounded-lg shadow-xl z-30 overflow-hidden"
                >
                  {EDUCATION_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      role="option"
                      aria-selected={data.educationLevel === level}
                      onClick={() => handleSelectLevel(level)}
                      className={`w-full text-left px-4 py-3 hover:bg-neutral-100 transition-colors text-sm md:text-base flex items-center justify-between cursor-pointer ${
                        data.educationLevel === level
                          ? "bg-primary-50 text-primary font-semibold"
                          : "text-on-surface"
                      }`}
                    >
                      <span>{level}</span>
                      {data.educationLevel === level && (
                        <span className="material-symbols-outlined text-primary text-sm">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Field of Study (Multi-select Tag Picker) */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-xs md:text-sm font-medium text-on-surface">
                Field of Study <span className="text-error">*</span>
              </label>
              <span
                className={`text-xs md:text-sm font-medium ${
                  data.fieldsOfStudy.length >= 5
                    ? "text-warning font-semibold"
                    : "text-on-surface-variant"
                }`}
              >
                {data.fieldsOfStudy.length} of 5 selected
              </span>
            </div>

            {/* Selected Chips Area */}
            <div className="flex flex-wrap gap-2 min-h-[48px] p-2.5 border border-outline-variant border-dashed rounded-lg bg-surface-container-low/50 items-center">
              {data.fieldsOfStudy.length === 0 ? (
                <span className="text-xs md:text-sm text-on-surface-variant/60 italic pl-1">
                  Select up to 5 fields from the categories below or search
                </span>
              ) : (
                data.fieldsOfStudy.map((field) => (
                  <div
                    key={field}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs md:text-sm font-medium transition-colors shadow-sm-subtle"
                  >
                    <span>{field}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(field)}
                      aria-label={`Remove ${field}`}
                      className="hover:opacity-70 flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Search Input */}
            <div className="relative mt-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchFieldQuery}
                onChange={(e) => setSearchFieldQuery(e.target.value)}
                placeholder="Search fields of study..."
                className="w-full pl-11 pr-4 py-3 border border-outline-variant rounded-md bg-surface-container-lowest text-on-surface text-sm md:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant"
              />
              {searchFieldQuery && (
                <button
                  type="button"
                  onClick={() => setSearchFieldQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Expandable Categories */}
            <div className="mt-2 border border-outline-variant rounded-md overflow-hidden bg-surface-container-lowest shadow-sm-subtle">
              {filteredCategories.length === 0 ? (
                <div className="p-4 text-center text-sm text-on-surface-variant">
                  No matching fields found.
                </div>
              ) : (
                filteredCategories.map((cat, index) => {
                  const isExpanded = expandedCategories[cat.category] ?? false;
                  return (
                    <div
                      key={cat.category}
                      className={index < filteredCategories.length - 1 ? "border-b border-outline-variant/60" : ""}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.category)}
                        className="w-full flex justify-between items-center px-4 py-3.5 bg-surface-container-low/70 hover:bg-surface-container-low rounded-md transition-colors cursor-pointer text-left"
                      >
                        <span className="text-sm md:text-base font-semibold text-on-surface">
                          {cat.category}
                        </span>
                        <span
                          className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          expand_more
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-container-lowest animate-fadeIn">
                          {cat.fields.map((field) => {
                            const isSelected = data.fieldsOfStudy.includes(field);
                            const isDisabled = !isSelected && data.fieldsOfStudy.length >= 5;

                            return (
                              <label
                                key={field}
                                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                                  isDisabled
                                    ? "opacity-40 cursor-not-allowed"
                                    : "cursor-pointer hover:bg-surface-container-low group"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={isDisabled}
                                  onChange={() => handleToggleField(field)}
                                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
                                />
                                <span
                                  className={`text-sm md:text-base ${
                                    isSelected
                                      ? "font-semibold text-primary"
                                      : "text-on-surface group-hover:text-primary transition-colors"
                                  }`}
                                >
                                  {field}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Nationality (Dropdown with Search & Quick Options) */}
          <div className="flex flex-col gap-2 relative z-20" ref={nationalityDropdownRef}>
            <label
              htmlFor="nationality-select"
              className="text-xs md:text-sm font-medium text-on-surface"
            >
              Nationality <span className="text-error">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                id="nationality-select"
                aria-haspopup="listbox"
                aria-expanded={nationalityDropdownOpen}
                onClick={() => setNationalityDropdownOpen((prev) => !prev)}
                className="w-full px-4 py-3 border border-outline-variant rounded-lg bg-white text-on-surface flex justify-between items-center hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors text-left shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                    public
                  </span>
                  <span
                    className={
                      data.nationality
                        ? "text-on-surface font-medium"
                        : "text-on-surface-variant/70"
                    }
                  >
                    {data.nationality || "Select Country"}
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                    nationalityDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>

              {nationalityDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute top-full left-0 w-full mt-1.5 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 max-h-64 overflow-hidden flex flex-col"
                >
                  {/* Search inside nationality */}
                  <div className="p-2 border-b border-neutral-200 sticky top-0 bg-white">
                    <input
                      type="text"
                      value={countrySearchQuery}
                      onChange={(e) => setCountrySearchQuery(e.target.value)}
                      placeholder="Search country..."
                      className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded-md bg-neutral-50 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto max-h-52 custom-scrollbar">
                    {filteredCountries.length === 0 ? (
                      <div className="p-3 text-center text-xs text-on-surface-variant">
                        No country found
                      </div>
                    ) : (
                      filteredCountries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          role="option"
                          aria-selected={data.nationality === country}
                          onClick={() => handleSelectNationality(country)}
                          className={`w-full text-left px-4 py-2.5 hover:bg-neutral-100 transition-colors text-sm flex items-center justify-between cursor-pointer ${
                            data.nationality === country
                              ? "bg-primary-50 text-primary font-semibold"
                              : "text-on-surface"
                          }`}
                        >
                          <span>{country}</span>
                          {data.nationality === country && (
                            <span className="material-symbols-outlined text-primary text-sm">
                              check
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Nationality Choices */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-xs text-on-surface-variant font-medium">Quick options:</span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_COUNTRIES.map((country) => {
                  const isSelected = data.nationality === country;
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => handleSelectNationality(country)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-white text-neutral-700 border-neutral-200 hover:border-primary hover:bg-neutral-50"
                      }`}
                    >
                      {country}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-4 md:px-8 py-4 rounded-t-xl mt-auto flex justify-between items-center">
        {/* Back Button (Disabled on Step 1) */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="flex items-center gap-2 text-xs md:text-sm font-medium text-on-surface-variant opacity-40 cursor-not-allowed px-4 py-2 rounded-md"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
          className={`flex items-center gap-2 text-xs md:text-sm font-semibold rounded-md px-6 py-3 transition-all ${
            isComplete
              ? "bg-primary text-on-primary hover:opacity-90 shadow-sm cursor-pointer"
              : "bg-primary/40 text-on-primary opacity-50 cursor-not-allowed"
          }`}
        >
          <span>Next</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </nav>
    </div>
  );
}
