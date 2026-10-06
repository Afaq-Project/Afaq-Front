import type { ReactNode } from "react";

interface FieldLabelProps {
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
}

/** A form field label, marked with a red `*` when required or "(optional)" when optional. */
export function FieldLabel({ children, required, optional, htmlFor }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-on-surface">
      {children}
      {required && <span className="text-error"> *</span>}
      {optional && <span className="text-xs font-normal text-outline"> (optional)</span>}
    </label>
  );
}
