import type { ApplicationStatus } from "@/src/feature/applications/types/status";
import type { OpportunityDetail } from "@/src/feature/opportunities/types/opportunity";
import type { DocumentTypeKey } from "@/src/shared/lib/document-types";
import type { ReviewInfo } from "./review";

/** One of the mock documents (doc-1 ... doc-8), opened by id when it isn't one of the user's API documents. */
export interface AppDocument {
  id: string;
  name: string;
  sizeBytes: number;
  uploadedOn: string;
}

export interface TrackedApplication {
  id: string;
  title: string;
  status: ApplicationStatus;
  daysLeft: number;
  opportunity?: OpportunityDetail;
}

/** A document as the list and the review page show it: the API document plus local edits. */
export interface DocumentItem {
  id: string;
  /** The API document type id, needed to re-upload under the same type. */
  apiTypeId?: string;
  name: string;
  type?: DocumentTypeKey;
  format: string;
  size: string;
  /** ISO date-time. */
  addedAt?: string;
  usedIn: TrackedApplication[];
  /** Reviewable types only (essay, CV, recommendation letter). */
  review?: ReviewInfo;
  /** From the mock document list rather than the API: no file to download, replace or delete. */
  mock?: boolean;
}
