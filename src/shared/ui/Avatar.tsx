import { cn } from "@/feature/dashboard/services/utils";

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex justify-center items-center bg-primary-100 rounded-full w-9 h-9 font-medium text-caption text-primary-800 shrink-0",
        className,
      )}
    >
      {initials}
    </div>
  );
}
