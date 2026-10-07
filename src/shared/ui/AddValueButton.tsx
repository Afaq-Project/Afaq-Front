import { Plus } from "lucide-react";

interface AddValueButtonProps {
  /** Verb-first, e.g. "Add institution". */
  label: string;
  onClick: () => void;
}

/**
 * The action shown in place of an empty value. These green actions are the page's main
 * color accent, so they point at what's missing.
 */
export function AddValueButton({ label, onClick }: AddValueButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-body font-medium text-primary-600 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 md:min-h-0"
    >
      <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
      {label}
    </button>
  );
}
