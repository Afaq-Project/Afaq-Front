import { cn } from "@/shared/utils/cn";

export type BadgeTone = "neutral" | "accent" | "warning" | "success" | "info";

const TONE_STYLES: Record<BadgeTone, string> = {
  neutral: "bg-stone-100 text-stone-600 border-stone-200",
  accent: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  success: "bg-green-50 text-green-700 border-green-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        TONE_STYLES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
