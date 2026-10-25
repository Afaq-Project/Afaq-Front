"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useDocumentTypeLabel } from "@/src/shared/lib/useDocumentTypeLabel";
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

function Actions({ busy, submitLabel, destructive, onCancel }: { busy: boolean; submitLabel: string; destructive?: boolean; onCancel: () => void }) {
  const t = useTranslations("common");
  return (
    <div className="flex justify-end gap-2 mt-5">
      <button type="button" onClick={onCancel} disabled={busy} className={buttonClasses("ghost")}>
        {t("cancel")}
      </button>
      <button type="submit" disabled={busy} className={buttonClasses(destructive ? "destructive" : "primary")}>
        {submitLabel}
      </button>
    </div>
  );
}

/** One dialog for every row action; `kind` picks the form. */
export function DocumentDialog({ kind, item, applications, busy, onClose, onRename, onChangeType, onReplace, onLink, onDelete }: DocumentDialogProps) {
  const t = useTranslations("documents.dialogs");
  const typeLabel = useDocumentTypeLabel();
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
      if (!file) return setFileError(t("chooseFileError"));
      onReplace(file);
    }
    if (kind === "link") onLink(links);
    if (kind === "delete") onDelete();
  };

  return (
    <Modal open onClose={busy ? () => {} : onClose} title={t(kind)} className="max-w-md">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {kind === "rename" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-caption text-neutral-600">{t("name")}</span>
            <input autoFocus value={name} onChange={(event) => setName(event.target.value)} className={FIELD_CLASS} />
          </label>
        )}

        {kind === "type" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-caption text-neutral-600">{t("documentType")}</span>
            <select autoFocus value={type} onChange={(event) => setType(event.target.value as DocumentTypeKey)} className={FIELD_CLASS}>
              {DOCUMENT_TYPES.map((option) => (
                <option key={option.key} value={option.key}>
                  {typeLabel(option.key)}
                </option>
              ))}
            </select>
          </label>
        )}

        {kind === "replace" && (
          <div className="flex flex-col gap-2">
            <p className="text-body text-neutral-800">
              {t("replaceBody", { name: item.name })}
              {isReviewable(item.type) && t("replaceReviewNote")}
            </p>
            <input
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              aria-label={t("chooseFile")}
              onChange={(event) => {
                const picked = event.target.files?.[0] ?? null;
                if (picked && picked.size > MAX_FILE_SIZE) {
                  setFile(null);
                  setFileError(t("tooLarge", { mb: MAX_FILE_SIZE / (1024 * 1024) }));
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
            <p className="text-neutral-600 text-small">{t("noApplications")}</p>
          ) : (
            <fieldset className="flex flex-col gap-1">
              <legend className="sr-only">{t("applications")}</legend>
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
              ? t("deleteUsed", { count: item.usedIn.length })
              : t("deleteBody", { name: item.name })}
          </p>
        )}

        <Actions
          busy={busy}
          onCancel={onClose}
          destructive={kind === "delete"}
          submitLabel={
            kind === "delete" ? t("deleteSubmit") : kind === "replace" ? (busy ? t("replacing") : t("replace")) : t("save")
          }
        />
      </form>
    </Modal>
  );
}
