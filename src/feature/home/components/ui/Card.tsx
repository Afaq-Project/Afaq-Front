import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";

type CardProps<T extends ElementType> = {
  as?: T;
  /** Adds shadow-sm, for cards that overlap other content. Static cards stay flat. */
  floating?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** White card with a 1px border and 20px radius. Padding: 20px, 24px from 1024px. */
export function Card<T extends ElementType = "div">({ as, floating = false, className, ...props }: CardProps<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag
      className={cn("bg-white p-5 lg:p-6 border border-neutral-100 rounded-lg", floating && "shadow-sm", className)}
      {...props}
    />
  );
}
