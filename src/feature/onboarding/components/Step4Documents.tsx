"use client";

import React, { useState, useRef } from "react";
import type { DocumentsData, DocumentItem, DocumentSlotId } from "../types";

interface Step4DocumentsProps {
  data: DocumentsData;
  onChange: (data: DocumentsData) => void;
  onFinish: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const DOCUMENT_SLOTS: {
  slotId: DocumentSlotId;
  label: string;
  badge: string;
}[] = [
  { slotId: "resume", label: "Resume", badge: "Optional" },
  { slotId: "essay", label: "Essay", badge: "Optional" },
  { slotId: "transcript", label: "Transcript", badge: "Optional" },
  { slotId: "recommendation", label: "Recommendation Letter", badge: "Optional" },
  { slotId: "other", label: "Other", badge: "Optional" },
];

export function Step4Documents({
  data,
  onChange,
  onFinish,
  onBack,
  onSkip,
}: Step4DocumentsProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeSlotTarget, setActiveSlotTarget] = useState<DocumentSlotId | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formats file size nicely
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper to determine icon based on file type / name
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      return { icon: "picture_as_pdf", colorClass: "text-danger" };
    }
    if (["png", "jpg", "jpeg", "webp"].includes(ext || "")) {
      return { icon: "image", colorClass: "text-info" };
    }
    return { icon: "description", colorClass: "text-primary" };
  };

  // Simulate mock upload progress: 0% -> 25% -> 50% -> 75% -> 100%
  const simulateUpload = (slotId: DocumentSlotId, file: File) => {
    // 5MB limit check
    if (file.size > 5 * 1024 * 1024) {
      const errorItem: DocumentItem = {
        id: `doc-${Date.now()}`,
        slotId,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || "application/octet-stream",
        uploadedAt: "Failed",
        status: "error",
        progress: 0,
        errorMessage: "File exceeds 5MB limit",
      };
      onChange({ ...data, [slotId]: errorItem });
      return;
    }

    // Set initial uploading state (0%)
    const newItem: DocumentItem = {
      id: `doc-${Date.now()}`,
      slotId,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || "application/octet-stream",
      uploadedAt: "Just now",
      status: "uploading",
      progress: 0,
    };

    onChange({ ...data, [slotId]: newItem });

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 25;

      if (currentProgress >= 100) {
        clearInterval(interval);
        onChange({
          ...data,
          [slotId]: {
            ...newItem,
            progress: 100,
            status: "uploaded",
            uploadedAt: "Just now",
          },
        });
      } else {
        onChange({
          ...data,
          [slotId]: {
            ...newItem,
            progress: currentProgress,
            status: "uploading",
          },
        });
      }
    }, 250);
  };

  // Trigger file dialog
  const triggerFileInput = (slotId?: DocumentSlotId) => {
    if (slotId) {
      setActiveSlotTarget(slotId);
    } else {
      // Find first empty slot or default to resume
      const emptySlot = DOCUMENT_SLOTS.find((s) => !data[s.slotId])?.slotId || "resume";
      setActiveSlotTarget(emptySlot);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && activeSlotTarget) {
      simulateUpload(activeSlotTarget, files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      // Find first empty slot or fallback to 'other'
      const targetSlot =
        DOCUMENT_SLOTS.find((s) => !data[s.slotId])?.slotId || "other";
      simulateUpload(targetSlot, files[0]);
    }
  };

  const handleDelete = (slotId: DocumentSlotId) => {
    onChange({
      ...data,
      [slotId]: null,
    });
  };

  // Collect uploaded documents
  const uploadedFiles = Object.values(data).filter(
    (item): item is DocumentItem => item !== null && item.status === "uploaded"
  );

  return (
    <div className="flex flex-col min-h-full bg-white relative w-full">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileInputChange}
      />

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
        {/* Header Section */}
        <div>
          <h1 className="text-3xl md:text-[34px] font-bold text-on-surface mb-2 tracking-tight">
            Upload your documents
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Please upload your resume/CV and any other relevant documents.
          </p>
        </div>

        {/* Document Slots List */}
        <div className="flex flex-col gap-6">
          {DOCUMENT_SLOTS.map(({ slotId, label, badge }) => {
            const item = data[slotId];
            const isUploading = item?.status === "uploading";
            const isUploaded = item?.status === "uploaded";
            const isError = item?.status === "error";

            return (
              <div key={slotId} className="flex flex-col gap-2">
                <label className="text-base font-semibold text-on-surface flex items-center gap-2">
                  <span>{label}</span>
                  {badge && (
                    <span className="text-xs text-on-surface-variant font-normal">
                      ({badge})
                    </span>
                  )}
                </label>

                {!item && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setActiveSlotTarget(slotId);
                      setIsDragOver(true);
                    }}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      const files = e.dataTransfer.files;
                      if (files && files[0]) {
                        simulateUpload(slotId, files[0]);
                      }
                    }}
                    onClick={() => triggerFileInput(slotId)}
                    className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
                      isDragOver && activeSlotTarget === slotId
                        ? "border-primary bg-primary-container/10"
                        : "border-outline-variant/60 bg-white hover:bg-surface-container-lowest hover:border-primary/60"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary transition-colors">
                        cloud_upload
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-on-surface mb-1">
                      Select a file or drag and drop here
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      PDF, Word document, file size no more than 10MB
                    </p>
                  </div>
                )}

                {isUploading && (
                  <div className="w-full border border-outline-variant/60 rounded-xl p-4 flex flex-col gap-3 bg-surface-container-lowest">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">description</span>
                        <span className="text-sm font-medium text-on-surface">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">{item.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {isUploaded && (
                  <div className="w-full border border-outline-variant/60 rounded-xl p-4 flex justify-between items-center bg-surface-container-lowest group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        description
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-on-surface truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {item.size} • Uploaded {item.uploadedAt}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(slotId)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                )}

                {isError && (
                  <div className="w-full border border-error/50 rounded-xl p-4 flex justify-between items-center bg-error-container/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-error text-2xl">error</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-on-surface truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-error">
                          {item.errorMessage || "Upload failed"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerFileInput(slotId)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/10 transition-colors"
                      title="Try again"
                    >
                      <span className="material-symbols-outlined text-[20px]">refresh</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

        {/* Right Actions: Skip & Finish */}
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
            onClick={onFinish}
            className="text-[14px] font-semibold bg-[#397A0F] text-white hover:opacity-90 px-8 py-3 rounded-full flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <span>Finish</span>
            <span className="material-symbols-outlined text-[18px]">check</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
