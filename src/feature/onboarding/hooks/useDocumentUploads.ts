"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/src/feature/profile/services/profileService";
import type { RefDocumentType } from "@/src/feature/profile/types/api";
import type { DocumentSlotKey, DocumentSlotsState, SlotState, SlotUpload, StagedFile } from "../types";
import {
  EMPTY_SLOTS,
  MAX_FILE_SIZE,
  SIMULATED_PROGRESS_INTERVAL_MS,
  findDocumentTypeId,
  formatFileSize,
  nextSimulatedProgress,
  slotsFromDocuments,
} from "../services/documentSlots";

/**
 * Document state for the documents step: the five slots, uploads in progress, and files
 * dropped on the drop zone that still need a slot. Uploads go to the API immediately.
 */
export function useDocumentUploads(documentTypes: RefDocumentType[], typesLoading: boolean) {
  const [slots, setSlots] = useState<DocumentSlotsState>(EMPTY_SLOTS);
  const [slotUploads, setSlotUploads] = useState<Partial<Record<DocumentSlotKey, SlotUpload>>>({});
  const [staged, setStaged] = useState<StagedFile[]>([]);

  const { data: existingDocs, isLoading: docsLoading } = useQuery({
    queryKey: ["profile", "documents"],
    queryFn: profileService.listDocuments,
  });

  // Seed once only — a background refetch must not overwrite uploads in progress.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current || !existingDocs?.length || typesLoading) return;
    seeded.current = true;
    setSlots(slotsFromDocuments(existingDocs, documentTypes));
  }, [existingDocs, documentTypes, typesLoading]);

  // Always update from the latest state: uploads finish asynchronously and may overlap.
  const setSlot = (key: DocumentSlotKey, state: SlotState) =>
    setSlots((prev) => ({ ...prev, [key]: state }));

  const clearSlotUpload = (key: DocumentSlotKey) =>
    setSlotUploads((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  /** Uploads a file straight into a slot (clicking a slot card). */
  const uploadToSlot = async (slotKey: DocumentSlotKey, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setSlot(slotKey, { status: "error", progress: 0, errorMessage: "File exceeds 5MB limit" });
      return;
    }
    const documentTypeId = findDocumentTypeId(slotKey, documentTypes);
    if (!documentTypeId) {
      setSlot(slotKey, { status: "error", progress: 0, errorMessage: "Document type unavailable" });
      return;
    }

    setSlot(slotKey, { status: "uploading", progress: 0 });
    setSlotUploads((prev) => ({
      ...prev,
      [slotKey]: { progress: 0, fileName: file.name, fileSize: formatFileSize(file.size) },
    }));
    const tick = setInterval(() => {
      setSlotUploads((prev) => {
        const current = prev[slotKey];
        return current
          ? { ...prev, [slotKey]: { ...current, progress: nextSimulatedProgress(current.progress) } }
          : prev;
      });
    }, SIMULATED_PROGRESS_INTERVAL_MS);

    try {
      const doc = await profileService.uploadDocument(documentTypeId, file);
      setSlot(slotKey, {
        status: "uploaded",
        progress: 100,
        doc: { apiId: doc.id, slotKey, name: file.name, size: formatFileSize(file.size), type: file.type },
      });
    } catch {
      setSlot(slotKey, { status: "error", progress: 0, errorMessage: "Upload failed. Please try again." });
    } finally {
      clearInterval(tick);
      clearSlotUpload(slotKey);
    }
  };

  /** Uploads a dropped file; the user picks its slot once the upload finishes. */
  const stageFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) return;
    // There is no endpoint to change a document's type later, so staged files are stored
    // under the first document type whatever slot the user then picks.
    const defaultTypeId = documentTypes[0]?.id ?? "";
    const stageId = `staged-${Date.now()}`;

    setStaged((prev) => [
      ...prev,
      {
        id: stageId,
        name: file.name,
        size: formatFileSize(file.size),
        mimeType: file.type,
        status: "uploading",
        progress: 0,
        selectedSlot: "",
      },
    ]);
    const tick = setInterval(() => {
      setStaged((prev) =>
        prev.map((f) =>
          f.id === stageId && f.status === "uploading"
            ? { ...f, progress: nextSimulatedProgress(f.progress) }
            : f,
        ),
      );
    }, SIMULATED_PROGRESS_INTERVAL_MS);

    try {
      const doc = await profileService.uploadDocument(defaultTypeId, file);
      setStaged((prev) =>
        prev.map((f) => (f.id === stageId ? { ...f, status: "needs_type", progress: 100, apiId: doc.id } : f)),
      );
    } catch {
      setStaged((prev) => prev.filter((f) => f.id !== stageId));
    } finally {
      clearInterval(tick);
    }
  };

  const selectStagedSlot = (stageId: string, slot: DocumentSlotKey | "") =>
    setStaged((prev) => prev.map((f) => (f.id === stageId ? { ...f, selectedSlot: slot } : f)));

  /** Moves an uploaded staged file into the slot the user picked. */
  const confirmStaged = (stageId: string) => {
    const file = staged.find((f) => f.id === stageId);
    if (!file?.apiId || !file.selectedSlot) return;
    const slot = file.selectedSlot;
    setSlot(slot, {
      status: "uploaded",
      progress: 100,
      doc: { apiId: file.apiId, slotKey: slot, name: file.name, size: file.size, type: file.mimeType },
    });
    setStaged((prev) => prev.filter((f) => f.id !== stageId));
  };

  const removeFromSlot = async (slotKey: DocumentSlotKey) => {
    const doc = slots[slotKey].doc;
    if (doc) {
      try {
        await profileService.deleteDocument(doc.apiId);
      } catch {
        // Best-effort: the slot is cleared either way.
      }
    }
    setSlot(slotKey, { status: "idle", progress: 0 });
  };

  return {
    slots,
    slotUploads,
    staged,
    docsLoading,
    uploadToSlot,
    stageFile,
    selectStagedSlot,
    confirmStaged,
    removeFromSlot,
  };
}
