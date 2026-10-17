import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";

/** Centered 1200px column. Side padding: 16px below 768, 24px to 1279, 32px from 1280. */
export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mx-auto w-full max-w-300 px-4 md:px-6 xl:px-8", className)} {...props} />;
}
