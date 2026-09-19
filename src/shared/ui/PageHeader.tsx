import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  action,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 ${className}`}
    >
      <div>
        <h1 className="text-h1">{title}</h1>
        {description && (
          <p className="mt-1 text-neutral-600 text-small">{description}</p>
        )}
      </div>

      {action}
    </div>
  );
}
