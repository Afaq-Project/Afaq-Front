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
    <div className="flex flex-col min-h-full bg-white relative w-full">
      {/* Top right actions */}
      <div className="absolute top-8 right-8 z-20">
        <button
          type="button"
          className="text-[13px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
        >
          Save &amp; exit
        </button>
      </div>

      <div className="flex-1 relative z-10 w-full flex flex-col">
        <main className="px-10 pt-20 pb-28 flex flex-col max-w-[700px] mx-auto w-full gap-8">
          <h1 className="text-[28px] font-bold text-[#1A202C] mb-10 tracking-tight">
            Tell us about your education
          </h1>

          <form
            className="space-y-8 flex-grow"
            onSubmit={(e) => {
              e.preventDefault();
              if (isComplete) onNext();
            }}
          >
            {/* Nationality */}
            <div className="flex flex-col gap-2.5 relative z-50" ref={nationalityDropdownRef}>
              <label
                htmlFor="nationality-select"
                className="text-[13px] font-semibold text-[#2D3748]"
              >
                Nationality <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  id="nationality-select"
                  aria-haspopup="listbox"
                  aria-expanded={nationalityDropdownOpen}
                  onClick={() => setNationalityDropdownOpen((prev) => !prev)}
                  className="w-full px-4 py-3.5 border border-neutral-200 rounded-[14px] bg-white text-neutral-800 flex justify-between items-center hover:border-[#397A0F] focus:outline-none focus:ring-2 focus:ring-[#397A0F]/20 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-neutral-400 text-[22px]">
                      public
                    </span>
                    <span
                      className={
                        data.nationality
                          ? "text-neutral-800 font-medium text-[15px]"
                          : "text-neutral-400 text-[15px]"
                      }
                    >
                      {data.nationality || "Select Country"}
                    </span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-neutral-400 transition-transform ${
                      nationalityDropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {nationalityDropdownOpen && (
                  <div
                    role="listbox"
                    className="absolute top-full left-0 w-full mt-2 bg-white border border-neutral-200 rounded-[14px] shadow-lg z-50 max-h-64 overflow-hidden flex flex-col"
                  >
                    {/* Search inside nationality */}
                    <div className="p-2 border-b border-neutral-100 sticky top-0 bg-white">
                      <input
                        type="text"
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                        placeholder="Search country..."
                        className="w-full px-3 py-2 text-[14px] border border-neutral-200 rounded-[10px] bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#397A0F]"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto max-h-52 scrollbar-minimal">
                      {filteredCountries.length === 0 ? (
                        <div className="p-4 text-center text-[13px] text-neutral-500">
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
                            className={`w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors text-[14px] flex items-center justify-between cursor-pointer ${
                              data.nationality === country
                                ? "text-[#397A0F] font-semibold bg-[#F5FAF5]"
                                : "text-neutral-700"
                            }`}
                          >
                            <span>{country}</span>
                            {data.nationality === country && (
                              <span className="material-symbols-outlined text-[#397A0F] text-[18px]">
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
            </div>

            {/* Education Level */}
            <div className="flex flex-col gap-2.5 relative z-40" ref={levelDropdownRef}>
              <label
                htmlFor="education-level"
                className="text-[13px] font-semibold text-[#2D3748]"
              >
                Education Level <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  id="education-level"
                  aria-haspopup="listbox"
                  aria-expanded={levelDropdownOpen}
                  onClick={() => setLevelDropdownOpen((prev) => !prev)}
                  className="w-full px-5 py-3.5 border border-neutral-200 rounded-[14px] bg-white text-neutral-800 flex justify-between items-center hover:border-[#397A0F] focus:outline-none focus:ring-2 focus:ring-[#397A0F]/20 transition-colors text-left cursor-pointer"
                >
                  <span
                    className={
                      data.educationLevel
                        ? "text-neutral-800 font-medium text-[15px]"
                        : "text-neutral-400 text-[15px]"
                    }
                  >
                    {data.educationLevel || "Select highest level achieved"}
                  </span>
                  <span
                    className={`material-symbols-outlined text-neutral-400 transition-transform ${
                      levelDropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {levelDropdownOpen && (
                  <div
                    role="listbox"
                    className="absolute top-full left-0 w-full mt-2 bg-white border border-neutral-200 rounded-[14px] shadow-lg z-50 overflow-hidden"
                  >
                    {EDUCATION_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        role="option"
                        aria-selected={data.educationLevel === level}
                        onClick={() => handleSelectLevel(level)}
                        className={`w-full text-left px-5 py-3.5 hover:bg-neutral-50 transition-colors text-[14px] flex items-center justify-between cursor-pointer ${
                          data.educationLevel === level
                            ? "text-[#397A0F] font-semibold bg-[#F5FAF5]"
                            : "text-neutral-700"
                        }`}
                      >
                        <span>{level}</span>
                        {data.educationLevel === level && (
                          <span className="material-symbols-outlined text-[#397A0F] text-[18px]">
                            check
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Field of Study */}
            <div className="flex flex-col gap-2.5 relative z-30">
              <div className="flex justify-between items-end">
                <label className="text-[13px] font-semibold text-[#2D3748]">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-[12px] font-medium ${
                    data.fieldsOfStudy.length >= 5
                      ? "text-orange-500 font-semibold"
                      : "text-neutral-500"
                  }`}
                >
                  {data.fieldsOfStudy.length} of 5 selected
                </span>
              </div>

              {/* Selected Chips Area */}
              <div className="flex flex-wrap gap-2 min-h-[56px] p-3 border border-neutral-200 border-dashed rounded-[14px] bg-neutral-50/50 items-center">
                {data.fieldsOfStudy.length === 0 ? (
                  <span className="text-[13.5px] text-neutral-400 italic pl-2">
                    Select up to 5 fields from the categories below or search
                  </span>
                ) : (
                  data.fieldsOfStudy.map((field) => (
                    <div
                      key={field}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-100 text-neutral-700 rounded-[8px] text-[13px] font-medium transition-colors"
                    >
                      <span>{field}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(field)}
                        aria-label={`Remove ${field}`}
                        className="hover:text-red-500 flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Search Input */}
              <div className="relative mt-2">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchFieldQuery}
                  onChange={(e) => setSearchFieldQuery(e.target.value)}
                  placeholder="Search fields of study..."
                  className="w-full pl-12 pr-4 py-3.5 border border-neutral-200 rounded-[14px] bg-white text-neutral-800 text-[14.5px] focus:outline-none focus:border-[#397A0F] focus:ring-2 focus:ring-[#397A0F]/20 transition-all placeholder:text-neutral-400"
                />
                {searchFieldQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchFieldQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              {/* Expandable Categories */}
              <div className="mt-2 border border-neutral-100 rounded-[14px] overflow-hidden bg-white shadow-sm">
                {filteredCategories.length === 0 ? (
                  <div className="p-5 text-center text-[14px] text-neutral-400">
                    No matching fields found.
                  </div>
                ) : (
                  filteredCategories.map((cat, index) => {
                    const isExpanded = expandedCategories[cat.category] ?? false;
                    return (
                      <div
                        key={cat.category}
                        className={index < filteredCategories.length - 1 ? "border-b border-neutral-100" : ""}
                      >
                        <button
                          type="button"
                          onClick={() => toggleCategory(cat.category)}
                          className="w-full flex justify-between items-center px-5 py-4 hover:bg-neutral-50 transition-colors cursor-pointer text-left"
                        >
                          <span className="text-[14px] font-semibold text-neutral-800">
                            {cat.category}
                          </span>
                          <span
                            className={`material-symbols-outlined text-neutral-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          >
                            expand_more
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                            {cat.fields.map((field) => {
                              const isSelected = data.fieldsOfStudy.includes(field);
                              const isDisabled = !isSelected && data.fieldsOfStudy.length >= 5;

                              return (
                                <label
                                  key={field}
                                  className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                                    isDisabled
                                      ? "opacity-40 cursor-not-allowed"
                                      : "cursor-pointer hover:bg-neutral-50 group"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onChange={() => handleToggleField(field)}
                                    className="w-4 h-4 rounded border-neutral-300 text-[#397A0F] focus:ring-[#397A0F] cursor-pointer disabled:cursor-not-allowed"
                                  />
                                  <span
                                    className={`text-[14px] ${
                                      isSelected
                                        ? "font-semibold text-[#397A0F]"
                                        : "text-neutral-700 group-hover:text-neutral-900 transition-colors"
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
          </form>
        </main>
      </div>

      {/* Bottom Navigation Bar */}
      <footer className="shrink-0 sticky bottom-0 z-20 w-full bg-white border-t border-neutral-100 px-10 py-5 flex justify-between items-center mt-auto">
        {/* Back Button */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="flex items-center gap-2 text-[14px] font-medium text-neutral-400 cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
          className={`flex items-center gap-2 text-[14px] font-semibold rounded-full px-8 py-3 transition-all ${
            isComplete
              ? "bg-[#397A0F] text-white hover:opacity-90 cursor-pointer shadow-sm"
              : "bg-[#DDE9D8] text-white cursor-not-allowed"
          }`}
        >
          <span>Next</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
}
