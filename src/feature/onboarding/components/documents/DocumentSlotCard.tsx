import type { SlotState, SlotUpload } from "../../types";
import { UploadProgressRing } from "./UploadProgressRing";

interface DocumentSlotCardProps {
  label: string;
  slot: SlotState;
  upload?: SlotUpload;
  onPick: () => void;
  onDelete: () => void;
}

/** One document slot, rendered for its state: idle, uploading, uploaded or failed. */
export function DocumentSlotCard({ label, slot, upload, onPick, onDelete }: DocumentSlotCardProps) {
  if (slot.status === "uploading") {
    const progress = Math.round(upload?.progress ?? 0);
    return (
      <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-3 border border-primary-container shadow-xs">
        <div className="relative shrink-0 w-12 h-12 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>
            description
          </span>
          <UploadProgressRing progress={progress} />
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
      <div className="relative bg-primary/10 px-4 py-4 rounded-xl border border-primary/20 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${label}`}
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
      <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-error shadow-xs">
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-error">
            {slot.errorMessage ?? "Upload failed"}
          </span>
          <span className="text-sm font-semibold text-on-background">{label}</span>
        </div>
        <button
          type="button"
          onClick={onPick}
          aria-label={`Retry ${label}`}
          className="w-9 h-9 rounded-full bg-error-container text-error flex items-center justify-center hover:opacity-80 transition-colors flex-shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick()}
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
}
