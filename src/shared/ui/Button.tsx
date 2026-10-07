import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "inverse"
  | "accent";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-800",
  secondary:
    "bg-transparent text-primary-600 border border-neutral-200 hover:border-neutral-400",
  ghost: "bg-transparent text-neutral-600 hover:text-neutral-900",
  destructive: "bg-danger-50 text-danger-800 hover:bg-danger-100",
  inverse: "bg-white text-primary-800 hover:bg-primary-50",
  accent: "bg-primary-900 text-white hover:bg-primary-800",
};

/** Button styling, exported so other elements (e.g. links) can look like buttons. */
export function buttonClasses(variant: ButtonVariant = "primary", className = "") {
  return `inline-flex items-center justify-center gap-2 h-11 md:h-10 px-4
        rounded-sm text-sm font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${className}`;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className = "", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={buttonClasses(variant, className)}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
