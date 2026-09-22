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
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#1A202C] mb-3 tracking-tight">
              Help us understand your goals
            </h1>
            <p className="text-[14px] md:text-[15px] text-neutral-500">
              Providing these details helps us tailor your experience and find the best matches. (Optional)
            </p>
          </div>

          <form className="space-y-8 flex-grow" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
            {/* Section 1: Work Experience */}
            <section className="bg-white rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
              <div className="mb-5">
                <label className="text-[15px] font-semibold text-[#2D3748] flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-neutral-400 text-[22px]"
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
                      className={`rounded-[12px] py-5 px-2 flex flex-col items-center justify-center text-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? "border-2 border-[#397A0F] text-[#397A0F] bg-white shadow-sm"
                          : "border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-600"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[28px] ${
                          isSelected ? "text-[#397A0F]" : "text-neutral-500"
                        }`}
                        style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {icon}
                      </span>
                      <span className={`text-[13px] ${isSelected ? 'font-bold' : 'font-semibold'}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Section 2: Financial Need */}
            <section className="bg-white rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
              <div className="mb-5">
                <label className="text-[15px] font-semibold text-[#2D3748] flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-neutral-400 text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    account_balance
                  </span>
                  <span>Financial need status</span>
                </label>
              </div>

              <div className="flex flex-col gap-3">
                {financialOptions.map(({ value, label }) => {
                  const isSelected = data.financialNeed === value;
                  return (
                    <label
                      key={value}
                      className={`flex items-center gap-3 p-4 rounded-[12px] border transition-colors cursor-pointer ${
                        isSelected
                          ? "border-[#397A0F] bg-[#F5FAF5] text-[#1A202C] font-semibold"
                          : "border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="financial_need"
                        value={value}
                        checked={isSelected}
                        onChange={() => handleFinancialNeedChange(value)}
                        className="w-[18px] h-[18px] text-[#397A0F] border-neutral-300 focus:ring-[#397A0F] cursor-pointer"
                      />
                      <span className="text-[14.5px]">{label}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Section 3: Goals */}
            <section className="bg-white rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
              <div className="mb-5">
                <label
                  htmlFor="goals-textarea"
                  className="text-[15px] font-semibold text-[#2D3748] flex items-center gap-2.5"
                >
                  <span
                    className="material-symbols-outlined text-neutral-400 text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    psychology
                  </span>
                  <span>Goals &amp; background</span>
                  <span className="text-[12px] font-medium text-neutral-400">(Optional)</span>
                </label>
              </div>
              <textarea
                id="goals-textarea"
                rows={4}
                value={data.goals}
                onChange={(e) => handleGoalsChange(e.target.value)}
                placeholder="Tell us about your goals and background..."
                className="w-full min-h-[120px] bg-white border border-neutral-200 rounded-[12px] p-4 text-[14.5px] text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#397A0F]/20 focus:border-[#397A0F] transition-all placeholder:text-neutral-400 resize-y"
              />
            </section>
          </form>
        </main>
      </div>

      {/* Footer / Bottom Navigation */}
      <footer className="shrink-0 sticky bottom-0 z-20 w-full bg-white border-t border-neutral-100 px-10 py-5 flex justify-between items-center mt-auto">
        {/* Left Action: Back */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[14px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </button>

        {/* Right Actions: Skip & Next */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onSkip}
            className="text-[14px] font-bold text-[#397A0F] hover:opacity-80 transition-colors cursor-pointer"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={onNext}
            className="text-[14px] font-semibold bg-[#397A0F] text-white hover:opacity-90 px-8 py-3 rounded-full flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <span>Next</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
