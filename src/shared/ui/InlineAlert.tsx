import type { ReactNode } from "react";
import { CircleAlert, Info } from "lucide-react";

type InlineAlertVariant = "info" | "error";

interface InlineAlertProps {
  variant?: InlineAlertVariant;
  id?: string;
  className?: string;
  children: ReactNode;
}

const variants: Record<
  InlineAlertVariant,
  { classes: string; Icon: typeof Info; role: "status" | "alert" }
> = {
  info: { classes: "bg-info-50 text-info-800", Icon: Info, role: "status" },
  error: {
    classes: "bg-danger-50 text-danger-800",
    Icon: CircleAlert,
    role: "alert",
  },
};

/** Inline message on a tinted background. Icon + text, so meaning never relies on color alone. */
export default function InlineAlert({
  variant = "info",
  id,
  className = "",
  children,
}: InlineAlertProps) {
  const { classes, Icon, role } = variants[variant];

  return (
    <div
      id={id}
      role={role}
      className={`flex items-start gap-2 px-3 py-2.5 rounded-sm text-small ${classes} ${className}`}
    >
      <Icon
        size={16}
        strokeWidth={1.75}
        className="mt-px shrink-0"
        aria-hidden="true"
      />
      <div>{children}</div>
    </div>
  );
}
