import { notFound } from "next/navigation";

import { getDocumentDetail } from "@/src/feature/documents/services/review";
import { DocumentReviewView } from "@/src/feature/documents/components/DocumentReviewView";

export default async function DocumentReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = getDocumentDetail(id);

  if (!document) {
    notFound();
  }

  return <DocumentReviewView document={document} />;
}
