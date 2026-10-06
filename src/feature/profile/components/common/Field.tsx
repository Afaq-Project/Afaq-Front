import type { ReactNode } from "react";

/** A read-only label/value pair; empty values show as "—". */
export function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-neutral-900">{value || "—"}</p>
    </div>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">{children}</div>;
}
