"use client";

import React, { useRef, useState } from "react";
import type { RefDocumentType } from "@/src/feature/profile/types/api";

export type DocumentSlotKey = "resume" | "essay" | "transcript" | "recommendation" | "other";

export interface UploadedDoc {
  apiId: string;
  slotKey: DocumentSlotKey;
  name: string;
  size: string;
  type: string;
}

export interface SlotState {
  status: "idle" | "uploading" | "uploaded" | "error";
  progress: number;
  doc?: UploadedDoc;
  errorMessage?: string;
}

export interface Step4DocumentsState {
  resume: SlotState;
  essay: SlotState;
  transcript: SlotState;
  recommendation: SlotState;
  other: SlotState;
}

export interface Step4ReferenceData {
  documentTypes: RefDocumentType[];
  isLoading: boolean;
}

interface Step4DocumentsProps {
  state: Step4DocumentsState;
  onChange: (state: Step4DocumentsState) => void;
  onFinish: () => void;
  onBack: () => void;
  onSkip: () => void;
  referenceData?: Step4ReferenceData;
  onUpload: (slotKey: DocumentSlotKey, file: File, documentTypeId: string) => Promise<string>;
  onDeleteDoc: (apiId: string, slotKey: DocumentSlotKey) => Promise<void>;
}

const SLOTS: { key: DocumentSlotKey; label: string }[] = [
  { key: "resume", label: "Resume" },
  { key: "essay", label: "Essay" },
  { key: "transcript", label: "Transcript" },
  { key: "recommendation", label: "Recommendation Letter" },
  { key: "other", label: "Other" },
];

// Map slot key to likely document type name from the API
const SLOT_TYPE_KEYWORDS: Record<DocumentSlotKey, string[]> = {
  resume: ["resume", "cv"],
  essay: ["essay"],
  transcript: ["transcript"],
  recommendation: ["recommendation", "letter"],
  other: ["other"],
};

