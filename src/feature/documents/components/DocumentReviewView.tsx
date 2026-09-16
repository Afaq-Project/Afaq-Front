import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { DocumentPreview } from "@/feature/documents/components/DocumentPreview";
import { ReviewSidebar } from "@/feature/documents/components/ReviewSidebar";
import { DocumentItem } from "@/feature/documents/types/document.types";
import { DOCUMENT_TYPE_CONFIG } from "@/feature/documents/utils/documentTypeConfig";
import { mockReviewResult, mockReviewUsage } from "@/feature/documents/data/mockDocuments";

interface DocumentReviewViewProps {
  document: DocumentItem;
}

export function DocumentReviewView({ document }: DocumentReviewViewProps) {
  const { label } = DOCUMENT_TYPE_CONFIG[document.type];

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-6 py-6">
      <Link
        href="/documents"
        className="flex w-fit items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
      >
        <ChevronLeft size={16} />
        Back to Documents
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-stone-900">
          {document.fileName}
        </h1>
        <Badge>{label}</Badge>
      </div>

      <div className="mt-6 grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-h-[520px]">
          <DocumentPreview />
        </div>
        <ReviewSidebar usage={mockReviewUsage} result={mockReviewResult} />
      </div>
    </div>
  );
}
