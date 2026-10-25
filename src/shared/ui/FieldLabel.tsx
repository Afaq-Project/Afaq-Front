import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface FieldLabelProps {
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
}

/** A form field label, marked with a red `*` when required or "(optional)" when optional. */
export function FieldLabel({ children, required, optional, htmlFor }: FieldLabelProps) {
  const t = useTranslations("common");
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-on-surface">
      {children}
      {required && <span className="text-error"> *</span>}
      {optional && <span className="text-xs font-normal text-outline"> {t("optionalField")}</span>}
    </label>
  );
}
