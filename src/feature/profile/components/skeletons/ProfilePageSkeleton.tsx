import { AnchorNavSkeleton } from "@/src/shared/ui/AnchorNavSkeleton";
import { SectionCardSkeleton } from "@/src/shared/ui/SectionCardSkeleton";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import { ProfileHeaderSkeleton } from "./ProfileHeaderSkeleton";

/** Card counts per section, mirroring the real page: education, background & goals, skills & languages, account. */
const SECTIONS = [1, 2, 2, 2];

/** Full-page placeholder while the profile loads, in the same layout as the real page. */
export function ProfilePageSkeleton() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">Loading your profile…</span>
      <ProfileHeaderSkeleton />
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <AnchorNavSkeleton items={SECTIONS.length} />
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {SECTIONS.map((cards, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-6 w-48" />
              {Array.from({ length: cards }, (_, j) => (
                <SectionCardSkeleton key={j} fields={j === 0 ? 4 : 3} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
