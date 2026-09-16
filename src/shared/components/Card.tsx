import { cn } from "@/shared/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  highlighted?: boolean;
}

/** Base surface used across dashboards, sidebars, and previews. */
export function Card({ children, className, highlighted }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-sm",
        highlighted ? "border-stone-900/70" : "border-stone-200",
        className
      )}
    >
      {children}
    </div>
  );
}
