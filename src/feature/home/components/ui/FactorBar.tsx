import { cn } from "@/src/feature/dashboard/services/utils";
import { content } from "../../content/en";

/**
 * One match factor: label and "x of y" on one line, then a 4px bar (green-600 on a neutral-50
 * track) filled by score / max. For the Matching section's breakdown.
 */
export function FactorBar({ label, score, max, className }: { label: string; score: number; max: number; className?: string }) {
  const value = content.common.factorScore.replace("{score}", String(score)).replace("{max}", String(max));

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex justify-between items-center gap-2 text-landing-caption">
        <span className="text-neutral-600">{label}</span>
        <span className="font-medium text-neutral-800">{value}</span>
      </div>
      <div className="bg-neutral-50 rounded-full h-1 overflow-hidden">
        <div className="bg-primary-600 rounded-full h-full" style={{ width: `${Math.min(score / max, 1) * 100}%` }} />
      </div>
    </div>
  );
}
