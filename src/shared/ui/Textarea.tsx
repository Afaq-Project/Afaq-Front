import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className = "", id, rows = 4, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-medium text-neutral-800 text-xs">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`px-3 py-2 rounded-sm border text-sm resize-none
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

export default Textarea;
