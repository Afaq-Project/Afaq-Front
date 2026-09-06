// import { AiAssistantCard } from "@/feature/dashboard/components/AiAssistantCard";
// import { DeadlinesCard } from "@/feature/dashboard/components/DeadlinesCard";
// import { OpportunitiesSection } from "@/feature/dashboard/components/OpportunitiesSection";
// import { OverviewPanel } from "@/feature/dashboard/components/OverviewPanel";
// import { ProfileProgressCard } from "@/feature/dashboard/components/ProfileProgressCard";

// export default function DashboardPage() {
//   return (
//     <div className="gap-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_350px]">
//       <div className="flex flex-col gap-4">
//         <div className="gap-4 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_350px]">
//           <OverviewPanel />
//           <AiAssistantCard />
//         </div>

//         <OpportunitiesSection />
//       </div>

//       <div className="flex flex-col gap-4 h-full">
//         <ProfileProgressCard />
//         <DeadlinesCard />
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import { Upload, FileText, Award, FileSpreadsheet, Sparkles } from "lucide-react";
import { documents } from "@/feature/decoments/component/documents.data";

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] p-8">
      <main className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">My Documents</h1>
            <p className="text-stone-600 mt-1">Manage and organize your application materials.</p>
          </div>
          
          <button className="flex items-center gap-2 bg-[#1C3D27] text-white px-4 py-2.5 rounded-lg hover:bg-[#142e1d] transition-colors font-medium text-sm">
            <Upload className="h-4 w-4" />
            Upload new document
          </button>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 capitalize">
                    {doc.category}
                  </span>
                </div>

                <div className="flex items-start gap-3 my-2">
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-600 mt-1">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 leading-snug">{doc.fileName}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Uploaded {doc.uploadedOn}</p>
                  </div>
                </div>

                {doc.linkedTo && (
                  <p className="text-xs text-stone-500 mt-3 pt-3 border-t border-stone-100">
                    🔗 Linked to: <span className="text-stone-700 font-medium">{doc.linkedTo}</span>
                  </p>
                )}
              </div>

              {/* Review button if available */}
              {doc.reviewWithAI && (
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <Link
                    href={`/documents/review/${doc.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#E8EFE9] text-[#1C3D27] hover:bg-[#d6e2d8] rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Review with AI
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}