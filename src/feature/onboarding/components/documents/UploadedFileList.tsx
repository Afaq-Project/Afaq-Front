import { DOCUMENT_SLOTS, slotLabel } from "../../services/documentSlots";
import type { DocumentSlotKey, DocumentSlotsState, UploadedDoc } from "../../types";
import { FileTypeIcon } from "./FileTypeIcon";

interface UploadedFileListProps {
  slots: DocumentSlotsState;
  onDelete: (slot: DocumentSlotKey) => void;
}

/** Summary of every uploaded document. Renders nothing when there are none. */
export function UploadedFileList({ slots, onDelete }: UploadedFileListProps) {
  const docs = DOCUMENT_SLOTS.map((s) => slots[s.key])
    .filter((slot) => slot.status === "uploaded" && slot.doc)
    .map((slot) => slot.doc as UploadedDoc);

  if (docs.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-on-surface uppercase tracking-wider">
        <span className="inline-block w-1 h-4 bg-primary rounded-sm" />
        Uploaded Files ({docs.length})
      </h3>
      {docs.map((doc) => (
        <div
          key={doc.apiId}
          className="flex items-center justify-between p-3 bg-surface-container-low/70 hover:bg-surface-container rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <FileTypeIcon mimeType={doc.type} className="flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-on-background truncate">{doc.name}</span>
              <span className="text-xs text-on-surface-variant">
                {slotLabel(doc.slotKey)} · {doc.size}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDelete(doc.slotKey)}
            aria-label={`Delete ${doc.name}`}
            className="text-on-surface-variant hover:text-error hover:bg-error-container p-2 rounded-md transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      ))}
    </div>
  );
}
