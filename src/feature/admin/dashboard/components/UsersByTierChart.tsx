"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { DashboardUserMetrics } from "../types/metrics";
import { formatNumber } from "../services/utils";

type TierKey = "premium" | "free";

const TIER_COLOR: Record<TierKey, string> = {
  premium: "#3b6d11", // primary-600 — the tier worth drawing the eye to
  free: "#b4b2a9", // neutral-200 — de-emphasized base tier
};

interface DonutTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { key: TierKey; label: string; value: number } }>;
}

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;

  return (
    <div className="flex items-center gap-2 bg-white shadow-card px-3 py-2 rounded-md">
      <span
        className="rounded-full w-2 h-2 shrink-0"
        style={{ backgroundColor: TIER_COLOR[point.key] }}
      />
      <p className="font-semibold text-neutral-900 text-small">{formatNumber(point.value)}</p>
      <p className="text-neutral-500 text-caption">{point.label}</p>
    </div>
  );
}

export function UsersByTierChart({ users }: { users: DashboardUserMetrics }) {
  const data: Array<{ key: TierKey; label: string; value: number }> = [
    { key: "premium", label: "Premium", value: users.premium },
    { key: "free", label: "Free", value: users.free },
  ];

  return (
    <div className="flex flex-col gap-4 bg-white shadow-card p-5 rounded-lg h-full">
      <div className="flex items-center gap-2">
        <PieChartIcon size={18} strokeWidth={1.75} className="text-neutral-500" aria-hidden="true" />
        <h2 className="text-h3">Users by tier</h2>
      </div>

      <div className="relative w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={3}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={TIER_COLOR[entry.key]} />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
          <p className="text-neutral-500 text-caption">Total</p>
          <p className="font-bold text-neutral-900 text-xl">{formatNumber(users.total)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {data.map((entry) => (
          <div key={entry.key} className="flex justify-between items-center text-small">
            <div className="flex items-center gap-2">
              <span
                className="rounded-full w-2 h-2 shrink-0"
                style={{ backgroundColor: TIER_COLOR[entry.key] }}
              />
              <span className="text-neutral-700">{entry.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-neutral-900">{formatNumber(entry.value)}</span>
              <span className="text-neutral-400">
                {Math.round((entry.value / users.total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
