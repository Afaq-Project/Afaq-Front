import { X } from "lucide-react";
import Badge from "@/src/shared/ui/Badge";
import { ProficiencyBadge } from "@/src/shared/ui/ProficiencyBadge";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import type { LanguageDraft } from "../../hooks/useSaveLanguages";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { isLoadingName, withNameSkeleton } from "../common/nameSkeleton";

interface LanguageRowProps {
  language: LanguageDraft;
  names: ReferenceNames;
  /** Shows a remove button (edit mode only). */
  onRemove?: () => void;
}

export function LanguageRow({ language, names, onRemove }: LanguageRowProps) {
  const resolvedName = names.language(language.languageId);
  // Plain-text name for labels (the visible name may be a skeleton while loading).
  const name = isLoadingName(resolvedName) ? "language" : resolvedName ?? "Language";
  const level = names.proficiencyLevel(language.proficiencyLevelId);
  // Only add a "Native" badge when the level itself doesn't already say so.
  const showNative = language.isNative && !isLoadingName(level) && !/native/i.test(level ?? "");

  return (
    <li className="flex min-h-11 items-center gap-3 py-2">
      <span className="flex-1 text-body text-neutral-900">{withNameSkeleton(resolvedName) ?? name}</span>
      {isLoadingName(level) ? <Skeleton className="h-6 w-24 rounded-full" /> : level && <ProficiencyBadge label={level} />}
      {showNative && <Badge tone="gray">Native</Badge>}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="flex size-11 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 md:size-8"
        >
          <X size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    </li>
  );
}
