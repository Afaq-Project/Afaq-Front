import type { ReactNode } from "react";

interface ProfilePageSectionProps {
  /** Anchor target for the section nav. */
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/** One anchored section of the profile page: H2 title and its cards. */
export function ProfilePageSection({ id, title, description, children }: ProfilePageSectionProps) {
  const headingId = `${id}-heading`;
  return (
    // scroll-mt keeps the heading clear of the pinned mobile chip row when jumping here.
    <section id={id} aria-labelledby={headingId} className="scroll-mt-20 md:scroll-mt-4">
      <div className="mb-3">
        <h2 id={headingId} className="text-h2 text-neutral-900">
          {title}
        </h2>
        {description && <p className="mt-1 text-small text-neutral-600">{description}</p>}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
