"use client";

import { useRouter } from "next/navigation";
import { useDocumentTypes } from "@/src/shared/lib/api/hooks/useReferenceData";
import { useDocumentUploads } from "../../hooks/useDocumentUploads";
import { useFinishOnboarding } from "../../hooks/useFinishOnboarding";
import { stepPath } from "../../services/steps";
import { OnboardingFooter } from "../layout/OnboardingFooter";
import { DocumentDropZone } from "./DocumentDropZone";
import { DocumentSlotGrid } from "./DocumentSlotGrid";
import { StagedFileItem } from "./StagedFileItem";
import { UploadedFileList } from "./UploadedFileList";

/** Step 4 (optional): documents upload as they're added; Finish closes onboarding. */
export function DocumentsStep() {
  const router = useRouter();
  const { data: documentTypes = [], isLoading: typesLoading } = useDocumentTypes();
  const documents = useDocumentUploads(documentTypes, typesLoading);
  const { finish, isFinishing } = useFinishOnboarding();

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-8 pb-8">
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-on-background tracking-tight">Add your documents</h1>
            <p className="text-sm text-on-surface-variant font-medium">(you can also do this later)</p>
            <p className="text-xs text-outline">PDF, DOC, DOCX, PNG, or JPG, up to 5MB per file</p>
          </div>

          <DocumentDropZone onFile={documents.stageFile} />

          {documents.staged.length > 0 && (
            <div className="flex flex-col gap-3">
              {documents.staged.map((file) => (
                <StagedFileItem
                  key={file.id}
                  file={file}
                  onSelectSlot={(slot) => documents.selectStagedSlot(file.id, slot)}
                  onConfirm={() => documents.confirmStaged(file.id)}
                />
              ))}
            </div>
          )}

          {documents.docsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <DocumentSlotGrid
              slots={documents.slots}
              slotUploads={documents.slotUploads}
              onUpload={documents.uploadToSlot}
              onDelete={documents.removeFromSlot}
            />
          )}

          <UploadedFileList slots={documents.slots} onDelete={documents.removeFromSlot} />
        </div>
      </main>

      <OnboardingFooter
        onNext={finish}
        onBack={() => router.push(stepPath(3))}
        onSkip={finish}
        nextLabel="Finish"
        nextIcon="check"
        isSaving={isFinishing}
      />
    </div>
  );
}
