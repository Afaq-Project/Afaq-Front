import type { ReactNode } from "react";

/** True outside production builds, where missing billing config is shown as a TODO. */
export const SHOW_TODOS = process.env.NODE_ENV !== "production";

/** A visible placeholder for billing config that doesn't exist yet. Renders nothing in production. */
export function DevTodo({ children }: { children: ReactNode }) {
  if (!SHOW_TODOS) return null;
  return (
    <span className="inline-flex items-center bg-warning-50 px-2 py-1 border border-warning-400 border-dashed rounded-sm text-caption text-warning-800">
      TODO: {children}
    </span>
  );
}
