import { Calendar, Download, ShieldCheck } from "lucide-react";

import Badge from "@/src/shared/ui/Badge";
import { cn } from "@/src/feature/dashboard/services/utils";
import { CATEGORY_META, formatBytes } from "../services/utils";
import type { AppDocument } from "../types/document";
import { DocumentActionsMenu } from "./DocumentActionsMenu";

const TONE_ICON_CLASSES = {
  gray: "bg-neutral-100 text-neutral-700",
  blue: "bg-info-50 text-info-800",
  green: "bg-primary-50 text-primary-800",
  amber: "bg-warning-50 text-warning-800",
  teal: "bg-success-50 text-success-800",
  red: "bg-danger-50 text-danger-800",
};

export function DocumentListRow({ document }: { document: AppDocument }) {
  const meta = CATEGORY_META[document.category];
  const Icon = meta.icon;

  return (
    <div className="flex items-center gap-4 bg-white hover:shadow-card p-4 border border-neutral-100 rounded-lg transition-shadow">
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <span
          className={cn(
            "flex justify-center items-center rounded-md w-11 h-11 shrink-0",
            TONE_ICON_CLASSES[meta.tone],
          )}
        >
          <Icon size={20} strokeWidth={1.75} />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-neutral-900 text-small truncate">
              {document.name}
            </p>
            {document.verified && (
              <ShieldCheck
                size={14}
                strokeWidth={2}
                className="text-success-600 shrink-0"
                aria-label="Verified"
              />
            )}
          </div>
          <p className="flex items-center gap-1.5 mt-0.5 text-neutral-500 text-caption">
            <Calendar size={12} strokeWidth={1.75} className="shrink-0" />
            {document.uploadedOn}
            <span aria-hidden="true">•</span>
            {formatBytes(document.sizeBytes)}
          </p>
        </div>
      </div>

      {document.linkedTo && (
        <div className="hidden sm:block shrink-0">
          <Badge tone="green">Linked: {document.linkedTo}</Badge>
        </div>
      )}

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          aria-label={`Download ${document.name}`}
          className="flex justify-center items-center hover:bg-neutral-100 rounded-md w-9 h-9 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <Download size={16} strokeWidth={1.75} />
        </button>
        <DocumentActionsMenu
          documentId={document.id}
          documentName={document.name}
        />
      </div>
    </div>
  );
}
