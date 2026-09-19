"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import Card from "@/src/shared/ui/Card";
import Badge, { type Tone } from "@/src/shared/ui/Badge";
import { PROFILE_COMPLETION, PROFILE_SECTIONS } from "../mocks/dashboard";
import { cn } from "../services/utils";

const chartData = [{ value: PROFILE_COMPLETION }];

function completionStatus(percent: number): { label: string; tone: Tone } {
  if (percent >= 90) return { label: "Almost done", tone: "teal" };
  if (percent >= 60) return { label: "On track", tone: "green" };
  return { label: "Get started", tone: "amber" };
}

export function ProfileProgressCard() {
  const status = completionStatus(PROFILE_COMPLETION);

  return (
    <Card className="hidden lg:block">
      <div className="flex justify-between items-center">
        <h2 className="text-h2">Profile progress</h2>
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-md font-medium text-white text-caption transition-colors"
        >
          View profile
          <ArrowUpRight size={14} strokeWidth={2} />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="relative w-35 h-35">
          <div
            className="absolute inset-0 opacity-60 blur-2xl"
            style={{
              backgroundImage:
                "radial-gradient(circle, #c0dd97 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <RadialBarChart
            width={140}
            height={140}
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="100%"
            barSize={24}
            data={chartData}
            startAngle={90}
            endAngle={-270}
            className="relative"
          >
            <defs>
              <linearGradient
                id="profileProgressGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#639922" />
                <stop offset="100%" stopColor="#3b6d11" />
              </linearGradient>
            </defs>
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={12}
              fill="url(#profileProgressGradient)"
              background={{ className: "fill-neutral-100" }}
              isAnimationActive={false}
            />
          </RadialBarChart>
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-h1">{PROFILE_COMPLETION}%</span>
            <span className="text-caption text-neutral-600">Complete</span>
          </div>
        </div>

        <Badge tone={status.tone}>{status.label}</Badge>

        <ul className="flex flex-col gap-2.5 w-full">
          {PROFILE_SECTIONS.map((section) => (
            <li
              key={section.label}
              className="flex justify-between items-center text-small"
            >
              <span className="flex items-center gap-2.5 text-neutral-700">
                <span
                  className={cn(
                    "flex justify-center items-center rounded-full w-5 h-5 shrink-0",
                    section.complete
                      ? "bg-primary-600 text-white"
                      : "border-2 border-neutral-200",
                  )}
                >
                  {section.complete && <Check size={12} strokeWidth={3} />}
                </span>
                {section.label}
              </span>
              <span
                className={
                  section.complete
                    ? "font-medium text-primary-800"
                    : "text-neutral-400"
                }
              >
                {section.complete ? "Done" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
