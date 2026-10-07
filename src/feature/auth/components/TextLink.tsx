import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

interface TextLinkProps extends LinkProps {
  /** Link sits inside running text — skip the 44px tap-target box so the line doesn't stretch. */
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

/** Text link with a visible focus ring and, unless inline, a 44px tap target on mobile. */
export default function TextLink({
  inline = false,
  className = "",
  children,
  ...props
}: TextLinkProps) {
  return (
    <Link
      className={`${inline ? "" : "inline-flex items-center max-md:min-h-11"} rounded-sm font-medium text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
