import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", id, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-medium text-neutral-800 text-xs">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`h-11 md:h-10 px-3 rounded-sm border text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
          disabled:opacity-50 disabled:pointer-events-none
          ${error ? "border-danger-600" : "border-neutral-200"}
          ${className}`}
        {...props}
      />
      {error && <p className="text-danger-800 text-xs">{error}</p>}
    </div>
  );
});

export default Input;
