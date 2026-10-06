import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";

interface FieldProps {
  label: string;
  /** Text or rendered content (e.g. pills). Empty values show a muted "Not added yet". */
  value?: ReactNode;
  /** Info tooltip next to the label, e.g. "Required for matching". */
  info?: string;
  /** 16px outline icon shown before a filled value. */
  icon?: LucideIcon;
}

function isEmpty(value: ReactNode) {
  return value === undefined || value === null || value === false || value === "";
}

/** A read-only label/value pair: Caption neutral-600 label, Body neutral-900 value. */
export function Field({ label, value, info, icon: Icon }: FieldProps) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1 text-caption text-neutral-600">
        {label}
        {info && <InfoTooltip text={info} />}
      </dt>
      <dd className="mt-1 break-words text-body text-neutral-900">
        {isEmpty(value) ? (
          <span className="text-neutral-400">Not added yet</span>
        ) : Icon ? (
          <span className="inline-flex items-center gap-1.5">
            <Icon size={16} strokeWidth={1.75} className="shrink-0 text-neutral-600" aria-hidden="true" />
            {value}
          </span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

/**
 * Field layout: one column on phones, two from `sm`, three from `xl` so related values stay
 * close together instead of zigzagging across a wide card.
 */
export function FieldGrid({ children }: { children: ReactNode }) {
  return <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">{children}</dl>;
}
