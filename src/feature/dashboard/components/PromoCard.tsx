import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { buttonClasses } from "@/src/shared/ui/Button";

interface PromoCardProps {
  icon: LucideIcon;
  title: string;
  /** Small label above the title, e.g. "Free workshop". */
  eyebrow?: string;
  description?: string;
  date?: string;
  time?: string;
  /** The button only renders when there's somewhere to go. */
  cta?: { label: string; href: string };
  /** Small arrow link in the top-right corner. */
  href?: string;
}

/**
 * A single compact promo: a soft green-tinted card with a gradient icon tile, an eyebrow
 * pill, a short title, and optional description, date and "Learn more" button.
 */
export function PromoCard({ icon: Icon, title, eyebrow, description, date, time, cta, href }: PromoCardProps) {
  return (
    <section
      aria-label={eyebrow ?? title}
      className="relative flex items-center gap-3 bg-linear-to-br from-primary-50 via-white to-white p-3 border border-primary-100/60 rounded-lg overflow-hidden"
    >
      {/* Soft glow in the corner; decorative. */}
      <span
        aria-hidden="true"
        className="-top-8 -left-8 absolute bg-primary-100/50 blur-2xl rounded-full size-24 pointer-events-none"
      />

      <span className="relative flex justify-center items-center bg-linear-to-br from-primary-400 to-primary-600 shadow-sm rounded-md size-9 text-white shrink-0">
        <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
      </span>

      <div className="relative flex flex-col flex-1 items-start gap-1 min-w-0">
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 bg-white/80 px-2 py-0.5 border border-primary-100 rounded-full text-[11px] text-primary-800 leading-4">
            <span aria-hidden="true" className="bg-primary-600 rounded-full size-1.5" />
            {eyebrow}
          </span>
        )}
        <h2 className="font-medium text-neutral-900 text-small">{title}</h2>
        {description && <p className="max-w-full text-caption text-neutral-600 truncate">{description}</p>}
        {(date || time) && (
          <p className="text-caption text-neutral-600">{[date, time].filter(Boolean).join(" · ")}</p>
        )}
        {cta && (
          <Link href={cta.href} className={buttonClasses("secondary", "mt-1")}>
            {cta.label}
          </Link>
        )}
      </div>

      {href && (
        <Link
          href={href}
          aria-label={`Learn more about ${title.toLowerCase()}`}
          className="after:absolute relative flex justify-center items-center bg-white hover:bg-primary-50 border border-primary-100 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 size-7 self-start shrink-0 text-primary-800 transition-colors after:-inset-2 after:content-['']"
        >
          <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}
