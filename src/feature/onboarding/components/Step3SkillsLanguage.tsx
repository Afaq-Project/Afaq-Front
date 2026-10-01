"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import type { SkillsData, LanguageItem } from "../types";
import type { RefProficiencyLevel } from "@/src/feature/profile/types/api";
import { useLanguagesSearch } from "@/src/shared/lib/api/hooks/useReferenceData";
import { useDebounce } from "@/src/shared/lib/hooks/useDebounce";

export interface Step3ReferenceData {
  proficiencyLevels: RefProficiencyLevel[];
  isLoading: boolean;
}

interface Step3SkillsLanguageProps {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  referenceData?: Step3ReferenceData;
}

const SKILL_CATEGORIES: { category: string; skills: string[] }[] = [
  { category: "Engineering", skills: ["Robotics", "Mechanical Design", "Electrical Systems", "CAD Modeling", "Embedded Systems"] },
  { category: "Tech & Development", skills: ["JavaScript", "React", "Machine Learning", "Cloud Architecture", "UI/UX Design", "DevOps", "Python", "Node.js", "TypeScript", "Data Analysis", "Cybersecurity"] },
  { category: "Business & Strategy", skills: ["Product Management", "Digital Marketing", "Business Analysis", "Financial Modeling", "Project Management", "Strategic Planning", "Entrepreneurship"] },
  { category: "Arts & Design", skills: ["Graphic Design", "Animation", "Photography", "Creative Writing", "Video Editing", "Illustration"] },
  { category: "Science & Research", skills: ["Academic Writing", "Bioinformatics", "Laboratory Research", "Clinical Trials", "Statistical Modeling"] },
  { category: "Healthcare", skills: ["Public Health", "Clinical Research", "Nursing", "Health Informatics", "Patient Care"] },
];

const FALLBACK_PROFICIENCY = [
  "Native or Bilingual", "C2 Proficient", "C1 Advanced",
  "B2 Upper Intermediate", "B1 Intermediate", "A2 Elementary", "A1 Beginner",
].map((name, i) => ({ id: String(i), name }));

// ─── Searchable language combobox ────────────────────────────────────────────
interface LanguageComboboxProps {
  value: string;
  valueId?: string;
  onChange: (name: string, id: string) => void;
}

