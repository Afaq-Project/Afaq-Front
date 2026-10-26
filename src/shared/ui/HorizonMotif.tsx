import { cn } from "@/src/feature/dashboard/services/utils";

/*
 * Sun and rings share one center, 80px in from the end edge and 40px below the bottom edge, so
 * only their tops show. The SVG box is what's visible: the largest ring's radius (190) toward the
 * start, 80 toward the end, and 190 - 40 = 150 above the bottom edge.
 */
const R_MAX = 190;
const CENTER_FROM_END = 80;
const CENTER_BELOW = 40;
const WIDTH = R_MAX + CENTER_FROM_END;
const HEIGHT = R_MAX - CENTER_BELOW;
const CX = R_MAX;
const CY = R_MAX;

const RINGS = [
  { r: 110, opacity: 0.45 },
  { r: 150, opacity: 0.28 },
  { r: 190, opacity: 0.16 },
];

const DRAW_STAGGER_MS = 120;

/**
 * The "horizon" sunrise: a sun with three rings rising from the bottom end corner (mirrored in
 * RTL) over a 1px horizon line along the bottom edge. Decorative; fills its parent, which needs
 * `relative` and `overflow-hidden`, and sits under content given `relative z-[1]`. 60% size
 * below 768px, same corner. `animate` draws the rings once (skipped with reduced motion).
 */
export function HorizonMotif({ animate = false, className }: { animate?: boolean; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("absolute inset-0 pointer-events-none", className)}>
      <div className="bottom-0 absolute inset-x-0 bg-primary-400/50 h-px" />
      <svg
        className="end-0 bottom-0 absolute w-[162px] md:w-[270px] h-[90px] md:h-[150px] rtl:-scale-x-100"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        fill="none"
      >
        {/* #4a8016 sits between primary-600 and primary-400. */}
        <circle cx={CX} cy={CY} r={70} fill="#4a8016" fillOpacity={0.45} />
        <g className="stroke-primary-400">
          {RINGS.map((ring, index) => (
            <circle
              key={ring.r}
              cx={CX}
              cy={CY}
              r={ring.r}
              strokeWidth={1.5}
              strokeOpacity={ring.opacity}
              pathLength={1}
              strokeDasharray={animate ? 1 : undefined}
              className={animate ? "motion-safe:animate-horizon-draw" : undefined}
              style={animate ? { animationDelay: `${index * DRAW_STAGGER_MS}ms` } : undefined}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
