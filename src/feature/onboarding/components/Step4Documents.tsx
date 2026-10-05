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

interface StagedFile {
  id: string;
  name: string;
  size: string;
  mimeType: string;
  status: "uploading" | "needs_type";
  progress: number;
  apiId?: string;
  selectedSlot: DocumentSlotKey | "";
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
  docsLoading?: boolean;
}

const SLOTS: { key: DocumentSlotKey; label: string }[] = [
  { key: "resume", label: "Resume" },
  { key: "essay", label: "Essay" },
  { key: "transcript", label: "Transcript" },
  { key: "recommendation", label: "Recommendation Letter" },
  { key: "other", label: "Other" },
];

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
  return match?.id ?? documentTypes[0]?.id;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const CIRCLE_R = 20;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

export function Step4Documents({
  state,
  onChange,
  onFinish,
  onBack,
  onSkip,
  referenceData,
  onUpload,
  onDeleteDoc,
  docsLoading = false,
}: Step4DocumentsProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeSlot, setActiveSlot] = useState<DocumentSlotKey | null>(null);
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [slotUploads, setSlotUploads] = useState<Partial<Record<DocumentSlotKey, { progress: number; fileName: string; fileSize: string }>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stagingFileInputRef = useRef<HTMLInputElement>(null);

  // ── Slot-based upload (clicking a specific slot card) ──
  const handlePickFile = (slotKey?: DocumentSlotKey) => {
    if (slotKey === undefined) {
      // drag zone click → staging flow
      if (stagingFileInputRef.current) {
        stagingFileInputRef.current.value = "";
        stagingFileInputRef.current.click();
      }
      return;
    }
    const target = slotKey;
    setActiveSlot(target);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFile = async (slotKey: DocumentSlotKey, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      onChange({ ...state, [slotKey]: { status: "error", progress: 0, errorMessage: "File exceeds 5MB limit" } });
      return;
    }
    const docTypes = referenceData?.documentTypes ?? [];
    const documentTypeId = findDocumentTypeId(slotKey, docTypes);
    if (!documentTypeId) {
      onChange({ ...state, [slotKey]: { status: "error", progress: 0, errorMessage: "Document type unavailable" } });
      return;
    }
    onChange({ ...state, [slotKey]: { status: "uploading", progress: 0 } });
    setSlotUploads((prev) => ({ ...prev, [slotKey]: { progress: 0, fileName: file.name, fileSize: formatFileSize(file.size) } }));
    const tick = setInterval(() => {
      setSlotUploads((prev) => {
        const cur = prev[slotKey]?.progress ?? 0;
        if (cur >= 80) return prev;
        return { ...prev, [slotKey]: { ...prev[slotKey]!, progress: Math.min(cur + 10 + Math.random() * 10, 80) } };
      });
    }, 350);
    try {
      const apiId = await onUpload(slotKey, file, documentTypeId);
      clearInterval(tick);
      setSlotUploads((prev) => { const n = { ...prev }; delete n[slotKey]; return n; });
      onChange({
        ...state,
        [slotKey]: {
          status: "uploaded",
          progress: 100,
          doc: { apiId, slotKey, name: file.name, size: formatFileSize(file.size), type: file.type },
        },
      });
    } catch {
      clearInterval(tick);
      setSlotUploads((prev) => { const n = { ...prev }; delete n[slotKey]; return n; });
      onChange({ ...state, [slotKey]: { status: "error", progress: 0, errorMessage: "Upload failed. Please try again." } });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSlot) handleFile(activeSlot, file);
  };

  // ── Staged upload (drag & drop zone) ──
  const handleStageFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) return;
    const docTypes = referenceData?.documentTypes ?? [];
    const defaultId = docTypes[0]?.id ?? "";
    const stageId = `staged-${Date.now()}`;

    setStaged((prev) => [
      ...prev,
      { id: stageId, name: file.name, size: formatFileSize(file.size), mimeType: file.type, status: "uploading", progress: 0, selectedSlot: "" },
    ]);

    const tick = setInterval(() => {
      setStaged((prev) =>
        prev.map((f) =>
          f.id === stageId && f.status === "uploading" && f.progress < 80
            ? { ...f, progress: Math.min(f.progress + 10 + Math.random() * 10, 80) }
            : f
        )
      );
    }, 350);

    try {
      const apiId = await onUpload("other", file, defaultId);
      clearInterval(tick);
      setStaged((prev) =>
        prev.map((f) => (f.id === stageId ? { ...f, status: "needs_type", progress: 100, apiId } : f))
      );
    } catch {
      clearInterval(tick);
      setStaged((prev) => prev.filter((f) => f.id !== stageId));
    }
  };

  const handleConfirmStagedType = (stageId: string, slot: DocumentSlotKey) => {
    const sf = staged.find((f) => f.id === stageId);
    if (!sf?.apiId) return;
    onChange({
      ...state,
      [slot]: {
        status: "uploaded",
        progress: 100,
        doc: { apiId: sf.apiId, slotKey: slot, name: sf.name, size: sf.size, type: sf.mimeType },
      },
    });
    setStaged((prev) => prev.filter((f) => f.id !== stageId));
  };

  const handleStagingFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleStageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleStageFile(file);
  };

  const handleDelete = async (slotKey: DocumentSlotKey) => {
    const doc = state[slotKey].doc;
    if (doc) {
      try { await onDeleteDoc(doc.apiId, slotKey); } catch { /* best-effort */ }
    }
    onChange({ ...state, [slotKey]: { status: "idle", progress: 0 } });
  };

  const uploadedDocs = SLOTS.map((s) => state[s.key]).filter((s) => s.status === "uploaded" && s.doc);

  return (
    <div className="flex flex-col flex-grow">
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" onChange={handleFileInput} />
      <input ref={stagingFileInputRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" onChange={handleStagingFileInput} />

      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-8 pb-8">
        <div className="w-full max-w-4xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-on-background tracking-tight">Add your documents</h1>
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
            <p className="text-xs text-neutral-400 mt-1">Drop any document to assign its type after upload</p>
          </div>

          {/* Staged files (uploading / awaiting type) */}
          {staged.length > 0 && (
            <div className="flex flex-col gap-3">
              {staged.map((sf) => {
                const isPdf = sf.mimeType.includes("pdf");
                const offset = CIRCUMFERENCE - (sf.progress / 100) * CIRCUMFERENCE;
                return (
                  <div key={sf.id} className="flex flex-wrap items-center gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant shadow-xs">
                    {/* File icon + progress circle */}
                    <div className="relative shrink-0 w-12 h-12 flex items-center justify-center">
                      <span
                        className={`material-symbols-outlined text-2xl ${isPdf ? "text-error" : "text-info"}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isPdf ? "picture_as_pdf" : "image"}
                      </span>
                      {sf.status === "uploading" && (
                        <svg
                          className="absolute inset-0 -rotate-90"
                          width="48" height="48" viewBox="0 0 48 48"
                        >
                          <circle cx="24" cy="24" r={CIRCLE_R} fill="none" stroke="currentColor" strokeWidth="3" className="text-outline-variant" />
                          <circle
                            cx="24" cy="24" r={CIRCLE_R} fill="none" stroke="currentColor" strokeWidth="3"
                            className="text-primary transition-all duration-300"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      {sf.status === "needs_type" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: 13 }}>check</span>
                        </div>
                      )}
                    </div>

                    {/* File info */}
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-semibold text-on-background truncate">{sf.name}</p>
                      <p className="text-xs text-on-surface-variant">{sf.size}</p>
                      {sf.status === "uploading" && (
                        <p className="text-xs text-primary font-medium mt-0.5">
                          Uploading… {Math.round(sf.progress)}%
                        </p>
                      )}
                      {sf.status === "needs_type" && (
                        <p className="text-xs text-primary font-medium mt-0.5">Upload complete — select a type</p>
                      )}
                    </div>

                    {/* Type select + Add */}
                    {sf.status === "needs_type" && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                          value={sf.selectedSlot}
                          onChange={(e) => {
                            const slot = e.target.value as DocumentSlotKey | "";
                            setStaged((prev) => prev.map((f) => f.id === sf.id ? { ...f, selectedSlot: slot } : f));
                          }}
                          className="flex-1 sm:flex-none text-sm border border-outline-variant rounded-lg px-3 py-2.5 bg-white text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
                        >
                          <option value="">Select type…</option>
                          {SLOTS.map((s) => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!sf.selectedSlot}
                          onClick={() => sf.selectedSlot && handleConfirmStagedType(sf.id, sf.selectedSlot as DocumentSlotKey)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Slots grid */}
          {docsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {!docsLoading && SLOTS.map(({ key, label }) => {
              const slot = state[key];

              if (slot.status === "uploading") {
                const upload = slotUploads[key];
                const progress = Math.round(upload?.progress ?? 0);
                const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
                return (
                  <div key={key} className="bg-surface-container-low p-4 rounded-xl flex items-center gap-3 border border-primary-container shadow-xs">
                    <div className="relative shrink-0 w-12 h-12 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                      <svg className="absolute inset-0 -rotate-90" width="48" height="48" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r={CIRCLE_R} fill="none" stroke="currentColor" strokeWidth="3" className="text-outline-variant" />
                        <circle cx="24" cy="24" r={CIRCLE_R} fill="none" stroke="currentColor" strokeWidth="3"
                          className="text-primary transition-all duration-300"
                          strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset} strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-semibold text-on-background">{label}</p>
                      {upload?.fileName && <p className="text-xs text-on-surface-variant truncate">{upload.fileName}</p>}
                      <p className="text-xs text-primary font-medium mt-0.5">Uploading… {progress}%</p>
                    </div>
                  </div>
                );
              }

              if (slot.status === "uploaded" && slot.doc) {
                return (
                  <div key={key} className="relative bg-primary/10 px-4 py-4 rounded-xl border border-primary/20 shadow-xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleDelete(key)}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-error-container text-error flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                    </button>
                    <div className="flex flex-col min-w-0 pr-8">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-primary mb-0.5">{label}</span>
                      <span className="text-sm font-semibold text-on-background truncate">{slot.doc.name}</span>
                      <span className="text-xs text-on-surface-variant mt-0.5">{slot.doc.size}</span>
                    </div>
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
              <h3 className="flex items-center gap-2 text-sm font-semibold text-on-surface uppercase tracking-wider">
                <span className="inline-block w-1 h-4 bg-primary rounded-sm" />
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
                        <span className="text-xs text-on-surface-variant">
                          {SLOTS.find((s) => s.key === slot.doc!.slotKey)?.label ?? slot.doc.slotKey} · {slot.doc.size}
                        </span>
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
        <button type="button" onClick={onBack} className="text-sm font-medium text-on-surface-variant hover:text-on-surface px-4 py-3 md:py-2 rounded-md hover:bg-surface-container-high transition-colors flex items-center gap-2 cursor-pointer">
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
