import { notFound } from "next/navigation";
import { DocumentReviewView } from "@/feature/documents/components/DocumentReviewView";
import { mockDocuments } from "@/feature/documents/data/mockDocuments";

interface DocumentReviewPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function DocumentReviewPage({ params }: DocumentReviewPageProps) {
  const resolvedParams = await params;
  const document =
    mockDocuments.find((doc) => doc.id === resolvedParams.id) || mockDocuments[0];

  if (!document) {
    notFound();
  }

  return <DocumentReviewView document={document} />;
}