import { Suspense } from "react";
import { DocumentReviewView } from "@/src/feature/documents/components/review/DocumentReviewView";

export default async function EssayReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // useSearchParams (for the back link) needs a Suspense boundary.
  return (
    <Suspense>
      <DocumentReviewView id={decodeURIComponent(id)} />
    </Suspense>
  );
}
