import { notFound } from "next/navigation";

import { getApplicationDetail } from "@/src/feature/applications/services/utils";
import { ApplicationDetailView } from "@/src/feature/applications/components/ApplicationDetailView";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = getApplicationDetail(id);

  if (!application) {
    notFound();
  }

  return <ApplicationDetailView application={application} />;
}
