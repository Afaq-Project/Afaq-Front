import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

type InlineAlertVariant = "info" | "success" | "warning" | "error";

interface InlineAlertProps {
  variant?: InlineAlertVariant;
  id?: string;
  className?: string;
  children: ReactNode;
  /** Buttons or links shown after the message (beside it from 640px, below it on smaller screens). */
  action?: ReactNode;
}

const variants: Record<
  InlineAlertVariant,
  { classes: string; Icon: typeof Info; role: "status" | "alert" }
> = {
  info: { classes: "bg-info-50 text-info-800", Icon: Info, role: "status" },
  success: { classes: "bg-primary-50 text-primary-800", Icon: CircleCheck, role: "status" },
  warning: { classes: "bg-warning-50 text-warning-800", Icon: TriangleAlert, role: "status" },
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
  action,
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
      {action ? (
        <div className="flex sm:flex-row flex-col flex-1 sm:justify-between sm:items-center gap-2">
          <div>{children}</div>
          <div className="flex flex-wrap items-center gap-2 sm:-my-1 shrink-0">{action}</div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
