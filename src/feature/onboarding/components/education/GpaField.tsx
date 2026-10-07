import { GPA_SCALES, getGpaScale } from "@/src/shared/lib/education";
import type { GpaScale } from "../../types";
import { FieldLabel } from "@/src/shared/ui/FieldLabel";

interface GpaFieldProps {
  gpa?: string;
  scale?: GpaScale;
  invalid: boolean;
  onChange: (gpa: string, scale: GpaScale) => void;
}

/** GPA input with a scale switch; switching scale clears the value. */
export function GpaField({ gpa, scale, invalid, onChange }: GpaFieldProps) {
  const current = getGpaScale(scale);

  return (
    <div className="flex flex-col gap-3">
      <FieldLabel htmlFor="onb-gpa" optional>GPA / Grade</FieldLabel>
      <div className="flex sm:flex-row flex-col gap-3">
        <div className="flex-grow">
          <input
            id="onb-gpa"
            type="number"
            min="0"
            max={current.max}
            step={current.step}
            value={gpa ?? ""}
            onChange={(e) => onChange(e.target.value, current.value)}
            placeholder={current.placeholder}
            aria-invalid={invalid}
            className="bg-white px-4 py-3 border focus:border-transparent rounded-lg placeholder:text-outline border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary w-full text-on-surface text-sm transition-all"
          />
          {invalid && (
            <p className="mt-1.5 text-xs text-error">Enter a value between 0 and {current.max}.</p>
          )}
        </div>
        <div className="flex self-start sm:self-auto bg-surface-container p-1 border rounded-md border-outline-variant/50">
          {GPA_SCALES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => option.value !== current.value && onChange("", option.value)}
              className={`rounded-md px-3 py-2 text-xs whitespace-nowrap transition-all ${current.value === option.value ? "bg-primary text-on-primary font-semibold shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
