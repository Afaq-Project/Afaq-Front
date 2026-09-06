



import Link from "next/link";
import { Sparkles, FileText, Mail } from "lucide-react";
import type { DocumentItem } from "./types";

interface DocumentCardProps {
  doc: DocumentItem;
}

export default function DocumentCard({ doc }: DocumentCardProps) {
  const categoryIcon: Record<string, React.ElementType> = {
    Resume: FileText,
    Essay: FileText,
    "Recommendation Letter": Mail,
  };

  const IconComponent = categoryIcon[doc.category] || FileText;
  const hasReview = !!doc.review;

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${hasReview
          ? "border-green-500 bg-green-50 dark:bg-green-950"
          : "border-gray-300 bg-white dark:bg-gray-800"
        }`}
    >
      {/* Header مع الأيقونة والفئة */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />

          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {doc.category}
          </span>
        </div>

        {hasReview && (
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
            تم التقييم ✓
          </span>
        )}
      </div>

      {/* اسم الملف */}
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {doc.fileName}
      </h3>

      {/* الفئة */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {doc.category}
      </p>

      {/* التاريخ */}
      <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
        {new Date(doc.uploadedOn).toLocaleDateString("ar-SA")}
      </div>
      {/* الزر */}
      <Link
        href={`/documents/review/${doc.id}`}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        تقييم مع الذكاء الاصطناعي
      </Link>
    </div>
  );
}


