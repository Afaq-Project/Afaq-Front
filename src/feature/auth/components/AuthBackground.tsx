// Gently curved, roughly parallel lines; spacing widens toward the bottom (viewBox units).
const HORIZON_LINES = [
  "M0 150 C 360 128, 1080 176, 1440 146",
  "M0 194 C 400 170, 1040 222, 1440 190",
  "M0 246 C 340 226, 1100 270, 1440 244",
  "M0 306 C 420 282, 1000 334, 1440 302",
  "M0 376 C 380 356, 1060 398, 1440 372",
];

/**
 * Decorative "horizon" backdrop for the auth pages: a soft green glow at the bottom
 * center with thin curved lines over it. Fixed behind the content, static (no animation).
 */
export default function AuthBackground() {
  return (
    <div aria-hidden="true" className="-z-10 fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,var(--color-primary-50),transparent)]" />
      {/* Stretches horizontally to any width; non-scaling strokes stay 1px. */}
      <svg
        className="max-md:hidden bottom-0 absolute inset-x-0 w-full h-[60dvh]"
        viewBox="0 0 1440 480"
        preserveAspectRatio="none"
        fill="none"
      >
        <g className="stroke-primary-200 opacity-30">
          {HORIZON_LINES.map((d) => (
            <path key={d} d={d} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>
    </div>
  );
}
