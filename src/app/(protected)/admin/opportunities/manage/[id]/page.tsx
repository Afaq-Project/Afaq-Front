import { notFound } from "next/navigation";

import { MANAGED_OPPORTUNITIES } from "@/src/feature/admin/opportunity-management/mocks/opportunities";
import { getOpportunityById } from "@/src/feature/admin/opportunity-management/services/utils";
import { ManagedOpportunityDetailView } from "@/src/feature/admin/opportunity-management/components/ManagedOpportunityDetailView";

export default async function ManagedOpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = getOpportunityById(MANAGED_OPPORTUNITIES, id);

  if (!opportunity) {
    notFound();
  }

  return <ManagedOpportunityDetailView opportunity={opportunity} />;
}
