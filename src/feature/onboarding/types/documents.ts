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

export type DocumentSlotsState = Record<DocumentSlotKey, SlotState>;

/** Progress of a file being uploaded straight into a slot. */
export interface SlotUpload {
  progress: number;
  fileName: string;
  fileSize: string;
}

/** A file dropped on the drop zone: uploaded first, then assigned a slot by the user. */
export interface StagedFile {
  id: string;
  name: string;
  size: string;
  mimeType: string;
  status: "uploading" | "needs_type";
  progress: number;
  apiId?: string;
  selectedSlot: DocumentSlotKey | "";
}
