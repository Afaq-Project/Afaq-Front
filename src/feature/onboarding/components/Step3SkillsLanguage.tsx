"use client";

import React, { useState } from "react";
import type { SkillsData, LanguageItem } from "../types";

interface Step3SkillsLanguageProps {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const SKILL_CATEGORIES: { category: string; skills: string[] }[] = [
  {
    category: "Tech & Development",
    skills: [
      "JavaScript",
      "React",
      "Machine Learning",
      "Cloud Architecture",
      "UI/UX Design",
      "DevOps",
      "Python",
      "Node.js",
      "TypeScript",
      "Data Analysis",
      "Cybersecurity",
    ],
  },
  {
    category: "Business & Strategy",
    skills: [
      "Product Management",
      "Digital Marketing",
      "Business Analysis",
      "Financial Modeling",
      "Project Management",
      "Strategic Planning",
      "Entrepreneurship",
    ],
  },
  {
    category: "Arts & Design",
    skills: [
      "Graphic Design",
      "Animation",
      "Photography",
      "Creative Writing",
      "Video Editing",
      "Illustration",
    ],
  },
  {
    category: "Science & Research",
    skills: [
      "Academic Writing",
      "Bioinformatics",
      "Laboratory Research",
      "Clinical Trials",
      "Statistical Modeling",
    ],
  },
  {
    category: "Engineering",
    skills: [
      "Robotics",
      "Mechanical Design",
      "Electrical Systems",
      "CAD Modeling",
      "Embedded Systems",
    ],
  },
  {
    category: "Healthcare",
    skills: [
      "Public Health",
      "Clinical Research",
      "Nursing",
      "Health Informatics",
      "Patient Care",
    ],
  },
];

const AVAILABLE_LANGUAGES = [
  "English", "Spanish", "Mandarin", "French", "Arabic", "German",
  "Japanese", "Portuguese", "Russian", "Italian", "Turkish", "Hindi", "Korean"
];

const CEFR_LEVELS = [
  "Native or Bilingual",
  "C2 Proficient",
  "C1 Advanced",
  "B2 Upper Intermediate",
  "B1 Intermediate",
  "A2 Elementary",
  "A1 Beginner",
];

export function Step3SkillsLanguage({
  data,
  onChange,
  onNext,
  onBack,
  onSkip,
}: Step3SkillsLanguageProps) {
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "Tech & Development": true,
  });

  const toggleCategory = (catName: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const handleToggleSkill = (skill: string) => {
    const exists = data.skills.includes(skill);
    if (exists) {
      onChange({
        ...data,
        skills: data.skills.filter((s) => s !== skill),
      });
    } else {
      if (data.skills.length >= 20) return;
      onChange({
        ...data,
        skills: [...data.skills, skill],
      });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((s) => s !== skill),
    });
  };

  const handleAddCustomSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (data.skills.length >= 20) return;
    if (!data.skills.includes(trimmed)) {
      onChange({
        ...data,
        skills: [...data.skills, trimmed],
      });
    }
    setCustomSkillInput("");
  };

  // Language management
  const handleLanguageChange = (id: string, field: "language" | "level", value: string) => {
    const updated = data.languages.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, languages: updated });
  };

  const handleAddLanguage = () => {
    if (data.languages.length >= 5) return;
    const newId = `lang-${Date.now()}`;
    const newLang: LanguageItem = {
      id: newId,
      language: "English",
      level: "B2 Upper Intermediate",
    };
    onChange({
      ...data,
      languages: [...data.languages, newLang],
    });
  };

  const handleRemoveLanguage = (id: string) => {
    onChange({
      ...data,
      languages: data.languages.filter((l) => l.id !== id),
    });
  };

  return (
    <div className="flex flex-col flex-grow min-h-[calc(100vh-10rem)]">
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-8 flex flex-col gap-8">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-[34px] font-semibold text-on-surface mb-2 tracking-tight">
            What are your skills and interests?
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Add skills to help us personalize your experience. (Optional)
          </p>
        </div>

        {/* Section 1: Skills & Interests */}
        <section className="bg-surface-container-low rounded-xl p-5 md:p-6 flex flex-col gap-5 border border-outline-variant shadow-xs">
          <div className="flex justify-between items-center">
            <h2 className="text-base md:text-lg font-semibold text-on-surface">
              Skills &amp; Interests
            </h2>
            <span
              className={`text-xs md:text-sm font-medium ${
                data.skills.length >= 20 ? "text-warning font-bold" : "text-on-surface-variant"
              }`}
            >
              {data.skills.length} of 20 selected
            </span>
          </div>

          {/* Search & Custom Input */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSkill();
                    }
                  }}
                  placeholder="Search or add a custom skill..."
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-md text-sm md:text-base border border-outline-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddCustomSkill()}
                disabled={!customSkillInput.trim() || data.skills.length >= 20}
                className="px-4 md:px-5 py-3 bg-primary text-on-primary rounded-lg text-xs md:text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Add
              </button>
            </div>

            {/* Selected Chips */}
            <div className="flex flex-wrap gap-2 min-h-[44px] p-2.5 bg-surface-container/60 rounded-lg border border-outline-variant/60 items-center">
              {data.skills.length === 0 ? (
                <span className="text-xs md:text-sm text-on-surface-variant/60 italic pl-1">
                  No skills selected yet. Choose from categories below or type your own.
                </span>
              ) : (
                data.skills.map((skill) => (
                  <div
                    key={skill}
                    className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors shadow-sm-subtle"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="hover:opacity-75 flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="h-px w-full bg-outline-variant/50 my-1"></div>

          {/* Categories Accordion Container */}
          <div className="flex flex-col gap-2">
            {SKILL_CATEGORIES.map((cat) => {
              const isOpen = openCategories[cat.category] ?? false;
              return (
                <div
                  key={cat.category}
                  className="border border-outline-variant rounded-md bg-surface overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.category)}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low rounded-md transition-colors text-left cursor-pointer"
                  >
                    <span className="text-sm md:text-base font-semibold text-on-surface">
                      {cat.category}
                    </span>
                    <span
                      className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
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
                            className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-primary text-on-primary shadow-sm-subtle"
                                : isDisabled
                                ? "border border-outline-variant/50 text-on-surface-variant/40 cursor-not-allowed"
                                : "border border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-high"
                            }`}
                          >
                            {isSelected && (
                              <span className="material-symbols-outlined text-[16px]">check</span>
                            )}
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

        {/* Section 2: Language Proficiency */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-on-surface">Language Proficiency</h2>
            <span
              className={`text-xs md:text-sm font-medium ${
                data.languages.length >= 5 ? "text-warning font-bold" : "text-on-surface-variant"
              }`}
            >
              {data.languages.length} of 5 languages
            </span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 md:p-6 flex flex-col gap-3 border border-outline-variant shadow-xs">
            {data.languages.length === 0 ? (
              <p className="text-xs md:text-sm text-on-surface-variant italic p-2">
                No languages added yet. Click &quot;Add another language&quot; below.
              </p>
            ) : (
              data.languages.map((langItem) => (
                <div
                  key={langItem.id}
                  className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full bg-surface p-2.5 rounded-lg border border-outline-variant/60 hover:border-outline-variant transition-colors"
                >
                  <div className="relative w-full sm:w-[45%]">
                    <select
                      value={langItem.language}
                      onChange={(e) =>
                        handleLanguageChange(langItem.id, "language", e.target.value)
                      }
                      className="w-full appearance-none bg-surface-container text-on-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm md:text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors hover:bg-surface-container-high"
                    >
                      {AVAILABLE_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                      expand_more
                    </span>
                  </div>

                  <div className="relative w-full sm:w-[45%]">
                    <select
                      value={langItem.level}
                      onChange={(e) =>
                        handleLanguageChange(langItem.id, "level", e.target.value)
                      }
                      className="w-full appearance-none bg-surface-container text-on-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm md:text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors hover:bg-surface-container-high"
                    >
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                      expand_more
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(langItem.id)}
                    aria-label={`Delete language row`}
                    className="w-full sm:w-auto flex justify-center text-on-surface-variant hover:text-danger hover:bg-error-container p-2.5 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              ))
            )}

            {/* Add Button */}
            {data.languages.length < 5 && (
              <button
                type="button"
                onClick={handleAddLanguage}
                className="flex items-center justify-center gap-2 py-2.5 px-4 w-full sm:w-max rounded-lg border border-dashed border-outline text-primary text-xs md:text-sm font-semibold hover:bg-primary-container/20 hover:border-primary transition-all mt-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Add another language</span>
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Shared Component: BottomNavBar */}
      <nav className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-4 md:px-8 py-4 rounded-t-xl mt-auto flex justify-between items-center">
        {/* Leading Action */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-on-surface-variant hover:text-on-surface px-3 md:px-4 py-2 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </button>

        {/* Trailing Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs md:text-sm font-medium text-primary hover:bg-primary-container/30 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={onNext}
            className="bg-primary text-on-primary rounded-lg px-5 md:px-6 py-2.5 text-xs md:text-sm font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
