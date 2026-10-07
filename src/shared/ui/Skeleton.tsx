import { twMerge } from "tailwind-merge";

/**
 * A placeholder block shown while content loads. Size and shape come from `className`
 * (e.g. "h-4 w-32", "size-16 rounded-full"). Hidden from screen readers — wrap a loading
 * region in an element with role="status" and a visually hidden label instead.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={twMerge("animate-pulse rounded-sm bg-neutral-100 motion-reduce:animate-none", className)}
    />
  );
}
