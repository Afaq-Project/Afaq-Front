"use client";

import { useRef, useState } from "react";
import { ACCEPTED_FILE_TYPES, DOCUMENT_SLOTS } from "../../services/documentSlots";
import type { DocumentSlotKey, DocumentSlotsState, SlotUpload } from "../../types";
import { DocumentSlotCard } from "./DocumentSlotCard";

interface DocumentSlotGridProps {
  slots: DocumentSlotsState;
  slotUploads: Partial<Record<DocumentSlotKey, SlotUpload>>;
  onUpload: (slot: DocumentSlotKey, file: File) => void;
  onDelete: (slot: DocumentSlotKey) => void;
}

/** The five document slots; clicking one opens a file picker for that slot. */
export function DocumentSlotGrid({ slots, slotUploads, onUpload, onDelete }: DocumentSlotGridProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [targetSlot, setTargetSlot] = useState<DocumentSlotKey | null>(null);

  const pickFileFor = (slot: DocumentSlotKey) => {
    setTargetSlot(slot);
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
          if (file && targetSlot) onUpload(targetSlot, file);
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {DOCUMENT_SLOTS.map(({ key, label }) => (
          <DocumentSlotCard
            key={key}
            label={label}
            slot={slots[key]}
            upload={slotUploads[key]}
            onPick={() => pickFileFor(key)}
            onDelete={() => onDelete(key)}
          />
        ))}
      </div>
    </>
  );
}
