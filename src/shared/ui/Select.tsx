import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, className = "", id, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-medium text-neutral-800 text-xs">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={`h-10 w-full appearance-none rounded-sm border border-neutral-200 bg-white pl-3 pr-9 text-sm text-neutral-900
            focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
            disabled:opacity-50 disabled:pointer-events-none
            ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          className="top-1/2 right-3 absolute text-neutral-400 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
});

export default Select;
