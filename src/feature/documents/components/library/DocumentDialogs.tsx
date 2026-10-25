"use client";

import { useState } from "react";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/src/feature/onboarding/services/documentSlots";
import { DOCUMENT_TYPES, isReviewable, type DocumentTypeKey } from "@/src/shared/lib/document-types";
import { buttonClasses } from "@/src/shared/ui/Button";
import Modal from "@/src/shared/ui/Modal";
import type { DocumentItem, TrackedApplication } from "../../types/document";

const FIELD_CLASS =
  "bg-white px-3 border border-neutral-200 focus:border-primary-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full h-10 text-body text-neutral-900";

export type DialogKind = "rename" | "type" | "replace" | "link" | "delete";

interface DocumentDialogProps {
  kind: DialogKind | null;
  item: DocumentItem | null;
  applications: TrackedApplication[];
  busy: boolean;
  onClose: () => void;
  onRename: (name: string) => void;
  onChangeType: (type: DocumentTypeKey) => void;
  onReplace: (file: File) => void;
  onLink: (applicationIds: string[]) => void;
  onDelete: () => void;
}

const TITLES: Record<DialogKind, string> = {
  rename: "Rename document",
  type: "Change type",
  replace: "Replace file",
  link: "Link to application",
  delete: "Delete document?",
};

function Actions({ busy, submitLabel, destructive, onCancel }: { busy: boolean; submitLabel: string; destructive?: boolean; onCancel: () => void }) {
  return (
    <div className="flex justify-end gap-2 mt-5">
      <button type="button" onClick={onCancel} disabled={busy} className={buttonClasses("ghost")}>
        Cancel
      </button>
      <button type="submit" disabled={busy} className={buttonClasses(destructive ? "destructive" : "primary")}>
        {submitLabel}
      </button>
    </div>
  );
}

/** One dialog for every row action; `kind` picks the form. */
export function DocumentDialog({ kind, item, applications, busy, onClose, onRename, onChangeType, onReplace, onLink, onDelete }: DocumentDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<DocumentTypeKey>("other");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [links, setLinks] = useState<string[]>([]);

  // Reset the form whenever a dialog opens for a document.
  const [openedFor, setOpenedFor] = useState<string | null>(null);
  const key = kind && item ? `${kind}:${item.id}` : null;
  if (key !== openedFor) {
    setOpenedFor(key);
    if (item) {
      setName(item.name);
      setType(item.type ?? "other");
      setFile(null);
      setFileError(null);
      setLinks(item.usedIn.map((application) => application.id));
    }
  }

  if (!kind || !item) return null;

  const submit = () => {
    if (kind === "rename" && name.trim()) onRename(name.trim());
    if (kind === "type") onChangeType(type);
    if (kind === "replace") {
      if (!file) return setFileError("Choose a file to upload.");
      onReplace(file);
    }
    if (kind === "link") onLink(links);
    if (kind === "delete") onDelete();
  };

  return (
    <Modal open onClose={busy ? () => {} : onClose} title={TITLES[kind]} className="max-w-md">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {kind === "rename" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-caption text-neutral-600">Name</span>
            <input autoFocus value={name} onChange={(event) => setName(event.target.value)} className={FIELD_CLASS} />
          </label>
        )}

        {kind === "type" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-caption text-neutral-600">Document type</span>
            <select autoFocus value={type} onChange={(event) => setType(event.target.value as DocumentTypeKey)} className={FIELD_CLASS}>
              {DOCUMENT_TYPES.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {kind === "replace" && (
          <div className="flex flex-col gap-2">
            <p className="text-body text-neutral-800">
              Uploads a new file for {item.name} under the same type, then removes the old one.
              {isReviewable(item.type) && " Its current review stays until you review the new file."}
            </p>
            <input
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              aria-label="Choose a file"
              onChange={(event) => {
                const picked = event.target.files?.[0] ?? null;
                if (picked && picked.size > MAX_FILE_SIZE) {
                  setFile(null);
                  setFileError(`That file is larger than ${MAX_FILE_SIZE / (1024 * 1024)} MB. Try a smaller file.`);
                  return;
                }
                setFileError(null);
                setFile(picked);
              }}
              className="file:bg-white file:me-3 file:px-3 file:border file:border-neutral-200 file:rounded-sm file:h-9 file:font-medium text-neutral-800 text-small file:text-neutral-800 file:cursor-pointer"
            />
            {fileError && (
              <p role="alert" className="text-danger-800 text-small">
                {fileError}
              </p>
            )}
          </div>
        )}

        {kind === "link" &&
          (applications.length === 0 ? (
            <p className="text-neutral-600 text-small">You aren&apos;t tracking any applications yet.</p>
          ) : (
            <fieldset className="flex flex-col gap-1">
              <legend className="sr-only">Applications</legend>
              {applications.map((application) => (
                <label key={application.id} className="flex items-center gap-2.5 min-h-11 md:min-h-9 text-neutral-800 text-small cursor-pointer">
                  <input
                    type="checkbox"
                    checked={links.includes(application.id)}
                    onChange={() =>
                      setLinks((prev) =>
                        prev.includes(application.id) ? prev.filter((id) => id !== application.id) : [...prev, application.id],
                      )
                    }
                    className="accent-primary-600 size-4"
                  />
                  {application.title}
                </label>
              ))}
            </fieldset>
          ))}

        {kind === "delete" && (
          <p className="text-body text-neutral-800">
            {item.usedIn.length > 0
              ? `This document is used in ${item.usedIn.length} ${item.usedIn.length === 1 ? "application" : "applications"}. They'll show it as missing.`
              : `${item.name} will be deleted. This can't be undone.`}
          </p>
        )}

        <Actions
          busy={busy}
          onCancel={onClose}
          destructive={kind === "delete"}
          submitLabel={
            kind === "delete" ? "Delete document" : kind === "replace" ? (busy ? "Replacing…" : "Replace file") : "Save"
          }
        />
      </form>
    </Modal>
  );
}
