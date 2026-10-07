import { DOCUMENT_SLOTS } from "../../services/documentSlots";
import type { DocumentSlotKey, StagedFile } from "../../types";
import { FileTypeIcon } from "./FileTypeIcon";
import { UploadProgressRing } from "./UploadProgressRing";

interface StagedFileItemProps {
  file: StagedFile;
  onSelectSlot: (slot: DocumentSlotKey | "") => void;
  onConfirm: () => void;
}

/** A dropped file: uploading, then waiting for the user to pick its slot. */
export function StagedFileItem({ file, onSelectSlot, onConfirm }: StagedFileItemProps) {
  const isUploading = file.status === "uploading";

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant shadow-xs">
      <div className="relative shrink-0 w-12 h-12 flex items-center justify-center">
        <FileTypeIcon mimeType={file.mimeType} />
        {isUploading && <UploadProgressRing progress={file.progress} />}
        {!isUploading && (
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary" style={{ fontSize: 13 }}>check</span>
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <p className="text-sm font-semibold text-on-background truncate">{file.name}</p>
        <p className="text-xs text-on-surface-variant">{file.size}</p>
        <p className="text-xs text-primary font-medium mt-0.5">
          {isUploading ? `Uploading… ${Math.round(file.progress)}%` : "Upload complete — select a type"}
        </p>
      </div>

      {!isUploading && (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={file.selectedSlot}
            onChange={(e) => onSelectSlot(e.target.value as DocumentSlotKey | "")}
            aria-label="Document type"
            className="flex-1 sm:flex-none text-sm border border-outline-variant rounded-lg px-3 py-2.5 bg-white text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            <option value="">Select type…</option>
            {DOCUMENT_SLOTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <button
            type="button"
            disabled={!file.selectedSlot}
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
