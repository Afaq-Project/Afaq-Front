import { Upload } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { DocumentCard } from "@/feature/documents/components/DocumentCard";
import { mockDocuments } from "@/feature/documents/data/mockDocuments";

export function DocumentsDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            My Documents
          </h1>
          <p className="mt-1 text-stone-500">
            Manage and organize your application materials.
          </p>
        </div>

        <Button>
          <Upload size={16} />
          Upload new document
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
}
