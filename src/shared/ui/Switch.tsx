"use client";

import { useId } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";

interface SwitchProps {
  /** Visible label beside the track, e.g. "Email". */
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** ID of an element that names what this switch is for (e.g. the row label), read before `label`. */
  contextId?: string;
  disabled?: boolean;
}

/** On/off switch with a visible label. The label and track are one 44px-tall button; green-600 when on. */
export function Switch({ label, checked, onChange, contextId, disabled = false }: SwitchProps) {
  const labelId = useId();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={[contextId, labelId].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-2 disabled:opacity-50 -mx-1 px-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 min-h-11 text-neutral-800 text-small disabled:pointer-events-none"
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex items-center rounded-full w-9 h-5 transition-colors shrink-0",
          checked ? "bg-primary-600" : "bg-neutral-200 group-hover:bg-neutral-400",
        )}
      >
        <span
          className={cn(
            "bg-white shadow-sm rounded-full size-4 transition-transform",
            checked ? "translate-x-4.5" : "translate-x-0.5",
          )}
        />
      </span>
      <span id={labelId}>{label}</span>
    </button>
  );
}
