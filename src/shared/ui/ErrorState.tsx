import React from "react";
import Button from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  fullScreen?: boolean;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Try Again",
  className = "",
  fullScreen = false,
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center ${
        fullScreen ? "min-h-screen" : "min-h-[400px]"
      } w-full ${className}`}
    >
      <div className="bg-neutral-50 rounded-2xl shadow-card p-8 max-w-md w-full flex flex-col items-center gap-4 border border-neutral-100">
        <div className="w-14 h-14 rounded-full bg-danger-50 text-danger-600 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-h2 font-semibold text-neutral-900">{title}</h2>
          <p className="text-small text-neutral-600 leading-relaxed">{message}</p>
        </div>
        {onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            variant="primary"
            className="mt-2"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
