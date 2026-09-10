import { Download, FileText, Plus } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import type { Tone } from "@/src/shared/ui/Badge";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { ApplicationDocument } from "../types/detail";

const TONE_ICON_CLASSES: Record<Tone, string> = {
  gray: "bg-neutral-100 text-neutral-700",
  blue: "bg-info-50 text-info-800",
  green: "bg-primary-50 text-primary-800",
  amber: "bg-warning-50 text-warning-800",
  teal: "bg-success-50 text-success-800",
  red: "bg-danger-50 text-danger-800",
};

function DocumentCard({ document }: { document: ApplicationDocument }) {
  return (
    <div className="flex items-center gap-3 hover:bg-neutral-50 p-3 border border-neutral-100 rounded-md transition-colors">
      <span
        className={cn(
          "flex justify-center items-center rounded-md w-10 h-10 shrink-0",
          TONE_ICON_CLASSES[document.tone],
        )}
      >
        <FileText size={18} strokeWidth={1.75} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 text-small truncate">
          {document.name}
        </p>
        <p className="text-neutral-500 text-caption">
          {document.fileType} • {document.size}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Download ${document.name}`}
        className="flex justify-center items-center hover:bg-neutral-100 rounded-md w-8 h-8 text-neutral-500 hover:text-neutral-900 transition-colors shrink-0"
      >
        <Download size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}

function AddDocumentCard() {
  return (
    <button
      type="button"
      className="flex items-center gap-3 hover:bg-neutral-50 p-3 border border-neutral-200 border-dashed rounded-md w-full text-left transition-colors"
    >
      <span className="flex justify-center items-center bg-neutral-100 rounded-md w-10 h-10 text-neutral-500 shrink-0">
        <Plus size={18} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="font-medium text-neutral-900 text-small">
          Add New Document
        </p>
        <p className="text-neutral-500 text-caption">
          Recommendations, extra certificates...
        </p>
      </div>
    </button>
  );
}

export function LinkedDocumentsCard({
  documents,
}: {
  documents: ApplicationDocument[];
}) {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <h2 className="text-h2">Linked Documents</h2>
        <button
          type="button"
          className="font-medium text-primary-600 hover:text-primary-800 text-small transition-colors"
        >
          Add Document
        </button>
      </div>

      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 mt-4">
        {documents.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
        <AddDocumentCard />
      </div>
    </Card>
  );
}
