"use client";

import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { Toaster as SonnerToaster } from "sonner";

const ICON = { size: 20, strokeWidth: 1.75, "aria-hidden": true } as const;

/**
 * App-wide toast host, styled entirely with design tokens (Sonner runs unstyled):
 * a radius-lg card with shadow-sm (toasts float, so they get the floating-layer shadow),
 * tinted by type — the semantic ramp's 50 step as the background, its 400 step (softened)
 * as the border and its 600 step for the icon. Plain and loading toasts stay neutral.
 * Mount once, near the root.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      duration={4000}
      icons={{
        success: <CircleCheck {...ICON} className="text-success-600" />,
        error: <CircleAlert {...ICON} className="text-danger-600" />,
        info: <Info {...ICON} className="text-info-600" />,
        warning: <TriangleAlert {...ICON} className="text-warning-600" />,
        loading: <LoaderCircle {...ICON} className="animate-spin text-neutral-600" />,
        close: <X size={14} strokeWidth={1.75} aria-hidden />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group/toast relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-sm sm:w-[360px]",
          default: "border-neutral-100 bg-white",
          loading: "border-neutral-100 bg-white",
          success: "border-success-400/40 bg-success-50",
          error: "border-danger-400/40 bg-danger-50",
          info: "border-info-400/40 bg-info-50",
          warning: "border-warning-400/40 bg-warning-50",
          icon: "mt-0.5 shrink-0",
          content: "flex min-w-0 flex-1 flex-col gap-0.5",
          title: "text-body font-medium text-neutral-900",
          description: "text-small text-neutral-600",
          actionButton:
            "ml-auto shrink-0 rounded-sm px-2 text-small font-medium text-primary-600 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
          closeButton:
            "absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border border-[inherit] bg-inherit text-neutral-600 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
        },
      }}
    />
  );
}
