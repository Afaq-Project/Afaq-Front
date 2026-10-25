"use client";

import { notFound } from "next/navigation";
import { isAxiosError } from "axios";
import { ErrorState } from "@/src/shared/ui/ErrorState";
import { useOpportunity } from "../../hooks/useOpportunities";
import { DetailsSkeleton } from "./DetailsSkeleton";
import { OpportunityDetailsView } from "./OpportunityDetailsView";
import { useTranslations } from "next-intl";

// A malformed id comes back 400, a missing one 404: both are "no such opportunity".
const isMissing = (error: unknown) => isAxiosError(error) && [400, 404].includes(error.response?.status ?? 0);

/** Loads an opportunity for its details page; ids that don't exist get the 404 page. */
export function OpportunityDetailsScreen({ id }: { id: string }) {
  const t = useTranslations("opportunity.details");
  const { opportunity, isPending, isError, error, refetch } = useOpportunity(id);

  if (isPending) return <DetailsSkeleton />;
  if (isError) {
    if (isMissing(error)) notFound();
    return <ErrorState title={t("loadError")} titleAs="h1" onRetry={() => refetch()} />;
  }
  // Loaded, but a listing v1 doesn't show (another type, or in Arabic).
  if (!opportunity) notFound();

  return <OpportunityDetailsView opportunity={opportunity} />;
}
