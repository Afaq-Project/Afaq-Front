import { Search, ZoomIn } from "lucide-react";
import { mockEssayBody } from "@/feature/documents/data/mockDocuments";

export function DocumentPreview() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3">
        <span className="text-sm font-medium text-stone-500">
          Document Preview
        </span>
        <div className="flex items-center gap-3 text-stone-400">
          <button aria-label="Search document" className="hover:text-stone-600">
            <Search size={16} />
          </button>
          <button aria-label="Zoom document" className="hover:text-stone-600">
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-stone-50 p-6">
        <div className="mx-auto max-w-xl rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">
            {mockEssayBody.applicantName} - Personal Statement
          </h2>
          <p className="mt-5 text-sm text-stone-700">To Whom It May Concern,</p>

          {mockEssayBody.paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-4 text-sm leading-relaxed text-stone-700">
              {paragraph}
            </p>
          ))}

          <p className="mt-6 text-sm text-stone-700">Sincerely,</p>
          <p className="text-sm text-stone-700">{mockEssayBody.applicantName}</p>
        </div>
      </div>
    </div>
  );
}
