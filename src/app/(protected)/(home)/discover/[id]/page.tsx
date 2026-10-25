import { OpportunityDetailsScreen } from "@/src/feature/opportunities/components/details/OpportunityDetailsScreen";

export default async function OpportunityDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OpportunityDetailsScreen id={id} />;
}
