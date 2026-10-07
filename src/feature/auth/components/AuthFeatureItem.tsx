import type { AuthFeature } from "./authFeatures";

interface AuthFeatureItemProps {
  feature: AuthFeature;
  /** Position in the list — drives the entrance stagger and the divider. */
  index: number;
}

// The card fades in first (200ms); rows then rise in 80ms apart.
const CARD_FADE_MS = 200;
const STAGGER_MS = 80;

/** One decorative row of the feature card: icon tile + title + description. Not interactive. */
export default function AuthFeatureItem({ feature, index }: AuthFeatureItemProps) {
  const { icon: Icon, title, description } = feature;

  return (
    <li
      className={`group relative flex items-center gap-3 px-5 py-3.5 motion-safe:animate-auth-row
        ${index > 0 ? "before:absolute before:top-0 before:right-0 before:left-[72px] before:h-px before:bg-neutral-100" : ""}`}
      style={{ animationDelay: `${CARD_FADE_MS + index * STAGGER_MS}ms` }}
    >
      <span className="flex justify-center items-center bg-primary-50 group-hover:bg-primary-100 rounded-md size-10 text-primary-800 transition-colors duration-150 shrink-0">
        <Icon
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          className="motion-safe:group-hover:-translate-y-0.5 transition-transform duration-150"
        />
      </span>
      <div className="min-w-0">
        <p className="font-medium text-body text-neutral-900">{title}</p>
        <p className="text-neutral-600 text-small line-clamp-2">{description}</p>
      </div>
    </li>
  );
}
