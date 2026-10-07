const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Profile-completion ring, or a same-sized spinner while the percentage loads. */
export function CompletionRing({ percent, isLoading }: { percent: number; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading profile completion"
        className="w-16 h-16 flex-shrink-0 flex items-center justify-center"
      >
        <div className="w-12 h-12 rounded-full border-[5px] border-surface-container-highest border-t-primary animate-spin" />
      </div>
    );
  }

  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        <circle
          className="text-surface-container-highest"
          cx="50"
          cy="50"
          fill="transparent"
          r={RADIUS}
          stroke="currentColor"
          strokeWidth="8"
        />
        <circle
          className="text-primary transition-all duration-1000 ease-out"
          cx="50"
          cy="50"
          fill="transparent"
          r={RADIUS}
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm text-on-surface font-bold">
        {percent}%
      </div>
    </div>
  );
}
