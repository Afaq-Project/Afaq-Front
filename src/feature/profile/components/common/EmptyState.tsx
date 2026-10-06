interface EmptyStateProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

/** Empty section message with a call to action. */
export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-6">
      <p className="text-sm text-neutral-400 mb-3">{message}</p>
      <button
        type="button"
        onClick={onAction}
        className="text-sm font-medium text-primary hover:underline cursor-pointer"
      >
        {actionLabel}
      </button>
    </div>
  );
}
