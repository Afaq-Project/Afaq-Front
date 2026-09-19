import { Upload } from "lucide-react";

import PageHeader from "@/src/shared/ui/PageHeader";
import { DocumentStatCards } from "@/src/feature/documents/components/DocumentStatCards";
import { DocumentsExplorer } from "@/src/feature/documents/components/DocumentsExplorer";

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Document Library"
        description="Manage your uploaded files and documents."
        action={
          <button
            type="button"
            className="inline-flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-800 px-4 rounded-sm w-fit h-10 font-medium text-white text-sm transition-colors"
          >
            <Upload size={16} strokeWidth={2} />
            Upload New Document
          </button>
        }
      />

      <DocumentStatCards />
      <DocumentsExplorer />
    </div>
  );
}