function LanguageCombobox({ value, valueId, onChange }: LanguageComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { data: results = [], isFetching } = useLanguagesSearch(debouncedQuery);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-[45%]" ref={ref}>
      <div className="relative">
        <input
          type="text"
          value={open ? query : value}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setQuery(""); setOpen(true); }}
          placeholder="Search language…"
          className="w-full bg-surface-container text-on-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-8"
        />
        {isFetching ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto">
          {results.length === 0 && !isFetching ? (
            <div className="px-4 py-3 text-xs text-on-surface-variant text-center">No languages found</div>
          ) : (
            results.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(lang.name, lang.id);
                  setOpen(false);
                  setQuery("");
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors cursor-pointer ${valueId === lang.id ? "text-primary font-semibold bg-primary/5" : "text-on-surface"}`}
              >
                {lang.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function Step3SkillsLanguage({ data, onChange, onNext, onBack, onSkip, referenceData }: Step3SkillsLanguageProps) {
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({ "Engineering": true });
  const [skillSearch, setSkillSearch] = useState("");

  const proficiencyLevels = useMemo(() => {
    if (referenceData?.proficiencyLevels?.length) return referenceData.proficiencyLevels;
    return FALLBACK_PROFICIENCY;
  }, [referenceData]);

  const filteredCategories = useMemo(() => {
    if (!skillSearch.trim()) return SKILL_CATEGORIES;
    const q = skillSearch.toLowerCase();
    return SKILL_CATEGORIES.map((cat) => ({
      ...cat,
      skills: cat.skills.filter((s) => s.toLowerCase().includes(q)),
    })).filter((c) => c.skills.length > 0);
  }, [skillSearch]);

  const toggleCategory = (catName: string) => {
    setOpenCategories((prev) => ({ ...prev, [catName]: !prev[catName] }));
  };

  const handleToggleSkill = (skill: string) => {
    const exists = data.skills.includes(skill);
    if (exists) {
      onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });
    } else {
      if (data.skills.length >= 20) return;
      onChange({ ...data, skills: [...data.skills, skill] });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed || data.skills.length >= 20 || data.skills.includes(trimmed)) return;
    onChange({ ...data, skills: [...data.skills, trimmed] });
    setCustomSkillInput("");
  };

  const handleLanguageChange = (id: string, field: "language" | "level", value: string, apiId?: string) => {
    const updated = data.languages.map((item) => {
      if (item.id !== id) return item;
      if (field === "language") return { ...item, language: value, languageId: apiId };
      return { ...item, level: value, proficiencyLevelId: apiId };
    });
    onChange({ ...data, languages: updated });
  };

  const handleAddLanguage = () => {
    if (data.languages.length >= 5) return;
    const defaultProf = proficiencyLevels[0];
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: "",
      level: defaultProf?.name ?? "B2 Upper Intermediate",
      proficiencyLevelId: defaultProf?.id,
      isNative: false,
    };
    onChange({ ...data, languages: [...data.languages, newLang] });
  };

  const handleToggleNative = (id: string) => {
    const updated = data.languages.map((item) =>
      item.id === id ? { ...item, isNative: !item.isNative } : item
    );
    onChange({ ...data, languages: updated });
  };

  const handleRemoveLanguage = (id: string) => {
    onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) });
  };

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 pt-8 pb-8 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-on-surface mb-2 tracking-tight">
            What are your skills and interests?
          </h1>
          <p className="text-sm text-on-surface-variant">Add skills to help us personalize your experience. (Optional)</p>
        </div>

        {/* Skills & Interests */}
        <section className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-5 border border-outline-variant shadow-xs">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-on-surface">Skills &amp; Interests</h2>
            <span className={`text-sm font-medium ${data.skills.length >= 20 ? "text-warning font-bold" : "text-on-surface-variant"}`}>
              {data.skills.length} of 20 selected
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">search</span>
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomSkill(); } }}
                  placeholder="Search skills…"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-md text-sm border border-outline-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCustomSkill}
                disabled={!customSkillInput.trim() || data.skills.length >= 20}
                className="px-5 py-3 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-11 p-2.5 bg-surface-container/60 rounded-lg border border-outline-variant/60 items-center">
              {data.skills.length === 0 ? (
                <span className="text-sm text-on-surface-variant/60 italic pl-1">No skills selected yet. Choose from the categories below.</span>
              ) : (
                data.skills.map((skill) => (
                  <div key={skill} className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full text-sm font-medium shadow-sm-subtle">
                    <span>{skill}</span>
                    <button type="button" onClick={() => handleRemoveSkill(skill)} aria-label={`Remove ${skill}`} className="hover:opacity-75 flex items-center justify-center cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="h-px w-full bg-outline-variant/50" />

          <div className="flex flex-col gap-2">
            {filteredCategories.map((cat) => {
              const isOpen = openCategories[cat.category] ?? false;
              return (
                <div key={cat.category} className="border border-outline-variant rounded-md bg-surface overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.category)}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors text-left cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-on-surface">{cat.category}</span>
                    <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>expand_more</span>
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-1 border-t border-outline-variant/30 flex flex-wrap gap-2.5 bg-surface-bright">
                      {cat.skills.map((skill) => {
                        const isSelected = data.skills.includes(skill);
                        const isDisabled = !isSelected && data.skills.length >= 20;
                        return (
                          <button
                            key={skill}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleToggleSkill(skill)}
                            className={`px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 cursor-pointer ${isSelected ? "bg-primary text-on-primary shadow-sm-subtle" : isDisabled ? "border border-outline-variant/50 text-on-surface-variant/40 cursor-not-allowed" : "border border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-high"}`}
                          >
                            {isSelected && <span className="material-symbols-outlined text-[16px]">check</span>}
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Language Proficiency */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-on-surface">Language Proficiency</h2>
            <span className={`text-sm font-medium ${data.languages.length >= 5 ? "text-warning font-bold" : "text-on-surface-variant"}`}>
              {data.languages.length} of 5 languages
            </span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 border border-outline-variant shadow-xs">
            {data.languages.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic p-2">No languages added yet. Click &quot;Add language&quot; below.</p>
            ) : (
              data.languages.map((langItem) => (
                <div key={langItem.id} className="flex flex-col gap-2.5 w-full bg-surface p-3 rounded-lg border border-outline-variant/60">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    {/* Language — searchable combobox */}
                    <LanguageCombobox
                      value={langItem.language}
                      valueId={langItem.languageId}
                      onChange={(name, id) => handleLanguageChange(langItem.id, "language", name, id)}
                    />

                    {/* Proficiency */}
                    <div className="relative w-full sm:w-[45%]">
                      <select
                        value={langItem.proficiencyLevelId || langItem.level}
                        onChange={(e) => {
                          const selected = proficiencyLevels.find((p) => p.id === e.target.value);
                          handleLanguageChange(langItem.id, "level", selected?.name ?? e.target.value, selected?.id);
                        }}
                        className="w-full appearance-none bg-surface-container text-on-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
                      >
                        {proficiencyLevels.map((level) => (
                          <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(langItem.id)}
                      aria-label="Remove language"
                      className="w-full sm:w-auto flex justify-center text-on-surface-variant hover:text-error hover:bg-error-container p-2.5 rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>

                  {/* Native toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer w-fit pl-0.5">
                    <div
                      onClick={() => handleToggleNative(langItem.id)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${langItem.isNative ? "bg-primary" : "bg-neutral-300"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${langItem.isNative ? "translate-x-4" : "translate-x-0.5"}`} />
                    </div>
                    <span className="text-xs text-on-surface-variant">Native or first language</span>
                  </label>
                </div>
              ))
            )}

            {data.languages.length < 5 && (
              <button
                type="button"
                onClick={handleAddLanguage}
                className="flex items-center justify-center gap-2 py-2.5 px-4 w-full sm:w-max rounded-lg border border-dashed border-outline text-primary text-sm font-semibold hover:bg-primary-container/20 hover:border-primary transition-all mt-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add another language
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-6 py-4 mt-auto flex justify-between items-center">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onSkip} className="text-sm font-medium text-primary hover:bg-primary-container/30 px-4 py-2.5 rounded-lg transition-colors cursor-pointer">
            Skip for now
          </button>
          <button type="button" onClick={onNext} className="bg-primary text-on-primary rounded-lg px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
            Next
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
