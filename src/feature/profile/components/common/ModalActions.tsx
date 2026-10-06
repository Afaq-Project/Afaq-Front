interface ModalActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isPending: boolean;
  saveLabel?: string;
  saveDisabled?: boolean;
  /** Error to show above the buttons, e.g. from the API. */
  error?: string | null;
}

/** Cancel / save buttons for the profile edit modals. */
export function ModalActions({
  onCancel,
  onSave,
  isPending,
  saveLabel = "Save changes",
  saveDisabled = false,
  error,
}: ModalActionsProps) {
  return (
    <>
      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isPending || saveDisabled}
          className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity cursor-pointer"
        >
          {isPending ? "Saving…" : saveLabel}
        </button>
      </div>
    </>
  );
}
