"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { APPLICATION_STATUS_BREAKDOWN } from "../mocks/applicationStatusBreakdown";
import { APPLICATION_STAGES, ApplicationStage, STAGE_COLOR } from "../types/applicationStatus";
import { formatNumber } from "../services/utils";

const CHART_DATA = APPLICATION_STAGES.map((stage) => ({
  stage,
  count: APPLICATION_STATUS_BREAKDOWN[stage],
}));

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { stage: ApplicationStage; count: number } }>;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;

  return (
    <div className="flex items-center gap-2 bg-white shadow-card px-3 py-2 rounded-md">
      <span
        className="rounded-full w-2 h-2 shrink-0"
        style={{ backgroundColor: STAGE_COLOR[point.stage] }}
      />
      <p className="font-semibold text-neutral-900 text-small">{formatNumber(point.count)}</p>
      <p className="text-neutral-500 text-caption">{point.stage}</p>
    </div>
  );
}

export function ApplicationsStatusChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4 bg-white shadow-card p-5 rounded-lg h-full">
      <div className="flex items-center gap-2">
        <BarChart3 size={18} strokeWidth={1.75} className="text-neutral-500" aria-hidden="true" />
        <div>
          <h2 className="text-h3">Applications by status</h2>
          <p className="text-neutral-500 text-caption">All applications submitted platform-wide</p>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CHART_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#d3d1c7" />
            <XAxis
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#5f5e5a", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#5f5e5a", fontSize: 12 }}
              width={40}
              allowDecimals={false}
            />
            <Tooltip cursor={{ fill: "#efefef" }} content={<ChartTooltip />} />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {CHART_DATA.map((entry, index) => (
                <Cell
                  key={entry.stage}
                  fill={STAGE_COLOR[entry.stage]}
                  fillOpacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
