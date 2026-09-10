"use client";

import React, { useState } from "react";
import { OnboardingHeader } from "./OnboardingHeader";
import { Step1Education } from "./Step1Education";
import { Step2BackgroundGoals } from "./Step2BackgroundGoals";
import { Step3SkillsLanguage } from "./Step3SkillsLanguage";
import { Step4Documents } from "./Step4Documents";
import { OnboardingComplete } from "./OnboardingComplete";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import type {
  EducationData,
  BackgroundData,
  SkillsData,
  DocumentsData,
} from "../types";

export function OnboardingWizard() {
  const { profile, updateEducation, updateBackground, updateSkills, updateDocuments } =
    useProfile();

  // Step state: 1, 2, 3, 4, or 5 (Completion)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Local form state preserved across Back/Next navigation
  const [education, setEducation] = useState<EducationData>({
    educationLevel: profile.education.educationLevel || "",
    fieldsOfStudy: profile.education.fieldsOfStudy || [],
    nationality: profile.education.nationality || "",
  });

  const [background, setBackground] = useState<BackgroundData>({
    gpa: profile.background.gpa || "",
    gpaScale: profile.background.gpaScale || "4.0",
    experienceLevel: profile.background.experienceLevel || "entry",
    financialNeed: profile.background.financialNeed || "prefer_not",
    goals: profile.background.goals || "",
  });

  const [skills, setSkills] = useState<SkillsData>({
    skills: profile.skills.skills || ["Python", "Data Analysis"],
    languages:
      profile.skills.languages.length > 0
        ? profile.skills.languages
        : [
            { id: "lang-1", language: "English", level: "C2 Proficient" },
          ],
  });

  const [documents, setDocuments] = useState<DocumentsData>({
    resume: profile.documents.resume || null,
    essay: profile.documents.essay || null,
    transcript: profile.documents.transcript || null,
    recommendation: profile.documents.recommendation || null,
    other: profile.documents.other || null,
  });

  // Navigation handlers
  const handleNextFromStep1 = () => {
    updateEducation(education);
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    updateBackground(background);
    setCurrentStep(3);
  };

  const handleSkipFromStep2 = () => {
    updateBackground(background);
    setCurrentStep(3);
  };

  const handleNextFromStep3 = () => {
    updateSkills(skills);
    setCurrentStep(4);
  };

  const handleSkipFromStep3 = () => {
    updateSkills(skills);
    setCurrentStep(4);
  };

  const handleFinishFromStep4 = () => {
    // Persist all data to shared profile state
    updateEducation(education);
    updateBackground(background);
    updateSkills(skills);
    updateDocuments(documents);
    setCurrentStep(5);
  };

  const handleSkipFromStep4 = () => {
    updateEducation(education);
    updateBackground(background);
    updateSkills(skills);
    updateDocuments(documents);
    setCurrentStep(5);
  };

  // Calculate dynamic completion % based on user progress
  const calculateProgressScore = (): number => {
    let score = 40; // Base score for completing Step 1
    if (background.gpa || background.experienceLevel !== "none") score += 15;
    if (skills.skills.length > 0) score += 15;
    if (skills.languages.length > 0) score += 10;
    const hasDocs = Object.values(documents).some(
      (d) => d !== null && d.status === "uploaded"
    );
    if (hasDocs) score += 15;
    return Math.min(100, Math.max(65, score));
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
      {/* Transactional linear header (visible on steps 1-4) */}
      {currentStep <= 4 && (
        <OnboardingHeader currentStep={currentStep} totalSteps={4} />
      )}

      {/* Step Views */}
      {currentStep === 1 && (
        <Step1Education
          data={education}
          onChange={setEducation}
          onNext={handleNextFromStep1}
        />
      )}

      {currentStep === 2 && (
        <Step2BackgroundGoals
          data={background}
          onChange={setBackground}
          onNext={handleNextFromStep2}
          onBack={() => setCurrentStep(1)}
          onSkip={handleSkipFromStep2}
        />
      )}

      {currentStep === 3 && (
        <Step3SkillsLanguage
          data={skills}
          onChange={setSkills}
          onNext={handleNextFromStep3}
          onBack={() => setCurrentStep(2)}
          onSkip={handleSkipFromStep3}
        />
      )}

      {currentStep === 4 && (
        <Step4Documents
          data={documents}
          onChange={setDocuments}
          onFinish={handleFinishFromStep4}
          onBack={() => setCurrentStep(3)}
          onSkip={handleSkipFromStep4}
        />
      )}

      {currentStep === 5 && (
        <OnboardingComplete completionPercentage={calculateProgressScore()} />
      )}
    </div>
  );
}
