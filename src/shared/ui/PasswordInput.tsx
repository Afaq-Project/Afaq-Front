import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { label, error, className = "", id, placeholder = "••••••••", ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="font-medium text-neutral-800 text-xs"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            className={`h-10 px-3 pr-10 rounded-sm border w-full text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
              disabled:opacity-50 disabled:pointer-events-none
              ${error ? "border-danger-600" : "border-neutral-200"}
              ${className}`}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="top-1/2 right-3 absolute text-neutral-400 hover:text-neutral-700 transition-colors -translate-y-1/2"
          >
            {visible ? (
              <EyeOff size={16} strokeWidth={1.75} />
            ) : (
              <Eye size={16} strokeWidth={1.75} />
            )}
          </button>
        </div>
        {error && <p className="text-danger-800 text-xs">{error}</p>}
      </div>
    );
  },
);

export default PasswordInput;
