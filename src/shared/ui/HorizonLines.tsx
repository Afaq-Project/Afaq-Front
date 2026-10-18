import { cn } from "@/src/feature/dashboard/services/utils";

// Gently curved, roughly parallel lines; spacing widens toward the bottom (viewBox units).
const WAVE_LINES = [
  "M0 150 C 360 128, 1080 176, 1440 146",
  "M0 194 C 400 170, 1040 222, 1440 190",
  "M0 246 C 340 226, 1100 270, 1440 244",
  "M0 306 C 420 282, 1000 334, 1440 302",
  "M0 376 C 380 356, 1060 398, 1440 372",
];

/*
 * Arc lines: each rises to its highest point at the center. `peak` is the line's height at the
 * center and `sag` how much lower its ends are (viewBox units; the viewBox is 200 tall, so at
 * the default 200px height they are pixels). Gaps between peaks grow downward (10, 12, 15, 18,
 * 22) and lower lines curve more, so they fan out like contours. Opacity fades 0.7 → 0.3.
 */
const ARC_HEIGHT = 200;
const ARC_LINES = [
  { peak: 40, sag: 28, opacity: 0.7 },
  { peak: 50, sag: 34, opacity: 0.62 },
  { peak: 62, sag: 40, opacity: 0.54 },
  { peak: 77, sag: 47, opacity: 0.46 },
  { peak: 95, sag: 55, opacity: 0.38 },
  { peak: 117, sag: 64, opacity: 0.3 },
];
/** Lines shown below 768px; the rest are hidden there. */
const ARC_MOBILE_LINES = 4;

/**
 * Cubic from edge to edge with both control points at the same height: the curve is a parabola
 * peaking at the center, 3/4 of the way from the ends to the control height.
 */
function arcPath({ peak, sag }: { peak: number; sag: number }) {
  const edge = peak + sag;
  const control = edge - (sag * 4) / 3;
  return `M0 ${edge} C 480 ${control}, 960 ${control}, 1440 ${edge}`;
}

/**
 * The "horizon" motif: thin 1px lines that stretch to any box (preserveAspectRatio none, and
 * non-scaling strokes stay 1px). Decorative.
 *  - "wave" (default): five gently waving lines at a uniform opacity (`lineClassName`, default
 *    green-200 at 30%). Auth background, opportunity header.
 *  - "arc": six lines arching up toward the center, fading from 0.7 to 0.3 (four below 768px).
 *    Give it a full-width box; 200px tall keeps the designed spacing. Landing hero and final
 *    call to action.
 */
export function HorizonLines({
  variant = "wave",
  className,
  lineClassName,
}: {
  variant?: "wave" | "arc";
  className?: string;
  /** Stroke color (and, for "wave", opacity) of the lines. */
  lineClassName?: string;
}) {
  if (variant === "arc") {
    return (
      <svg
        aria-hidden="true"
        className={cn("w-full h-50 pointer-events-none", className)}
        viewBox={`0 0 1440 ${ARC_HEIGHT}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <g className={lineClassName ?? "stroke-primary-200"}>
          {ARC_LINES.map((line, index) => (
            <path
              key={line.peak}
              d={arcPath(line)}
              strokeWidth={1}
              strokeOpacity={line.opacity}
              vectorEffect="non-scaling-stroke"
              className={index >= ARC_MOBILE_LINES ? "max-md:hidden" : undefined}
            />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={cn("w-full pointer-events-none", className)}
      viewBox="0 0 1440 480"
      preserveAspectRatio="none"
      fill="none"
    >
      <g className={lineClassName ?? "stroke-primary-200 opacity-30"}>
        {WAVE_LINES.map((d) => (
          <path key={d} d={d} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
