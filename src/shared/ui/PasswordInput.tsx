import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  /** Rendered at the end of the label row, e.g. a "Forgot password?" link. */
  labelAction?: ReactNode;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      label,
      labelAction,
      error,
      className = "",
      id,
      placeholder = "••••••••",
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const errorId = error && id ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <div className="flex justify-between items-center">
            <label htmlFor={id} className="text-caption text-neutral-800">
              {label}
            </label>
            {labelAction}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              [describedBy, errorId].filter(Boolean).join(" ") || undefined
            }
            className={`h-11 md:h-10 px-3 pr-11 rounded-sm border w-full bg-white text-sm text-neutral-900 placeholder:text-neutral-400
              focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
              disabled:opacity-50 disabled:pointer-events-none
              ${error ? "border-danger-600" : "border-neutral-200"}
              ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-controls={id}
            className="top-0 right-0 absolute flex justify-center items-center rounded-sm w-11 md:w-10 h-full text-neutral-400 hover:text-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            {visible ? (
              <EyeOff size={16} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
        {error && (
          <p id={errorId} className="text-danger-800 text-xs">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export default PasswordInput;
