import { cn } from "@/src/feature/dashboard/services/utils";

// Gently curved, roughly parallel lines; spacing widens toward the bottom (viewBox units).
const HORIZON_LINES = [
  "M0 150 C 360 128, 1080 176, 1440 146",
  "M0 194 C 400 170, 1040 222, 1440 190",
  "M0 246 C 340 226, 1100 270, 1440 244",
  "M0 306 C 420 282, 1000 334, 1440 302",
  "M0 376 C 380 356, 1060 398, 1440 372",
];

/**
 * The "horizon" motif (auth background, opportunity header): thin 1px lines, green-200 at 30%
 * by default. Stretches to any box. Decorative.
 */
export function HorizonLines({
  className,
  lineClassName = "stroke-primary-200 opacity-30",
}: {
  className?: string;
  /** Stroke color and opacity of the lines. */
  lineClassName?: string;
}) {
  return (
    <svg aria-hidden="true" className={cn("w-full", className)} viewBox="0 0 1440 480" preserveAspectRatio="none" fill="none">
      <g className={lineClassName}>
        {HORIZON_LINES.map((d) => (
          <path key={d} d={d} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
