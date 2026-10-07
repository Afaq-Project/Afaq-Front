/**
 * Language proficiency pill: tinted info (blue) ramp, never brand green, always a text label.
 * Design system: ramp-50 background, 800-stop text, radius-full, 12px caption.
 */
export function ProficiencyBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-info-50 px-2.5 py-1 text-caption text-info-800">
      {label}
    </span>
  );
}
