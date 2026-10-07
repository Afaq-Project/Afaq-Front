import Button from "./Button";

interface EditActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  isSaving?: boolean;
  saveDisabled?: boolean;
  /** Shown above the buttons, e.g. an API error. */
  error?: string | null;
}

/** "Cancel" (ghost) and "Save changes" (primary) for inline edit forms. */
export function EditActions({
  onCancel,
  onSave,
  saveLabel = "Save changes",
  isSaving = false,
  saveDisabled = false,
  error,
}: EditActionsProps) {
  return (
    <div className="mt-5 flex flex-col gap-3">
      {error && (
        <p role="alert" className="text-small text-danger-800">
          {error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="button" onClick={onSave} disabled={isSaving || saveDisabled}>
          {isSaving ? "Saving…" : saveLabel}
        </Button>
      </div>
    </div>
  );
}
