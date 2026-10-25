"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDocumentTypeLabel } from "@/src/shared/lib/useDocumentTypeLabel";
import { cn } from "@/src/feature/dashboard/services/utils";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  SIMULATED_PROGRESS_INTERVAL_MS,
  formatFileSize,
  nextSimulatedProgress,
} from "@/src/feature/onboarding/services/documentSlots";
import { profileService } from "@/src/feature/profile/services/profileService";
import { DOCUMENT_TYPES, type DocumentTypeKey } from "@/src/shared/lib/document-types";
import { buttonClasses } from "@/src/shared/ui/Button";
import Modal from "@/src/shared/ui/Modal";
import type { TrackedApplication } from "../../types/document";

const MAX_MB = MAX_FILE_SIZE / (1024 * 1024);
const ACCEPTED = ACCEPTED_FILE_TYPES.split(",");

const FIELD_CLASS =
  "bg-white px-3 border border-neutral-200 focus:border-primary-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full h-10 text-body text-neutral-900";

/** Checks a picked file against the existing upload rules; returns the problem, if any. */
function validate(file: File): "badType" | "tooLarge" | null {
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  if (!ACCEPTED.includes(extension)) return "badType";
  if (file.size > MAX_FILE_SIZE) return "tooLarge";
  return null;
}

export interface UploadPreset {
  type?: DocumentTypeKey;
  applicationIds?: string[];
  /** Opened from a missing-document row in "Needed for your applications". */
  fromNeeded?: boolean;
}

interface UploadDialogProps {
  open: boolean;
  preset: UploadPreset;
  applications: TrackedApplication[];
  /** Maps one of our types to the API's document type id; undefined when the API has no such type. */
  apiTypeIdFor: (type: DocumentTypeKey) => string | undefined;
  onClose: () => void;
  onUploaded: (result: {
    id: string;
    type: DocumentTypeKey;
    fileName: string;
    displayName: string;
    applicationIds: string[];
  }) => void;
}

/**
 * Upload a document with the existing upload call: a drop zone, a required type, an optional
 * display name and applications to link it to, a progress bar, and inline errors.
 */
export function UploadDialog({ open, preset, applications, apiTypeIdFor, onClose, onUploaded }: UploadDialogProps) {
  const t = useTranslations("documents.uploadDialog");
  const tDialogs = useTranslations("documents.dialogs");
  const tDocs = useTranslations("documents");
  const tCommon = useTranslations("common");
  const typeLabel = useDocumentTypeLabel();
  const formats = t("formats");
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<DocumentTypeKey | "">(preset.type ?? "");
  const [displayName, setDisplayName] = useState("");
  const [linked, setLinked] = useState<string[]>(preset.applicationIds ?? []);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Start fresh (with the preset) each time it opens.
  const [openedFor, setOpenedFor] = useState(false);
  if (open !== openedFor) {
    setOpenedFor(open);
    if (open) {
      setFile(null);
      setType(preset.type ?? "");
      setDisplayName("");
      setLinked(preset.applicationIds ?? []);
      setError(null);
      setProgress(null);
    }
  }

  const pick = (picked: File | undefined) => {
    if (!picked) return;
    const problem = validate(picked);
    setError(problem === "badType" ? t("badType", { formats }) : problem === "tooLarge" ? tDialogs("tooLarge", { mb: MAX_MB }) : null);
    setFile(problem ? null : picked);
    if (!problem && !displayName) setDisplayName(picked.name);
  };

  const submit = async () => {
    if (!file) return setError(tDialogs("chooseFileError"));
    if (!type) return setError(t("chooseTypeError"));
    const apiTypeId = apiTypeIdFor(type);
    if (!apiTypeId) return setError(t("typeUnavailable"));

    setError(null);
    setProgress(0);
    const tick = setInterval(() => setProgress((value) => nextSimulatedProgress(value ?? 0)), SIMULATED_PROGRESS_INTERVAL_MS);
    try {
      const doc = await profileService.uploadDocument(apiTypeId, file);
      setProgress(100);
      onUploaded({ id: doc.id, type, fileName: file.name, displayName: displayName.trim() || file.name, applicationIds: linked });
    } catch {
      setError(t("failed"));
      setProgress(null);
    } finally {
      clearInterval(tick);
    }
  };

  const uploading = progress !== null && progress < 100;

  return (
    <Modal open={open} onClose={uploading ? () => {} : onClose} title={tDocs("upload")} className="max-w-lg">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            pick(event.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex flex-col items-center gap-2 px-4 py-6 border-2 border-dashed rounded-lg text-center transition-colors",
            dragging ? "border-primary-400 bg-primary-50" : "border-neutral-200",
          )}
        >
          <Upload size={22} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600" />
          <p className="text-body text-neutral-800">
            {t.rich("dragOr", {
              browse: (chunks) => (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-sm font-medium text-primary-600 hover:text-primary-800 hover:underline focus-visible:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  {chunks}
                </button>
              ),
            })}
          </p>
          <p className="text-caption text-neutral-600">
            {t("limits", { formats, mb: MAX_MB })}
          </p>
          {file && (
            <p className="font-medium text-neutral-900 text-small">
              {file.name} · {formatFileSize(file.size)}
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={(event) => pick(event.target.files?.[0])}
            className="sr-only"
            aria-label={tDialogs("chooseFile")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="upload-type" className="text-caption text-neutral-600">
            {tDialogs("documentType")}
          </label>
          <select
            id="upload-type"
            required
            value={type}
            onChange={(event) => setType(event.target.value as DocumentTypeKey)}
            className={FIELD_CLASS}
          >
            <option value="" disabled>
              {t("chooseType")}
            </option>
            {DOCUMENT_TYPES.map((option) => (
              <option key={option.key} value={option.key}>
                {typeLabel(option.key)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="upload-name" className="text-caption text-neutral-600">
            {t("displayName")}
          </label>
          <input id="upload-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} className={FIELD_CLASS} />
        </div>

        {applications.length > 0 && (
          <fieldset className="flex flex-col gap-1">
            <legend className="mb-1 text-caption text-neutral-600">{t("linkTo")}</legend>
            {applications.map((application) => (
              <label key={application.id} className="flex items-center gap-2.5 min-h-11 md:min-h-9 text-neutral-800 text-small cursor-pointer">
                <input
                  type="checkbox"
                  checked={linked.includes(application.id)}
                  onChange={() =>
                    setLinked((prev) =>
                      prev.includes(application.id) ? prev.filter((id) => id !== application.id) : [...prev, application.id],
                    )
                  }
                  className="accent-primary-600 size-4"
                />
                {application.title}
              </label>
            ))}
          </fieldset>
        )}

        {progress !== null && (
          <div aria-hidden="true" className="bg-neutral-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary-600 rounded-full h-full transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        )}
        {error && (
          <p role="alert" className="text-danger-800 text-small">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} disabled={uploading} className={buttonClasses("ghost")}>
            {tCommon("cancel")}
          </button>
          <button type="submit" disabled={uploading} className={buttonClasses("primary")}>
            {uploading ? t("uploading", { percent: Math.round(progress ?? 0) }) : tDocs("upload")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
