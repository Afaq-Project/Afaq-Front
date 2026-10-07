import type { ApiDocument, RefDocumentType } from "@/src/feature/profile/types/api";
import type { DocumentSlotKey, DocumentSlotsState, SlotState } from "../types";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,.png,.jpg,.jpeg";

export const DOCUMENT_SLOTS: { key: DocumentSlotKey; label: string }[] = [
  { key: "resume", label: "Resume" },
  { key: "essay", label: "Essay" },
  { key: "transcript", label: "Transcript" },
  { key: "recommendation", label: "Recommendation Letter" },
  { key: "other", label: "Other" },
];

const IDLE_SLOT: SlotState = { status: "idle", progress: 0 };

export const EMPTY_SLOTS: DocumentSlotsState = {
  resume: IDLE_SLOT,
  essay: IDLE_SLOT,
  transcript: IDLE_SLOT,
  recommendation: IDLE_SLOT,
  other: IDLE_SLOT,
};

const SLOT_TYPE_KEYWORDS: Record<DocumentSlotKey, string[]> = {
  resume: ["resume", "cv"],
  essay: ["essay"],
  transcript: ["transcript"],
  recommendation: ["recommendation", "letter"],
  other: ["other"],
};

export function slotLabel(key: DocumentSlotKey): string {
  return DOCUMENT_SLOTS.find((s) => s.key === key)?.label ?? key;
}

/** The API document type that matches a slot, falling back to the first type. */
export function findDocumentTypeId(
  slotKey: DocumentSlotKey,
  documentTypes: RefDocumentType[],
): string | undefined {
  const keywords = SLOT_TYPE_KEYWORDS[slotKey];
  const match = documentTypes.find((dt) =>
    keywords.some((kw) => dt.nameEn.toLowerCase().includes(kw)),
  );
  return match?.id ?? documentTypes[0]?.id;
}

/** The slot a document type belongs to, by its English name. */
export function slotForTypeName(typeNameEn: string): DocumentSlotKey {
  const name = typeNameEn.toLowerCase();
  const slot = DOCUMENT_SLOTS.find(({ key }) =>
    key !== "other" && SLOT_TYPE_KEYWORDS[key].some((kw) => name.includes(kw)),
  );
  return slot?.key ?? "other";
}

/**
 * The API reports no upload progress, so progress is simulated: it creeps up to 80%
 * and jumps to done when the request finishes.
 */
export function nextSimulatedProgress(current: number): number {
  if (current >= 80) return current;
  return Math.min(current + 10 + Math.random() * 10, 80);
}

export const SIMULATED_PROGRESS_INTERVAL_MS = 350;

export function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Places already-uploaded documents into their slots by document type (not file name). */
export function slotsFromDocuments(
  documents: ApiDocument[],
  documentTypes: RefDocumentType[],
): DocumentSlotsState {
  const typeNames = new Map(documentTypes.map((t) => [t.id, t.nameEn]));
  const slots = { ...EMPTY_SLOTS };
  documents.forEach((doc) => {
    const slot = slotForTypeName(typeNames.get(doc.documentTypeId ?? "") ?? "");
    slots[slot] = {
      status: "uploaded",
      progress: 100,
      doc: {
        apiId: doc.id,
        slotKey: slot,
        name: doc.displayName ?? "Document",
        size: formatFileSize(doc.sizeBytes),
        type: doc.mimeType ?? "",
      },
    };
  });
  return slots;
}
