import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    className = "",
    id,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-caption text-neutral-800">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [describedBy, errorId].filter(Boolean).join(" ") || undefined
        }
        className={`h-11 md:h-10 px-3 rounded-sm border bg-white text-sm text-neutral-900 placeholder:text-neutral-400
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
          disabled:opacity-50 disabled:pointer-events-none
          ${error ? "border-danger-600" : "border-neutral-200"}
          ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-danger-800 text-xs">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
