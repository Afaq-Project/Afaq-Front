import { SectionCardSkeleton } from "@/src/shared/ui/SectionCardSkeleton";
import { ProfilePageSection } from "../common/ProfilePageSection";

/**
 * A profile section while the profile loads: its real title and anchor (so the section nav works
 * right away), with placeholder cards in place of the content.
 */
export function ProfileSectionSkeleton({ id, title, cards }: { id: string; title: string; cards: number }) {
  return (
    <ProfilePageSection id={id} title={title}>
      <div role="status" aria-busy="true" className="flex flex-col gap-3">
        <span className="sr-only">Loading {title.toLowerCase()}…</span>
        {Array.from({ length: cards }, (_, index) => (
          <SectionCardSkeleton key={index} fields={index === 0 ? 4 : 3} />
        ))}
      </div>
    </ProfilePageSection>
  );
}
