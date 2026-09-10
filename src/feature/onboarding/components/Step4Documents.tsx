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
    <div className="flex flex-col flex-grow min-h-[calc(100vh-10rem)]">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-6 pt-8 md:pt-12 pb-8">
        <div className="w-full max-w-4xl space-y-6 md:space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl md:text-3xl lg:text-[34px] font-semibold text-on-background tracking-tight">
              Add your documents
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant font-medium">
              (you can also do this later)
            </p>
            <p className="text-xs md:text-sm text-outline">
              PDF, DOC, DOCX, PNG, or JPG, up to 5MB per file
            </p>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => triggerFileInput()}
            className={`w-full border-2 border-dashed rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
              isDragOver
                ? "border-primary bg-primary-container/20 scale-[1.01]"
                : "border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-4xl md:text-5xl text-primary mb-3 group-hover:scale-110 transition-transform"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              cloud_upload
            </span>
            <p className="text-sm md:text-base font-semibold text-on-surface">
              Drag and drop files here or click to browse
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Drop any document to automatically assign to an available slot
            </p>
          </div>

          {/* Document Cards Grid (5 independent slots) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {DOCUMENT_SLOTS.map(({ slotId, label, badge }) => {
              const item = data[slotId];
              const isUploading = item?.status === "uploading";
              const isUploaded = item?.status === "uploaded";
              const isError = item?.status === "error";

              // Uploading State
              if (isUploading) {
                return (
                  <div
                    key={slotId}
                    className="bg-surface-container-low p-4 rounded-xl flex flex-col border border-primary-container shadow-xs gap-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant">
                          {badge}
                        </span>
                        <span className="text-sm md:text-base font-semibold text-on-background">
                          {label}
                        </span>
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-primary">
                        {item.progress}%
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-surface-variant rounded-full mt-auto overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                );
              }

              // Uploaded State
              if (isUploaded) {
                return (
                  <div
                    key={slotId}
                    className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-primary/30 shadow-xs group"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">
                        Uploaded
                      </span>
                      <span className="text-sm md:text-base font-semibold text-on-background truncate">
                        {item.name}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {item.size}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(slotId)}
                      title="Remove file"
                      className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:bg-error-container hover:text-danger transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <span
                        className="material-symbols-outlined text-sm group-hover:hidden"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        done
                      </span>
                      <span className="material-symbols-outlined text-sm hidden group-hover:block">
                        delete
                      </span>
                    </button>
                  </div>
                );
              }

              // Error State
              if (isError) {
                return (
                  <div
                    key={slotId}
                    className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-error shadow-xs"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-error">
                        {item.errorMessage || "Upload failed"}
                      </span>
                      <span className="text-sm font-semibold text-on-background truncate">
                        {label}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerFileInput(slotId)}
                      className="w-9 h-9 rounded-full bg-error-container text-error flex items-center justify-center hover:opacity-80 transition-colors flex-shrink-0 cursor-pointer"
                      title="Retry upload"
                    >
                      <span className="material-symbols-outlined text-sm">refresh</span>
                    </button>
                  </div>
                );
              }

              // Idle / Default State
              return (
                <div
                  key={slotId}
                  onClick={() => triggerFileInput(slotId)}
                  className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-transparent hover:border-outline-variant transition-colors shadow-xs cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant">
                      {badge}
                    </span>
                    <span className="text-sm md:text-base font-semibold text-on-background">
                      {label}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">upload</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8 space-y-3">
              <h3 className="text-sm md:text-base font-semibold text-on-background border-b border-surface-variant pb-2 flex items-center justify-between">
                <span>Uploaded Files ({uploadedFiles.length})</span>
                <span className="text-xs font-normal text-on-surface-variant">
                  Hover to remove
                </span>
              </h3>
              <div className="space-y-2">
                {uploadedFiles.map((doc) => {
                  const { icon, colorClass } = getFileIcon(doc.name);
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-surface-container-low/70 hover:bg-surface-container rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`material-symbols-outlined ${colorClass} text-2xl flex-shrink-0`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {icon}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-on-background truncate">
                            {doc.name}
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            {doc.size} • {doc.uploadedAt}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.slotId)}
                        title={`Delete ${doc.name}`}
                        className="text-on-surface-variant hover:text-error hover:bg-error-container p-2 rounded-md transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Custom Footer for Onboarding */}
      <footer className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-4 md:px-8 py-4 rounded-t-xl mt-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs md:text-sm font-medium text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-md hover:bg-surface-container-high transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs md:text-sm font-medium text-primary hover:bg-primary-container/30 px-4 py-2.5 rounded-md transition-colors cursor-pointer"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={onFinish}
            className="bg-primary text-on-primary font-semibold text-xs md:text-sm px-6 py-2.5 rounded-md hover:opacity-90 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Finish</span>
            <span className="material-symbols-outlined text-[18px]">check</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
