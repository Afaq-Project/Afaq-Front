import Image from "next/image";

import { OpportunityDetail } from "../../types/opportunity";

export function GallerySection({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  if (opportunity.gallery.length === 0) return null;

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
      {opportunity.gallery.map((src, index) => (
        <div
          key={src}
          className="relative bg-white shadow-card rounded-lg h-48 overflow-hidden"
        >
          <Image
            src={src}
            alt={`${opportunity.title} photo ${index + 1}`}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
