import Link from "next/link";
import { Link2, Sparkles } from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { Card } from "@/shared/components/Card";
import { DocumentItem } from "@/feature/documents/types/document.types";
import { DOCUMENT_TYPE_CONFIG } from "@/feature/documents/utils/documentTypeConfig";

interface DocumentCardProps {
  document: DocumentItem;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { label, icon: Icon, tone } = DOCUMENT_TYPE_CONFIG[document.type];
  const linkedLabel =
    document.linkedTo.length === 0
      ? "Not linked"
      : `Linked to: ${document.linkedTo.join(", ")}`;

  return (
    <Card
      highlighted={document.aiReviewable}
      className="flex h-full flex-col justify-between gap-6"
    >
      <div className="flex flex-col gap-4">
        <Badge tone={tone}>{label}</Badge>

        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
            <Icon size={20} strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-stone-900">
              {document.fileName}
            </p>
            <p className="mt-0.5 text-sm text-stone-500">
              Uploaded {document.uploadedAt}
            </p>
          </div>
        </div>

        {document.aiReviewable && (
          <Link
            href={`/documents/${document.id}`}
            className="flex items-center justify-center gap-2 rounded-lg bg-stone-50 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
          >
            <Sparkles size={16} className="text-emerald-600" />
            Review with AI
          </Link>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-sm text-stone-500">
        <Link2 size={14} />
        <span className="truncate">{linkedLabel}</span>
      </div>
    </Card>
  );
}
