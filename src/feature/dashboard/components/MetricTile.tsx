import type { LucideIcon } from "lucide-react";
import type { Tone } from "@/src/shared/ui/Badge";
import { cn } from "../services/utils";

const TONE_STYLES: Record<Tone, { card: string; icon: string }> = {
  gray: { card: "bg-neutral-400", icon: "bg-white/15 text-white" },
  blue: { card: "bg-info-600", icon: "bg-white/15 text-white" },
  green: { card: "bg-primary-400", icon: "bg-white/15 text-white" },
  amber: { card: "bg-warning-400", icon: "bg-white/15 text-white" },
  teal: { card: "bg-success-600", icon: "bg-white/15 text-white" },
  red: { card: "bg-danger-400", icon: "bg-white/15 text-white" },
};

export interface MetricTileProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone?: Tone;
  /** Small decorative icon shown in the card's top-right corner. */
  cornerIcon?: LucideIcon;
  className?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
}

export function MetricTile({
  icon: Icon,
  label,
  value,
  tone = "gray",
  cornerIcon: CornerIcon,
  className,
  iconContainerClassName,
  iconClassName,
}: MetricTileProps) {
  const toneStyles = TONE_STYLES[tone];

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between shadow-card p-4 sm:p-5 rounded-lg transition-transform hover:-translate-y-0.5 duration-200 ease-out",
        toneStyles.card,
        className,
      )}
    >
      {CornerIcon && (
        <CornerIcon
          className="top-3 right-3 absolute w-5 h-5 text-white/60"
          strokeWidth={2}
          aria-hidden="true"
        />
      )}

      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex justify-center items-center rounded-lg w-10 h-10",
            toneStyles.icon,
            iconContainerClassName,
          )}
        >
          <Icon
            className={cn("w-5 h-5", iconClassName)}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
        <span className="font-semibold text-small text-white/90">{label}</span>
      </div>
      <div className="mt-5 sm:mt-6">
        <p className="font-bold text-white text-2xl sm:text-3xl md:text-4xl tracking-normal">
          {value}
        </p>
      </div>
    </div>
  );
}
