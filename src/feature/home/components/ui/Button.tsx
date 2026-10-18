import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";

export type LandingButtonVariant = "primary" | "secondary" | "soft" | "ghost";
export type LandingButtonSize = "sm" | "md";

const VARIANTS: Record<LandingButtonVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-800",
  secondary: "bg-white border border-neutral-100 text-neutral-900 hover:border-neutral-200 hover:bg-offwhite",
  soft: "bg-primary-50 text-primary-800 hover:bg-primary-100",
  ghost: "text-neutral-900 hover:bg-neutral-900/5",
};

const SIZES: Record<LandingButtonSize, { button: string; icon: number }> = {
  sm: { button: "h-9 px-3.5 text-landing-small", icon: 16 },
  md: { button: "h-11 px-5 text-landing-body", icon: 18 },
};

interface OwnProps {
  /** Use one primary button per section at most. */
  variant?: LandingButtonVariant;
  /** sm: 36px tall. md: 44px tall. */
  size?: LandingButtonSize;
  /** Icon after the label. Flipped in right-to-left layouts unless `flipIconInRtl` is false. */
  trailingIcon?: LucideIcon;
  /** Set false for icons that aren't directional along the line (e.g. arrow-down). Default true. */
  flipIconInRtl?: boolean;
  className?: string;
  children: ReactNode;
}

type LinkProps = OwnProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, keyof OwnProps | "href">;
type NativeButtonProps = OwnProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof OwnProps>;
export type LandingButtonProps = LinkProps | NativeButtonProps;

export function landingButtonClasses(variant: LandingButtonVariant = "primary", size: LandingButtonSize = "md", className?: string) {
  return cn(
    "inline-flex justify-center items-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors",
    "focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size].button,
    className,
  );
}

/** Landing page button. Renders a Link when given `href`, otherwise a <button>. */
export function Button({ variant = "primary", size = "md", trailingIcon: TrailingIcon, flipIconInRtl = true, className, children, ...rest }: LandingButtonProps) {
  const classes = landingButtonClasses(variant, size, className);
  const content = (
    <>
      {children}
      {TrailingIcon && <TrailingIcon size={SIZES[size].icon} strokeWidth={1.75} aria-hidden="true" className={cn("shrink-0", flipIconInRtl && "flip-rtl")} />}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <Link {...(rest as Omit<LinkProps, keyof OwnProps>)} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<NativeButtonProps, keyof OwnProps>;
  return (
    <button {...buttonProps} type={type} className={classes}>
      {content}
    </button>
  );
}
