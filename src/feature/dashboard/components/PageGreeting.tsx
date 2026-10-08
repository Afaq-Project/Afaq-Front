import type { ReactNode } from "react";

/** Page title (H1) with an optional one-line summary under it. */
export function PageGreeting({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header>
      <h1 className="text-h1 text-neutral-900">{title}</h1>
      {children && <p className="mt-1 text-body text-neutral-600">{children}</p>}
    </header>
  );
}
