"use client";

import { useRef, useState } from "react";
import { ACCEPTED_FILE_TYPES } from "../../services/documentSlots";

/** Drag-and-drop (or click-to-browse) area for one file at a time. */
export function DocumentDropZone({ onFile }: { onFile: (file: File) => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const browse = () => {
    if (!inputRef.current) return;
    inputRef.current.value = "";
    inputRef.current.click();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && browse()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onFile(file);
        }}
        onClick={browse}
        className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${isDragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-neutral-200 bg-neutral-50 hover:border-primary/40 hover:bg-primary/[0.03]"}`}
      >
        <span
          className="material-symbols-outlined text-4xl text-primary mb-3 group-hover:scale-110 transition-transform"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          cloud_upload
        </span>
        <p className="text-sm font-semibold text-neutral-800">Drag and drop files here or click to browse</p>
        <p className="text-xs text-neutral-400 mt-1">Drop any document to assign its type after upload</p>
      </div>
    </>
  );
}
