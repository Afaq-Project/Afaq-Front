import type { ReactNode } from "react";

interface CompletionDonutProps {
  /** 0–100 */
  percent: number;
  /** Diameter in px (design: 56–64). */
  size?: number;
  /** Replaces the centered percentage, e.g. a check icon once complete. */
  center?: ReactNode;
}

const STROKE = 6;

/**
 * Small completion donut: primary-600 arc on a neutral-100 track, rounded ends, with the
 * percentage as centered text. Plain SVG. Decorative to screen readers — the caller labels it.
 */
export function CompletionDonut({ percent, size = 60, center }: CompletionDonutProps) {
  const value = Math.min(100, Math.max(0, Math.round(percent)));
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={STROKE} className="stroke-neutral-100" />
        {value > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - value / 100)}
            className="stroke-primary-600 transition-[stroke-dashoffset] duration-400 motion-reduce:transition-none"
          />
        )}
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-caption text-neutral-900">{center ?? `${value}%`}</span>
    </div>
  );
}
