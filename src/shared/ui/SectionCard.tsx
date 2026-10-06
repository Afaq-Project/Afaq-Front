import type { ReactNode } from "react";
import { EditActions } from "./EditActions";
import { EditButton } from "./EditButton";

interface SectionCardProps {
  title: string;
  /** Next to the title, e.g. a "Used for matching" pill. */
  titleAddon?: ReactNode;
  /** Small text under the title. */
  description?: ReactNode;
  /** Extra header controls shown in view mode. */
  actions?: ReactNode;
  /** Shows the ghost "Edit" button when provided and the card isn't editing. */
  onEdit?: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  isSaving?: boolean;
  saveDisabled?: boolean;
  /** Shown above the edit actions, e.g. an API error. */
  error?: string | null;
  children: ReactNode;
}

/**
 * A view-first card: H3 title and a low-emphasis "Edit" button (revealed on hover / focus on
 * pointer devices); in edit mode the same card shows "Save changes" and "Cancel".
 * Design system: radius-lg, 1px neutral-100 border, no shadow at rest.
 */
export function SectionCard({
  title,
  titleAddon,
  description,
  actions,
  onEdit,
  isEditing = false,
  onSave,
  onCancel,
  saveLabel,
  isSaving,
  saveDisabled,
  error,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-lg border border-neutral-100 bg-white p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-h3 text-neutral-900">{title}</h3>
            {titleAddon}
          </div>
          {description && <div className="mt-1 text-small text-neutral-600">{description}</div>}
        </div>
        {!isEditing && (actions || onEdit) && (
          <div className="flex items-center gap-2">
            {actions}
            {onEdit && <EditButton onClick={onEdit} label={`Edit ${title.toLowerCase()}`} />}
          </div>
        )}
      </div>

      {children}

      {isEditing && onSave && onCancel && (
        <EditActions
          onCancel={onCancel}
          onSave={onSave}
          saveLabel={saveLabel}
          isSaving={isSaving}
          saveDisabled={saveDisabled}
          error={error}
        />
      )}
    </div>
  );
}
