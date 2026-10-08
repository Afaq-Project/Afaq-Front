"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Download, FileText } from "lucide-react";
import { CARD_CLASS } from "@/src/feature/dashboard/components/styles";
import { cn } from "@/src/feature/dashboard/services/utils";
import { formatFileSize } from "@/src/feature/onboarding/services/documentSlots";
import type { RequiredDocument } from "@/src/feature/opportunities/types/opportunity";
import { useUserDocuments } from "@/src/feature/profile/hooks/useUserDocuments";
import { buttonClasses } from "@/src/shared/ui/Button";
import Modal from "@/src/shared/ui/Modal";
import type { ApplicationDocument } from "../../types/detail";

const SMALL_BUTTON = "h-9 md:h-9 px-3 text-small";

const CATEGORY_LABEL: Record<NonNullable<ApplicationDocument["category"]>, string> = {
  resume: "Resume",
  essay: "Essay",
  transcript: "Transcript",
  recommendation: "Recommendation",
  other: "Other",
};

function fileTypeOf(name?: string, mimeType?: string) {
  const extension = name?.split(".").pop();
  if (extension && extension !== name) return extension.toUpperCase();
  if (mimeType?.includes("pdf")) return "PDF";
  return "File";
}

function FileRow({ document }: { document: ApplicationDocument }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex-1 min-w-0">
        <p className="text-neutral-800 text-small truncate">{document.name}</p>
        <p className="text-caption text-neutral-600">
          {document.fileType} · {document.size}
        </p>
      </div>
      {/* TODO: downloads need a document URL from the API. */}
      <button
        type="button"
        disabled
        aria-label={`Download ${document.name} (not available yet)`}
        title="Downloads aren't available yet"
        className="flex justify-center items-center rounded-sm size-11 md:size-8 text-neutral-400 cursor-not-allowed shrink-0"
      >
        <Download size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Picker of the user's existing documents (reuse first, FR-5.5) with "Upload new" as a
 * secondary option. Linking is local for now.
 */
function LinkDocumentDialog({
  open,
  requirement,
  linkedIds,
  onLink,
  onClose,
}: {
  open: boolean;
  requirement: RequiredDocument | null;
  linkedIds: Set<string>;
  onLink: (document: ApplicationDocument) => void;
  onClose: () => void;
}) {
  const userDocs = useUserDocuments();
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
  }, [open, userDocs.available]);

  return (
    <Modal open={open} onClose={onClose} title={requirement ? `Link: ${requirement.name}` : "Link a document"} className="max-w-md">
      {userDocs.isLoading ? (
        <p className="text-neutral-600 text-small">Loading your documents…</p>
      ) : !userDocs.available ? (
        // TODO: retry once the documents request can be retried from here.
        <p className="text-neutral-600 text-small">We couldn&apos;t load your documents right now.</p>
      ) : userDocs.documents.length === 0 ? (
        <p className="text-neutral-600 text-small">You haven&apos;t uploaded any documents yet.</p>
      ) : (
        <ul ref={listRef} className="flex flex-col gap-1">
          {userDocs.documents.map(({ document, category }) => {
            const linked = linkedIds.has(document.id);
            const name = document.displayName ?? "Untitled document";
            return (
              <li key={document.id}>
                <button
                  type="button"
                  disabled={linked}
                  onClick={() =>
                    onLink({
                      id: document.id,
                      name,
                      fileType: fileTypeOf(document.displayName, document.mimeType),
                      size: formatFileSize(document.sizeBytes) || "—",
                      category,
                    })
                  }
                  className="flex items-center gap-3 hover:bg-neutral-50 disabled:hover:bg-transparent px-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 w-full min-h-12 text-left disabled:cursor-default"
                >
                  <span aria-hidden="true" className="flex justify-center items-center bg-neutral-50 rounded-md size-9 text-neutral-600 shrink-0">
                    <FileText size={16} strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-neutral-900 text-small truncate">{name}</span>
                    <span className="block text-caption text-neutral-600">{category ? CATEGORY_LABEL[category] : "No type"}</span>
                  </span>
                  {linked && <span className="text-caption text-neutral-600">Linked</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex justify-end mt-5 pt-4 border-neutral-100 border-t">
        {/* TODO: upload straight from here once uploads aren't tied to onboarding. */}
        <Link href="/documents" className={buttonClasses("secondary")}>
          Upload new
        </Link>
      </div>
    </Modal>
  );
}

/**
 * The opportunity's required documents as a checklist (a document counts as linked only when
 * its explicit type matches), then any other linked documents. Without known requirements,
 * just the linked list.
 */
export function ApplicationDocumentsCard({
  required,
  linked,
  onLink,
}: {
  required?: RequiredDocument[];
  linked: ApplicationDocument[];
  onLink: (document: ApplicationDocument) => void;
}) {
  const [picker, setPicker] = useState<{ requirement: RequiredDocument | null } | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const openPicker = (requirement: RequiredDocument | null) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setPicker({ requirement });
  };
  const closePicker = () => {
    setPicker(null);
    returnFocus.current?.focus();
  };

  const requirements = required ?? [];
  const matchFor = (requirement: RequiredDocument) =>
    requirement.category ? linked.find((doc) => doc.category === requirement.category) : undefined;
  const matchedIds = new Set(requirements.map((r) => matchFor(r)?.id).filter((id): id is string => Boolean(id)));
  const others = linked.filter((doc) => !matchedIds.has(doc.id));
  const linkedCount = requirements.filter((r) => matchFor(r)).length;

  return (
    <section aria-labelledby="documents-heading" className={CARD_CLASS}>
      <div className="flex justify-between items-center gap-3">
        <h2 id="documents-heading" className="text-h2 text-neutral-900">
          Documents
        </h2>
        <button type="button" onClick={() => openPicker(null)} className={buttonClasses("secondary", SMALL_BUTTON)}>
          Link document
        </button>
      </div>

      {requirements.length > 0 && (
        <>
          <p className="mt-1 text-body text-neutral-600">
            {linkedCount} of {requirements.length} required documents linked
          </p>
          <ul className="flex flex-col gap-4 mt-4">
            {requirements.map((requirement) => {
              const match = matchFor(requirement);
              return (
                <li key={requirement.name} className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex justify-center items-center mt-0.5 size-5 shrink-0">
                    {match ? (
                      <span className="flex justify-center items-center bg-primary-600 rounded-full size-5 text-white">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="border-[1.5px] border-neutral-400 rounded-full size-4" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-body text-neutral-900">{requirement.name}</p>
                    {match ? <FileRow document={match} /> : <p className="text-neutral-600 text-small">Not linked yet</p>}
                  </div>
                  {!match && (
                    <button
                      type="button"
                      onClick={() => openPicker(requirement)}
                      aria-label={`Link ${requirement.name.toLowerCase()}`}
                      className={buttonClasses("soft", cn(SMALL_BUTTON, "shrink-0"))}
                    >
                      Link
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {(requirements.length === 0 || others.length > 0) && (
        <div className={cn(requirements.length > 0 && "mt-6 pt-4 border-neutral-100 border-t")}>
          {requirements.length > 0 && <p className="mb-2 font-medium text-caption text-neutral-600">Other documents</p>}
          {others.length === 0 ? (
            <p className="mt-3 text-neutral-600 text-small">No documents linked yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {others.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex justify-center items-center bg-neutral-50 rounded-md size-9 text-neutral-600 shrink-0">
                    <FileText size={16} strokeWidth={1.75} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <FileRow document={doc} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <LinkDocumentDialog
        open={picker !== null}
        requirement={picker?.requirement ?? null}
        linkedIds={new Set(linked.map((doc) => doc.id))}
        onLink={(doc) => {
          onLink(doc);
          closePicker();
        }}
        onClose={closePicker}
      />
    </section>
  );
}