function findDocumentTypeId(
  slotKey: DocumentSlotKey,
  documentTypes: RefDocumentType[]
): string | undefined {
  const keywords = SLOT_TYPE_KEYWORDS[slotKey];
  const match = documentTypes.find((dt) =>
    keywords.some((kw) => dt.nameEn.toLowerCase().includes(kw))
  );
  // If no match, fall back to the first document type
  return match?.id ?? documentTypes[0]?.id;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function Step4Documents({
  state,
  onChange,
  onFinish,
  onBack,
  onSkip,
  referenceData,
  onUpload,
  onDeleteDoc,
}: Step4DocumentsProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeSlot, setActiveSlot] = useState<DocumentSlotKey | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePickFile = (slotKey?: DocumentSlotKey) => {
    const target = slotKey ?? (SLOTS.find((s) => state[s.key].status === "idle")?.key ?? "other");
    setActiveSlot(target);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFile = async (slotKey: DocumentSlotKey, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      onChange({
        ...state,
        [slotKey]: { status: "error", progress: 0, errorMessage: "File exceeds 5MB limit" },
      });
      return;
    }

    const docTypes = referenceData?.documentTypes ?? [];
    const documentTypeId = findDocumentTypeId(slotKey, docTypes);
    if (!documentTypeId) {
      onChange({
        ...state,
        [slotKey]: { status: "error", progress: 0, errorMessage: "Document type unavailable" },
      });
      return;
    }

    onChange({ ...state, [slotKey]: { status: "uploading", progress: 0 } });

    try {
      const apiId = await onUpload(slotKey, file, documentTypeId);
      onChange({
        ...state,
        [slotKey]: {
          status: "uploaded",
          progress: 100,
          doc: {
            apiId,
            slotKey,
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
          },
        },
      });
    } catch {
      onChange({
        ...state,
        [slotKey]: { status: "error", progress: 0, errorMessage: "Upload failed. Please try again." },
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSlot) handleFile(activeSlot, file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const target = SLOTS.find((s) => state[s.key].status === "idle")?.key ?? "other";
    handleFile(target, file);
  };

  const handleDelete = async (slotKey: DocumentSlotKey) => {
    const doc = state[slotKey].doc;
    if (doc) {
      try {
        await onDeleteDoc(doc.apiId, slotKey);
      } catch {
        // best-effort delete
      }
    }
    onChange({ ...state, [slotKey]: { status: "idle", progress: 0 } });
  };

  const uploadedDocs = SLOTS.map((s) => state[s.key]).filter((s) => s.status === "uploaded" && s.doc);

  return (
    <div className="flex flex-col flex-grow">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileInput}
      />

      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-8 pb-8">
        <div className="w-full max-w-4xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-on-background tracking-tight">
              Add your documents
            </h1>
            <p className="text-sm text-on-surface-variant font-medium">(you can also do this later)</p>
            <p className="text-xs text-outline">PDF, DOC, DOCX, PNG, or JPG, up to 5MB per file</p>
          </div>

          {/* Drag & drop area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
            onDrop={handleDrop}
            onClick={() => handlePickFile()}
            className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${isDragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-neutral-200 bg-neutral-50 hover:border-primary/40 hover:bg-primary/[0.03]"}`}
          >
            <span className="material-symbols-outlined text-4xl text-primary mb-3 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
              cloud_upload
            </span>
            <p className="text-sm font-semibold text-neutral-800">Drag and drop files here or click to browse</p>
            <p className="text-xs text-neutral-400 mt-1">Drop any document to automatically assign to an available slot</p>
          </div>

          {/* Slots grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SLOTS.map(({ key, label }) => {
              const slot = state[key];

              if (slot.status === "uploading") {
                return (
                  <div key={key} className="bg-surface-container-low p-4 rounded-xl flex flex-col border border-primary-container shadow-xs gap-3 relative overflow-hidden">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant">Optional</span>
                        <p className="text-sm font-semibold text-on-background">{label}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{slot.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${slot.progress}%` }} />
                    </div>
                  </div>
                );
              }

              if (slot.status === "uploaded" && slot.doc) {
                return (
                  <div key={key} className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-primary/30 shadow-xs group">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">Uploaded</span>
                      <span className="text-sm font-semibold text-on-background truncate">{slot.doc.name}</span>
                      <span className="text-xs text-on-surface-variant">{slot.doc.size}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(key)}
                      className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:bg-error-container hover:text-error transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm group-hover:hidden" style={{ fontVariationSettings: "'FILL' 1" }}>done</span>
                      <span className="material-symbols-outlined text-sm hidden group-hover:block">delete</span>
                    </button>
                  </div>
                );
              }

              if (slot.status === "error") {
                return (
                  <div key={key} className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-error shadow-xs">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-error">{slot.errorMessage ?? "Upload failed"}</span>
                      <span className="text-sm font-semibold text-on-background">{label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePickFile(key)}
                      className="w-9 h-9 rounded-full bg-error-container text-error flex items-center justify-center hover:opacity-80 transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">refresh</span>
                    </button>
                  </div>
                );
              }

              // idle
              return (
                <div
                  key={key}
                  onClick={() => handlePickFile(key)}
                  className="bg-neutral-50 px-5 py-4 rounded-xl flex items-center justify-between border border-neutral-100 hover:border-neutral-300 hover:bg-white transition-all cursor-pointer group"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">Optional</span>
                    <p className="text-sm font-semibold text-neutral-900">{label}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-neutral-200 group-hover:bg-primary/10 text-neutral-500 group-hover:text-primary flex items-center justify-center flex-shrink-0 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Uploaded list */}
          {uploadedDocs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-on-background border-b border-surface-variant pb-2">
                Uploaded Files ({uploadedDocs.length})
              </h3>
              {uploadedDocs.map((slot) => {
                if (!slot.doc) return null;
                const isPdf = slot.doc.type.includes("pdf");
                return (
                  <div key={slot.doc.apiId} className="flex items-center justify-between p-3 bg-surface-container-low/70 hover:bg-surface-container rounded-lg transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`material-symbols-outlined text-2xl flex-shrink-0 ${isPdf ? "text-error" : "text-info"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isPdf ? "picture_as_pdf" : "image"}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-on-background truncate">{slot.doc.name}</span>
                        <span className="text-xs text-on-surface-variant">{slot.doc.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(slot.doc!.slotKey)}
                      className="text-on-surface-variant hover:text-error hover:bg-error-container p-2 rounded-md transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Bottom nav */}
      <footer className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-6 py-4 mt-auto flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm font-medium text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-md hover:bg-surface-container-high transition-colors flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onSkip} className="text-sm font-medium text-primary hover:bg-primary-container/30 px-4 py-2.5 rounded-md transition-colors cursor-pointer">
            Skip for now
          </button>
          <button type="button" onClick={onFinish} className="bg-primary text-on-primary font-semibold text-sm px-6 py-2.5 rounded-md hover:opacity-90 transition-all shadow-sm flex items-center gap-2 cursor-pointer">
            Finish
            <span className="material-symbols-outlined text-[18px]">check</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
