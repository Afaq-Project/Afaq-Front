"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

interface CompletionDonutProps {
  /** 0–100 */
  percent: number;
  /** Diameter in px (design: 56–64). */
  size?: number;
}

/**
 * Small completion donut: green-600 fill on a neutral-100 track, rounded ends, with the
 * percentage as centered text. Decorative to screen readers — the caller labels it.
 */
export function CompletionDonut({ percent, size = 60 }: CompletionDonutProps) {
  const value = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <RadialBarChart
        width={size}
        height={size}
        cx="50%"
        cy="50%"
        innerRadius="76%"
        outerRadius="100%"
        barSize={6}
        data={[{ value }]}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          dataKey="value"
          cornerRadius={6}
          fill="var(--color-primary-600)"
          background={{ className: "fill-neutral-100" }}
          animationDuration={400}
        />
      </RadialBarChart>
      <span className="absolute inset-0 flex items-center justify-center text-caption text-neutral-900">{value}%</span>
    </div>
  );
}
