import Button from "./Button";
import { useTranslations } from "next-intl";

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
  saveLabel,
  isSaving = false,
  saveDisabled = false,
  error,
}: EditActionsProps) {
  const t = useTranslations("common");

  return (
    <div className="mt-5 flex flex-col gap-3">
      {error && (
        <p role="alert" className="text-small text-danger-800">
          {error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
          {t("cancel")}
        </Button>
        <Button type="button" onClick={onSave} disabled={isSaving || saveDisabled}>
          {isSaving ? t("saving") : (saveLabel ?? t("saveChanges"))}
        </Button>
      </div>
    </div>
  );
}
