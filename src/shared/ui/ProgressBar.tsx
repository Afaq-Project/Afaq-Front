import { cn } from "@/feature/dashboard/services/utils";

export interface ProgressBarProps {
 
  value: number;
 
  variant?: "profile" | "application";
  className?: string;
  label?: string;
}

export function ProgressBar({
  value,
  variant = "profile",
  className,
  label,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "bg-neutral-100 rounded-full w-full h-1.5 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full h-full transition-[width]",
          variant === "profile" ? "bg-primary-600" : "bg-primary-800",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
