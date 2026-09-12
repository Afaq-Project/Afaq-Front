import { notFound } from "next/navigation";

import { OpportunityDetailsView } from "@/src/feature/opportunities/components/details/OpportunityDetailsView";
import { getOpportunityById } from "@/src/feature/opportunities/services/utils";

export default async function OpportunityDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  return <OpportunityDetailsView opportunity={opportunity} />;
}
