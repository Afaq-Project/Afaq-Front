const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Circular progress drawn around a 48px file icon. */
export function UploadProgressRing({ progress }: { progress: number }) {
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
  return (
    <svg className="absolute inset-0 -rotate-90" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="3" className="text-outline-variant" />
      <circle
        cx="24"
        cy="24"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-primary transition-all duration-300"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}
