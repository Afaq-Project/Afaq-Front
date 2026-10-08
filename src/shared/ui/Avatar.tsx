import { cn } from "@/src/feature/dashboard/services/utils";
import { getInitials } from "@/src/shared/lib/initials";

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = getInitials(name);

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
