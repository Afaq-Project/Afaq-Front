import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, ZoomIn, ZoomOut } from "lucide-react";

import ReviewSidebar from "@/feature/decoments/component/review/ReviewSidebar";
import { documents } from "@/feature/decoments/component/documents.data";

export default async function DocumentReviewPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;

  // البحث عن المستند بالـ ID
  const foundDoc = documents.find((d) => String(d.id) === String(docId));

  // البيانات المجهزة بنفس الكلام والتفاصيل الموجودة في التصميم الأول
  const doc = foundDoc || {
    id: docId,
    fileName: "Personal_Statement_Final.docx",
    category: "Resume",
    review: {
      score: 85,
      content: `Jane Doe - Personal Statement

To Whom It May Concern,

I am writing to express my profound interest in the Environmental Science program at your esteemed institution. Growing up surrounded by the verdant forests of the Pacific Northwest, my fascination with complex ecological systems began at an early age. This early exposure fostered a deep-seated commitment to sustainable practices and conservation efforts.

During my undergraduate studies, I led a research initiative focusing on the impact of microplastics in local freshwater streams. This experience not only honed my analytical skills but also underscored the urgent need for innovative solutions to environmental degradation. My team successfully presented our findings at the Regional Ecology Conference, an achievement that reinforced my desire to pursue advanced research in this critical field.

I believe that your program's emphasis on interdisciplinary approaches perfectly aligns with my academic background and professional aspirations. The opportunity to work alongside leading experts in sustainability would be invaluable as I strive to contribute meaningfully to the preservation of our natural ecosystems.

Thank you for considering my application. I look forward to the possibility of contributing to your vibrant academic community.

Sincerely,
Jane Doe`,
      strengths: [
        "Strong opening narrative that establishes a personal connection to the field.",
        "Clear articulation of past research experience (microplastics study).",
        "Professional and respectful tone maintained throughout."
      ],
      suggestions: [
        "Consider detailing a specific challenge faced during the research project and how it was overcome.",
        "Quantify the impact of the Regional Ecology Conference presentation (e.g., audience size, feedback received).",
        "Explicitly mention a faculty member or specific resource at the target institution that aligns with your goals."
      ],
      concerns: [
        "The conclusion feels slightly generic and could be tailored more closely to the specific program.",
        "A few sentences are overly lengthy; breaking them up could improve readability and flow."
      ]
    }
  };

  if (!doc.review) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Link>

        <div className="flex items-center gap-3 mt-3 mb-6">
          <h1 className="text-2xl font-bold text-stone-900">
            {doc.fileName}
          </h1>

          <span className="flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
            <FileText className="h-3.5 w-3.5" />
            {doc.category}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3">
              <span className="text-sm font-medium text-stone-700">
                Document Preview
              </span>

              <div className="flex items-center gap-3 text-stone-500">
                <button
                  type="button"
                  aria-label="Zoom in"
                  className="hover:text-stone-900 transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  aria-label="Zoom out"
                  className="hover:text-stone-900 transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mx-auto max-w-2xl rounded-md border border-stone-200 bg-white p-6 shadow-sm">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-stone-800">
                  {doc.review.content}
                </pre>
              </div>
            </div>
          </div>

          <ReviewSidebar review={doc.review as any} />
        </div>

        <p className="text-center text-xs text-stone-400 mt-8">
          AI guidance is intended to assist your writing and does not guarantee
          application outcomes.
        </p>
      </main>
    </div>
  );
}