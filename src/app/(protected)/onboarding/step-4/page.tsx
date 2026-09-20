"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Step4Documents } from "@/src/feature/onboarding/components/Step4Documents";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import type { DocumentsData } from "@/src/feature/onboarding/types";

export default function Step4Page() {
  const router = useRouter();
  const { profile, updateDocuments } = useProfile();

  const [documents, setDocuments] = useState<DocumentsData>({
    resume: profile.documents.resume || null,
    essay: profile.documents.essay || null,
    transcript: profile.documents.transcript || null,
    recommendation: profile.documents.recommendation || null,
    other: profile.documents.other || null,
  });

  const handleFinish = () => {
    updateDocuments(documents);
    router.push("/onboarding/complete");
  };

  const handleBack = () => {
    router.push("/onboarding/step-3");
  };

  const handleSkip = () => {
    updateDocuments(documents);
    router.push("/onboarding/complete");
  };

  return (
    <Step4Documents
      data={documents}
      onChange={setDocuments}
      onFinish={handleFinish}
      onBack={handleBack}
      onSkip={handleSkip}
    />
  );
}
