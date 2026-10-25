import { APPLICATION_DETAILS } from "@/src/feature/applications/mocks/applicationDetails";
import { getMockOpportunityById } from "@/src/feature/opportunities/services/utils";
import { formatFileSize } from "@/src/feature/onboarding/services/documentSlots";
import type { ApiDocument } from "@/src/feature/profile/types/api";
import { documentType, isReviewable, typeForName, type DocumentTypeKey } from "@/src/shared/lib/document-types";
import { DOCUMENTS } from "../mocks/documents";
import type { DocumentItem, TrackedApplication } from "../types/document";
import type { LocalEdits } from "./documentEditsStore";
import { reviewInfoFor, type ReviewState } from "./reviewStore";

/** The user's tracked applications, with their opportunity (for flags and requirements). */
export const TRACKED_APPLICATIONS: TrackedApplication[] = APPLICATION_DETAILS.map((application) => ({
  id: application.id,
  title: application.title,
  status: application.status,
  daysLeft: application.daysLeft,
  opportunity: application.opportunityId ? getMockOpportunityById(application.opportunityId) : undefined,
}));

/** Not started or in progress: the ones still collecting documents. */
export const ACTIVE_APPLICATIONS = TRACKED_APPLICATIONS.filter(
  (application) => application.status === "not_started" || application.status === "in_progress",
);

function formatOf(name?: string, mimeType?: string) {
  const extension = name?.split(".").pop();
  if (extension && extension !== name && extension.length <= 4) return extension.toUpperCase();
  if (mimeType?.includes("pdf")) return "PDF";
  if (mimeType?.startsWith("image/")) return "IMAGE";
  return "FILE";
}

const linkedApplications = (ids: string[] = []) =>
  ids
    .map((id) => TRACKED_APPLICATIONS.find((application) => application.id === id))
    .filter((application): application is TrackedApplication => Boolean(application));

export function buildItems(
  documents: { document: ApiDocument; type?: DocumentTypeKey }[],
  edits: LocalEdits,
  reviews: ReviewState,
): DocumentItem[] {
  return documents.map(({ document, type }) => {
    const itemType = edits.types[document.id] ?? type;
    const name = edits.names[document.id] ?? document.displayName ?? "Untitled document";
    return {
      id: document.id,
      apiTypeId: document.documentTypeId,
      name,
      type: itemType,
      format: formatOf(document.displayName, document.mimeType),
      size: formatFileSize(document.sizeBytes) || "—",
      addedAt: document.createdAt,
      usedIn: linkedApplications(edits.links[document.id]),
      review: isReviewable(itemType) ? reviewInfoFor(reviews, document.id) : undefined,
    };
  });
}

/** One of the mock documents (doc-1 ... doc-8), for ids that aren't the user's API documents. */
export function mockItem(id: string, edits: LocalEdits, reviews: ReviewState): DocumentItem | undefined {
  const document = DOCUMENTS.find((doc) => doc.id === id);
  if (!document) return undefined;
  const type = edits.types[id] ?? typeForName(document.name);
  const added = new Date(document.uploadedOn);
  return {
    id,
    name: edits.names[id] ?? document.name,
    type,
    format: formatOf(document.name),
    size: formatFileSize(document.sizeBytes) || "—",
    addedAt: Number.isNaN(added.getTime()) ? undefined : added.toISOString(),
    usedIn: linkedApplications(edits.links[id]),
    review: isReviewable(type) ? reviewInfoFor(reviews, id) : undefined,
    mock: true,
  };
}

/** The type label shown for a document; untyped ones read as "Other". */
export const typeLabel = (type?: DocumentTypeKey) => documentType(type ?? "other").label;

/** "Oct 12, 2026". */
export function formatDate(iso?: string) {
  if (!iso) return undefined;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
