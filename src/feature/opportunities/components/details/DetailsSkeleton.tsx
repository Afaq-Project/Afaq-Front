import { CARD_CLASS } from "@/src/feature/dashboard/components/styles";
import { cn } from "@/src/feature/dashboard/services/utils";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import { useTranslations } from "next-intl";

/** Card title plus `lines` text lines, the shape of About. */
function TextCardSkeleton({ titleWidth, lines }: { titleWidth: string; lines: number }) {
  return (
    <div className={CARD_CLASS}>
      <Skeleton className={cn("h-6", titleWidth)} />
      <div className="flex flex-col gap-2 mt-4">
        {Array.from({ length: lines }, (_, index) => (
          <Skeleton key={index} className={index === lines - 1 ? "w-2/3 h-4" : "w-full h-4"} />
        ))}
      </div>
    </div>
  );
}

/** Card title, a summary line and icon rows, the shape of Eligibility and Documents. */
function ListCardSkeleton({ titleWidth, rows }: { titleWidth: string; rows: number }) {
  return (
    <div className={CARD_CLASS}>
      <Skeleton className={cn("h-6", titleWidth)} />
      <Skeleton className="mt-2 w-56 h-4" />
      <div className="flex flex-col gap-3 mt-4">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="rounded-full size-5 shrink-0" />
            <Skeleton className="w-3/5 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionsSkeleton() {
  return (
    <div className={cn(CARD_CLASS, "flex flex-col gap-3")}>
      <Skeleton className="rounded-sm w-full h-11 md:h-10" />
      <Skeleton className="rounded-sm w-full h-11 md:h-10" />
      <div className="flex justify-between items-center">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="size-5" />
      </div>
      <Skeleton className="w-48 h-3" />
    </div>
  );
}

function MatchSkeleton() {
  return (
    <div className={CARD_CLASS}>
      <Skeleton className="w-24 h-5" />
      <div className="flex items-center gap-4 mt-4">
        <Skeleton className="rounded-full size-24 shrink-0" />
        <Skeleton className="w-36 h-4" />
      </div>
      <div className="flex flex-col gap-2.5 mt-5 pt-4 border-neutral-100 border-t">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex justify-between items-center gap-3">
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Loading placeholder shaped like OpportunityDetailsView: back link, header with key facts,
 * actions and match (under the header below 1024px, in the side column above), then About,
 * Eligibility, Documents, the AI questions and the source line.
 */
export function DetailsSkeleton() {
  const t = useTranslations("opportunity.details");

  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">{t("loading")}</span>
      <Skeleton className="w-32 h-4" />

      <div className="bg-white border border-neutral-100 rounded-lg overflow-hidden">
        <div className="bg-primary-50 h-35" />
        <div className="px-5 md:px-6 pb-5 md:pb-6">
          <Skeleton className="relative rounded-[8px] ring-4 ring-white w-14 h-10.5 -mt-5.25" />
          <Skeleton className="mt-3 w-2/3 h-7" />
          <Skeleton className="mt-2 w-40 h-4" />
          <div className="flex flex-wrap gap-1.5 mt-4">
            {["w-20", "w-24", "w-28", "w-16"].map((width) => (
              <Skeleton key={width} className={cn("rounded-full h-5", width)} />
            ))}
          </div>
          <div className="gap-4 grid grid-cols-2 md:grid-cols-4 mt-5 pt-5 border-neutral-100 border-t">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <Skeleton className="rounded-md size-8 shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="w-14 h-3" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden flex flex-col gap-6">
        <ActionsSkeleton />
        <MatchSkeleton />
      </div>

      <div className="items-start gap-6 grid grid-cols-1 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2 min-w-0">
          <TextCardSkeleton titleWidth="w-20" lines={4} />
          <ListCardSkeleton titleWidth="w-28" rows={3} />
          <ListCardSkeleton titleWidth="w-44" rows={2} />
          <div className={CARD_CLASS}>
            <Skeleton className="w-64 h-5" />
            <div className="gap-2 grid grid-cols-1 lg:grid-cols-3 mt-4">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="rounded-sm h-11 md:h-10" />
              ))}
            </div>
            <Skeleton className="mt-3 w-56 h-3" />
          </div>
          <Skeleton className="w-72 h-4" />
        </div>

        <div className="hidden lg:flex flex-col gap-6 min-w-0">
          <ActionsSkeleton />
          <MatchSkeleton />
        </div>
      </div>
    </div>
  );
}
