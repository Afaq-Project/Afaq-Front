"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import type { SkillsData, LanguageItem } from "../types";
import type { RefProficiencyLevel } from "@/src/feature/profile/types/api";
import {
  useLanguagesSearch,
  useMajorCategories,
  useMajorsByCategory,
  useMajorsSearch,
} from "@/src/shared/lib/api/hooks/useReferenceData";
import { useDebounce } from "@/src/shared/lib/hooks/useDebounce";
import { CollapsibleTagList } from "@/src/shared/ui/CollapsibleTagList";
import { useQueries } from "@tanstack/react-query";
import { referenceService } from "@/src/shared/lib/api/referenceService";

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

const FALLBACK_PROFICIENCY = [
  "Native or Bilingual", "C2 Proficient", "C1 Advanced",
  "B2 Upper Intermediate", "B1 Intermediate", "A2 Elementary", "A1 Beginner",
].map((name, i) => ({ id: String(i), name }));

// ─── Skill Category Panel (lazy-loads majors on expand) ───────────────────────
interface SkillCategoryPanelProps {
  category: { id: string; nameEn: string };
  selectedIds: string[];
  maxReached: boolean;
  onToggle: (skill: { id: string; name: string }) => void;
}

function SkillCategoryPanel({ category, selectedIds, maxReached, onToggle }: SkillCategoryPanelProps) {
  const [open, setOpen] = useState(false);
  const { data: rawMajors = [], isFetching } = useMajorsByCategory(category.id, open);
  const majors = useMemo(() => rawMajors.map((m) => ({ id: m.id, name: m.nameEn })), [rawMajors]);

  return (
    <div className="border border-outline-variant rounded-md bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors text-left cursor-pointer"
      >
        <span className="text-sm font-semibold text-on-surface">{category.nameEn}</span>
        <div className="flex items-center gap-2">
          {isFetching && (
            <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </div>
      </button>

      {open && (
        <div className="p-4 pt-1 border-t border-outline-variant/30 flex flex-wrap gap-2.5 bg-surface-bright min-h-12">
          {isFetching ? (
            <div className="w-full flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : majors.length === 0 ? null : (
            majors.map((skill) => {
              const isSelected = selectedIds.includes(skill.id);
              const isDisabled = !isSelected && maxReached;
              return (
                <button
                  key={skill.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onToggle(skill)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isSelected
                      ? "bg-primary text-on-primary shadow-sm-subtle cursor-pointer"
                      : isDisabled
                      ? "border border-outline-variant/50 text-on-surface-variant/40 cursor-not-allowed"
                      : "border border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-high cursor-pointer"
                  }`}
                >
                  {isSelected && <span className="material-symbols-outlined text-[16px]">check</span>}
                  <span>{skill.name}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

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
                  onChange(lang.nameEn, lang.id);
                  setOpen(false);
                  setQuery("");
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors cursor-pointer ${valueId === lang.id ? "text-primary font-semibold bg-primary/5" : "text-on-surface"}`}
              >
                {lang.nameEn}
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
  const [skillSearch, setSkillSearch] = useState("");

  const { data: rawCategories = [], isLoading: categoriesLoading } = useMajorCategories();
  const debouncedSkillSearch = useDebounce(skillSearch, 300);
  const { data: rawSearchResults = [], isFetching: searchFetching } = useMajorsSearch(debouncedSkillSearch);
  const searchResults = useMemo(() => rawSearchResults.map((m) => ({ id: m.id, name: m.nameEn })), [rawSearchResults]);
  const isSearching = debouncedSkillSearch.trim().length >= 2;

  // Eagerly fetch all category skills so we can filter empty ones before user expands them.
  // ~20 categories max, each cached forever — expand is also instant since data is pre-warmed.
  const categorySkillQueries = useQueries({
    queries: rawCategories.map((cat) => ({
      queryKey: ["reference", "majors", "category", cat.id],
      queryFn: () => referenceService.getMajorsByCategory(cat.id),
      staleTime: Infinity,
    })),
  });

  const filteredCategories = useMemo(
    () =>
      rawCategories.filter((_, i) => {
        const q = categorySkillQueries[i];
        // Hide only when fetch is done and confirmed empty; show while loading
        return !q?.data || q.data.length > 0;
      }),
    [rawCategories, categorySkillQueries]
  );

  const proficiencyLevels = useMemo(() => {
    if (referenceData?.proficiencyLevels?.length)
      return referenceData.proficiencyLevels.map((p) => ({ id: p.id, name: p.nameEn, code: p.code }));
    return FALLBACK_PROFICIENCY;
  }, [referenceData]);

  const skillIds = data.skillIds ?? [];
  const maxReached = data.skills.length >= 20;

  const handleToggleSkill = (skill: { id: string; name: string }) => {
    const ids = data.skillIds ?? [];
    if (ids.includes(skill.id)) {
      const idx = ids.indexOf(skill.id);
      onChange({
        ...data,
        skills: data.skills.filter((_, i) => i !== idx),
        skillIds: ids.filter((_, i) => i !== idx),
      });
    } else {
      if (maxReached) return;
      onChange({
        ...data,
        skills: [...data.skills, skill.name],
        skillIds: [...ids, skill.id],
      });
    }
  };

  const handleRemoveSkill = (index: number) => {
    const ids = data.skillIds ?? [];
    onChange({
      ...data,
      skills: data.skills.filter((_, i) => i !== index),
      skillIds: ids.filter((_, i) => i !== index),
    });
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed || maxReached || data.skills.includes(trimmed)) return;
    const ids = data.skillIds ?? [];
    onChange({ ...data, skills: [...data.skills, trimmed], skillIds: [...ids, ""] });
    setCustomSkillInput("");
  };

  const handleLanguageChange = (id: string, field: "language" | "level", value: string, apiId?: string) => {
    const updated = data.languages.map((item) => {
      if (item.id !== id) return item;
      if (field === "language") return { ...item, language: value, languageId: apiId };
      const isNative = value.toLowerCase().includes("native");
      return { ...item, level: value, proficiencyLevelId: apiId, isNative };
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

  const handleRemoveLanguage = (id: string) => {
    onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) });
  };

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 pt-8 pb-24 flex flex-col gap-8">
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
            <span className={`text-sm font-medium ${maxReached ? "text-warning font-bold" : "text-on-surface-variant"}`}>
              {data.skills.length} of 20 selected
            </span>
          </div>

          {/* Custom skill add */}
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">add</span>
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomSkill(); } }}
                placeholder="Add a custom skill…"
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-md text-sm border border-outline-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={handleAddCustomSkill}
              disabled={!customSkillInput.trim() || maxReached}
              className="px-5 py-3 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Add
            </button>
          </div>

          {/* Selected skills */}
          <div className="min-h-11 p-2.5 bg-surface-container/60 rounded-lg border border-outline-variant/60">
            <CollapsibleTagList
              items={data.skills.map((skill, i) => ({
                key: `${skill}-${i}`,
                label: skill,
                onRemove: () => handleRemoveSkill(i),
              }))}
              defaultVisible={3}
              emptyMessage="No skills selected yet. Choose from the categories below."
            />
          </div>

          <div className="h-px w-full bg-outline-variant/50" />

          {/* Skill search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">search</span>
            <input
              type="text"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder="Search skills…"
              className="w-full pl-11 pr-10 py-2.5 bg-surface-container-low rounded-md text-sm border border-outline-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant transition-colors"
            />
            {searchFetching && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            {skillSearch && !searchFetching && (
              <button type="button" onClick={() => setSkillSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Search results or category accordion */}
          {isSearching ? (
            <div className="flex flex-wrap gap-2.5">
              {searchFetching ? (
                <div className="w-full flex justify-center py-4">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center w-full py-4">No skills found for &ldquo;{debouncedSkillSearch}&rdquo;</p>
              ) : (
                searchResults.map((skill) => {
                  const isSelected = skillIds.includes(skill.id);
                  const isDisabled = !isSelected && maxReached;
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleToggleSkill(skill)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
                        isSelected
                          ? "bg-primary text-on-primary shadow-sm-subtle cursor-pointer"
                          : isDisabled
                          ? "border border-outline-variant/50 text-on-surface-variant/40 cursor-not-allowed"
                          : "border border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-high cursor-pointer"
                      }`}
                    >
                      {isSelected && <span className="material-symbols-outlined text-[16px]">check</span>}
                      <span>{skill.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {categoriesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                filteredCategories.map((cat) => (
                  <SkillCategoryPanel
                    key={cat.id}
                    category={cat}
                    selectedIds={skillIds}
                    maxReached={maxReached}
                    onToggle={handleToggleSkill}
                  />
                ))
              )}
            </div>
          )}
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
              data.languages.map((langItem) => {
                const profId =
                  langItem.proficiencyLevelId ??
                  proficiencyLevels.find((p) => p.name === langItem.level)?.id ??
                  proficiencyLevels[0]?.id ??
                  "";

                return (
                  <div key={langItem.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full bg-surface p-3 rounded-lg border border-outline-variant/60">
                    <>
                      <LanguageCombobox
                        value={langItem.language}
                        valueId={langItem.languageId}
                        onChange={(name, id) => handleLanguageChange(langItem.id, "language", name, id)}
                      />

                      <div className="relative w-full sm:w-[45%]">
                        <select
                          value={profId}
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
                    </>
                  </div>
                );
              })
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
