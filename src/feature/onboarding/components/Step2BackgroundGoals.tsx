"use client";

import React from "react";
import type { BackgroundData, GpaScale, ExperienceLevel, FinancialNeed } from "../types";

interface Step2BackgroundGoalsProps {
  data: BackgroundData;
  onChange: (data: BackgroundData) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function Step2BackgroundGoals({
  data,
  onChange,
  onNext,
  onBack,
  onSkip,
}: Step2BackgroundGoalsProps) {
  // CRITICAL REQUIREMENT: Changing scale clears the GPA value!
  const handleScaleChange = (newScale: GpaScale) => {
    if (newScale !== data.gpaScale) {
      onChange({
        ...data,
        gpaScale: newScale,
        gpa: "", // Cleared!
      });
    }
  };

  const handleGpaChange = (value: string) => {
    onChange({ ...data, gpa: value });
  };

  const handleExperienceChange = (level: ExperienceLevel) => {
    onChange({ ...data, experienceLevel: level });
  };

  const handleFinancialNeedChange = (need: FinancialNeed) => {
    onChange({ ...data, financialNeed: need });
  };

  const handleGoalsChange = (goals: string) => {
    onChange({ ...data, goals });
  };

  const experienceOptions: {
    level: ExperienceLevel;
    label: string;
    icon: string;
  }[] = [
    { level: "none", label: "None", icon: "person_off" },
    { level: "entry", label: "Entry", icon: "directions_walk" },
    { level: "mid", label: "Mid", icon: "directions_run" },
    { level: "senior", label: "Senior", icon: "flight_takeoff" },
  ];

  const financialOptions: { value: FinancialNeed; label: string }[] = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "prefer_not", label: "Prefer not to say" },
  ];

  return (
    <div className="flex flex-col flex-grow min-h-[calc(100vh-10rem)]">
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-8 flex flex-col">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-[34px] font-semibold text-on-surface mb-2 tracking-tight">
            Help us understand your goals
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Providing these details helps us tailor your experience and find the best matches. (Optional)
          </p>
        </div>

        <form className="space-y-6 md:space-y-8 flex-grow" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
          {/* Section 1: GPA */}
          <section className="bg-surface-container-lowest rounded-xl p-5 md:p-6 shadow-xs border border-outline-variant/40">
            <div className="flex items-center justify-between mb-4">
              <label className="text-base md:text-lg font-medium text-on-surface flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-on-surface-variant text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  school
                </span>
                <span>GPA / Grade</span>
                <span className="text-xs font-normal text-outline">(Optional)</span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="flex-grow">
                {data.gpaScale === "letter" ? (
                  <input
                    type="text"
                    value={data.gpa}
                    onChange={(e) => handleGpaChange(e.target.value)}
                    placeholder="e.g. A, B+, First Class"
                    className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-3 text-sm md:text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline"
                  />
                ) : data.gpaScale === "percent" ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={data.gpa}
                    onChange={(e) => handleGpaChange(e.target.value)}
                    placeholder="e.g. 88.5"
                    className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-3 text-sm md:text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline"
                  />
                ) : (
                  <input
                    type="number"
                    min="0"
                    max="4.0"
                    step="0.01"
                    value={data.gpa}
                    onChange={(e) => handleGpaChange(e.target.value)}
                    placeholder="e.g. 3.8"
                    className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-3 text-sm md:text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline"
                  />
                )}
              </div>

              {/* Segmented Control for GPA Scale */}
              <div className="flex bg-surface-container p-1 rounded-md border border-outline-variant/50 self-start sm:self-auto w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleScaleChange("4.0")}
                  className={`rounded-md px-3 md:px-4 py-2 text-xs md:text-sm flex-1 text-center whitespace-nowrap transition-all ${
                    data.gpaScale === "4.0"
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-xs"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  4.0 Scale
                </button>
                <button
                  type="button"
                  onClick={() => handleScaleChange("percent")}
                  className={`rounded-md px-3 md:px-4 py-2 text-xs md:text-sm flex-1 text-center whitespace-nowrap transition-all ${
                    data.gpaScale === "percent"
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-xs"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  Percentage
                </button>
                <button
                  type="button"
                  onClick={() => handleScaleChange("letter")}
                  className={`rounded-md px-3 md:px-4 py-2 text-xs md:text-sm flex-1 text-center whitespace-nowrap transition-all ${
                    data.gpaScale === "letter"
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-xs"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  Letter
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Work Experience */}
          <section className="bg-surface-container-lowest rounded-xl p-5 md:p-6 shadow-xs border border-outline-variant/40">
            <div className="mb-4">
              <label className="text-base md:text-lg font-medium text-on-surface flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-on-surface-variant text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  work
                </span>
                <span>Work experience level</span>
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {experienceOptions.map(({ level, label, icon }) => {
                const isSelected = data.experienceLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleExperienceChange(level)}
                    className={`rounded-md p-4 flex flex-col items-center justify-center text-center gap-2 border transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? "border-primary bg-primary-container/15 ring-2 ring-primary text-primary"
                        : "border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high hover:border-outline text-on-surface"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl md:text-3xl ${
                        isSelected ? "text-primary" : "text-on-surface-variant"
                      }`}
                      style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {icon}
                    </span>
                    <span className="text-xs md:text-sm font-semibold">{label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Financial Need */}
          <section className="bg-surface-container-lowest rounded-xl p-5 md:p-6 shadow-xs border border-outline-variant/40">
            <div className="mb-4">
              <label className="text-base md:text-lg font-medium text-on-surface flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-on-surface-variant text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  account_balance
                </span>
                <span>Financial need status</span>
              </label>
            </div>

            <div className="flex flex-col gap-2.5">
              {financialOptions.map(({ value, label }) => {
                const isSelected = data.financialNeed === value;
                return (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-3.5 rounded-md border transition-colors cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-container/10 text-primary font-medium"
                        : "border-outline-variant/50 hover:bg-surface-container-high text-on-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="financial_need"
                      value={value}
                      checked={isSelected}
                      onChange={() => handleFinancialNeedChange(value)}
                      className="w-4 h-4 text-primary border-outline-variant focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm md:text-base">{label}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Section 4: Goals */}
          <section className="bg-surface-container-lowest rounded-xl p-5 md:p-6 shadow-xs border border-outline-variant/40">
            <div className="mb-4">
              <label
                htmlFor="goals-textarea"
                className="text-base md:text-lg font-semibold text-on-surface flex items-center gap-2"
              >
                <span
                  className="material-symbols-outlined text-on-surface-variant text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  psychology
                </span>
                <span>Goals &amp; background</span>
                <span className="text-xs font-normal text-outline">(Optional)</span>
              </label>
            </div>
            <textarea
              id="goals-textarea"
              rows={4}
              value={data.goals}
              onChange={(e) => handleGoalsChange(e.target.value)}
              placeholder="Tell us about your goals and background..."
              className="w-full min-h-[120px] bg-surface-container border border-outline-variant rounded-md p-3.5 text-sm md:text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline resize-y"
            />
          </section>
        </form>
      </main>

      {/* Footer / Bottom Navigation */}
      <footer className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-4 md:px-8 py-4 rounded-t-xl mt-auto flex justify-between items-center">
        {/* Left Action: Back */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-on-surface-variant hover:text-on-surface px-3 md:px-4 py-2 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </button>

        {/* Right Actions: Skip & Next */}
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
            className="text-xs md:text-sm font-semibold bg-primary text-on-primary hover:opacity-90 px-5 md:px-6 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <span>Next</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
