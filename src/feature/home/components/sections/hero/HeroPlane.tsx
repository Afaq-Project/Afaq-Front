import { cn } from "@/src/feature/dashboard/services/utils";

/*
 * One SVG (viewBox 480 × 100) so the dashed flight path and the plane scale together. The path
 * starts above the headline's first word, makes a small loop halfway and comes down into the
 * plane's tail; the plane (/public/hero/plane.png, 309 × 208, nose toward the inline-end) sits
 * over the end of the first line. Strokes stay 2px at any size.
 */
const PLANE = { x: 340, y: 4, width: 128, height: 86 };
const TRAIL = [
  "M16 80 C 60 40, 120 22, 180 30", // rise from above the first word
  "C 230 37, 236 74, 206 72", // swing down and back: the loop's lower half
  "C 178 70, 186 24, 228 18", // climb up across the line: closes the loop
  "C 280 12, 345 40, 372 50", // on into the plane's tail
].join(" ");

/** Decorative plane with a dashed trail, above the hero headline. Mirrors in right-to-left layouts. */
export function HeroPlane({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 480 100"
      fill="none"
      className={cn("pointer-events-none select-none flip-rtl overflow-visible", className)}
    >
      <path
        d={TRAIL}
        className="stroke-primary-400"
        strokeWidth={2}
        strokeDasharray="7 9"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <image href="/hero/plane.png" {...PLANE} preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}
